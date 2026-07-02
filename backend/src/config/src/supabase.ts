import { createClient } from "@supabase/supabase-js";

import { env } from "./env";
import { log } from "./logger";

// Public / anon client — bound by Row Level Security. Used for public reads
// (elections, candidates). Safe even though it is server-side.
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false },
});

// Privileged service-role client — bypasses RLS. Used ONLY for writes and for
// reading the sensitive users/votes tables. Never expose this beyond the server.
export const supabaseAdmin = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});

// Connectivity check used at startup — a lightweight read of a public table.
export const verifySupabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from("elections").select("id").limit(1);
        if (error) {
            log.error("Supabase connectivity check failed");
            return false;
        }
        return true;
    } catch (error) {
        log.error("Unexpected Supabase connectivity failure");
        return false;
    }
};
