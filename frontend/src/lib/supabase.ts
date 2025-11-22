import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push("VITE_SUPABASE_URL");
  if (!supabaseKey) missingVars.push("VITE_SUPABASE_ANON_KEY");

  throw new Error(
    `❌ Faltan variables de entorno de Supabase: ${missingVars.join(", ")}\n` +
      `📝 Crea un archivo .env en la carpeta frontend/ con:\n` +
      `VITE_SUPABASE_URL=tu_url_de_supabase\n` +
      `VITE_SUPABASE_ANON_KEY=tu_clave_anon_key`
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
