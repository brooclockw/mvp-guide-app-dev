import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Asegúrate de configurar:\n" +
      "- SUPABASE_URL\n" +
      "- SUPABASE_ANON_KEY\n" +
      "- SUPABASE_SERVICE_ROLE_KEY"
  );
}

// Cliente para operaciones del lado del servidor (con service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Cliente para operaciones públicas (con anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
