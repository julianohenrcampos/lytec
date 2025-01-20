import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcsfpvzcjzknklzqmzux.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjc2ZwdnpjanprbmtsenFtenV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NzY5OTYsImV4cCI6MjAyNTI1Mjk5Nn0.7tD9WQOHWfvOJSQcS5Ql5VOqVXuXwgMGGU-RH5gXqfE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);