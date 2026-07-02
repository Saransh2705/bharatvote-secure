"use client"

// Lightweight client-side voter session (demo). A registered/logged-in voter
// is stored in localStorage and used by the voting flow.
export type BVUser = { id: string; full_name: string; voter_id?: string | null };

const KEY = 'bv_user';

export function getUser(): BVUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BVUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: BVUser) {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearUser() {
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}
