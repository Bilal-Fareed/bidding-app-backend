const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://vphcbwodndnrienxknww.supabase.co"
const supabaseAnonKey = process.env.APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {supabase};