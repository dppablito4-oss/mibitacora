import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dyuadrzdrphzywbnxnhz.supabase.co";
const supabaseAnonKey = "sb_publishable_rCwOvgVa1kGlO5PFAa8tRg_E1KIWKWX";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Consultando perfiles...");

const { data: profiles, error: pError } = await supabase
  .from('profiles')
  .select('*');

if (pError) {
  console.error("Error al obtener perfiles:", pError);
} else {
  console.log("Perfiles encontrados en DB:", profiles);
}
