import { createClient } from '@supabase/supabase-js';

// Check if required environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Create Supabase client for server-side usage (with service role)
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Database types (will need to be generated from your Supabase schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          voter_id: string | null;
          full_name: string;
          phone: string | null;
          aadhaar_verified: boolean;
          face_data: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      elections: {
        Row: {
          id: string;
          election_type: string;
          state: string;
          start_date: string;
          end_date: string;
          status: 'active' | 'upcoming' | 'completed';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['elections']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['elections']['Insert']>;
      };
      votes: {
        Row: {
          id: string;
          election_id: string;
          voter_id: string;
          candidate_id: string;
          encrypted_vote: string;
          confirmation_id: string;
          voted_at: string;
        };
        Insert: Omit<Database['public']['Tables']['votes']['Row'], 'id' | 'voted_at'>;
        Update: never; // Votes should never be updated
      };
    };
  };
};
