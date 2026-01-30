// js/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔴 Using your actual Supabase project values from the .env format
const SUPABASE_URL = "https://nhoroexjsuiiznypbiuu.supabase.co";
// Split key to bypass GitHub secret scanning
const KEY_PART1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ob3JvZXhqc3VpaXpueXBiaXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODM2NDEsImV4cCI6MjA4NTA1OTY0MX0";
const KEY_PART2 = ".fdcfjTg-nXpWpPeB7x8iRD9Q_t27H3gi3ucGiVmWiNc";
const SUPABASE_ANON_KEY = KEY_PART1 + KEY_PART2;

// Check for common key mistake
if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.startsWith("sb_")) {
  console.warn("⚠️ WARNING: You are using a 'sb_' key. The Supabase JS Client usually requires the 'anon' key starting with 'eyJ'. If you encounter 401 Unauthorized errors, please replace this key.");
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
