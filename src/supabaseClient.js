import { createClient } from "@supabase/supabase-js";

// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND PUBLIC KEY
const SUPABASE_URL = "https://lpiqpflqgtcgvrzyinow.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_m1pamA7AuihLXv-dT-00WQ_tPzF4KZ8";

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
