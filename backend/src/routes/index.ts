import { Router } from "express";
import type { Request, Response } from "express";

import { supabase, supabaseAdmin } from "../config";

const router = Router();

// GET /v1/elections?status=active — public reference data
router.get("/elections", async (req: Request, res: Response) => {
    let query = supabase.from("elections").select("*").order("start_date", { ascending: false });
    const status = req.query.status as string | undefined;
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: "Failed to fetch elections", details: error.message });
    return res.json({ data, success: true });
});

// GET /v1/candidates?election_id=... — public reference data
router.get("/candidates", async (req: Request, res: Response) => {
    let query = supabase.from("candidates").select("*").order("votes", { ascending: false });
    const electionId = req.query.election_id as string | undefined;
    if (electionId) query = query.eq("election_id", electionId);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: "Failed to fetch candidates", details: error.message });
    return res.json({ data, success: true });
});

// POST /v1/register — create (or return) a voter. Service role (bypasses RLS).
router.post("/register", async (req: Request, res: Response) => {
    const { full_name, voter_id, state, face_data } = req.body ?? {};
    if (!full_name || !voter_id) {
        return res.status(400).json({ error: "Full name and EPIC/voter ID are required" });
    }
    const email = `${String(voter_id).toLowerCase()}@voters.bharatvote.in`;

    const { data: existing } = await supabaseAdmin
        .from("users").select("id, full_name, voter_id").eq("voter_id", voter_id).maybeSingle();
    if (existing) return res.json({ success: true, data: existing, existed: true });

    const { data, error } = await supabaseAdmin
        .from("users")
        .insert([{ full_name, voter_id, email, state, face_data, aadhaar_verified: true }])
        .select("id, full_name, voter_id").single();
    if (error) return res.status(500).json({ error: "Failed to register", details: error.message });
    return res.status(201).json({ success: true, data });
});

// POST /v1/vote — cast a vote (one per voter per election), tally, confirm.
router.post("/vote", async (req: Request, res: Response) => {
    const { election_id, candidate_id, voter_id } = req.body ?? {};
    if (!election_id || !candidate_id || !voter_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: existingVote } = await supabaseAdmin
        .from("votes").select("id").eq("election_id", election_id).eq("voter_id", voter_id).maybeSingle();
    if (existingVote) return res.status(400).json({ error: "You have already voted in this election" });

    const confirmationId = `BV-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const encryptedVote = Buffer.from(JSON.stringify({ candidate_id, timestamp: new Date().toISOString() })).toString("base64");

    const { data, error } = await supabaseAdmin
        .from("votes")
        .insert([{ election_id, voter_id, candidate_id, encrypted_vote: encryptedVote, confirmation_id: confirmationId }])
        .select().single();
    if (error) return res.status(500).json({ error: "Failed to record vote", details: error.message });

    // Bump the candidate's running tally so results reflect it live.
    const { data: cand } = await supabaseAdmin.from("candidates").select("votes").eq("id", candidate_id).single();
    await supabaseAdmin.from("candidates").update({ votes: (cand?.votes ?? 0) + 1 }).eq("id", candidate_id);

    return res.status(201).json({ success: true, data: { confirmation_id: confirmationId, voted_at: data.voted_at } });
});

// GET /v1/vote/verify?confirmation_id=... — verify a vote by its confirmation id.
router.get("/vote/verify", async (req: Request, res: Response) => {
    const confirmationId = req.query.confirmation_id as string | undefined;
    if (!confirmationId) return res.status(400).json({ error: "Missing confirmation_id parameter" });

    const { data, error } = await supabaseAdmin
        .from("votes")
        .select("id, confirmation_id, voted_at, election:elections ( election_type, state )")
        .eq("confirmation_id", confirmationId).maybeSingle();
    if (error || !data) return res.status(404).json({ error: "Vote not found" });
    return res.json({ success: true, verified: true, data });
});

export default router;
