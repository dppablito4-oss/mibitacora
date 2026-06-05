import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dyuadrzdrphzywbnxnhz.supabase.co";
const supabaseAnonKey = "sb_publishable_rCwOvgVa1kGlO5PFAa8tRg_E1KIWKWX";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Consultando base de datos...");

const { data: profiles, error: pError } = await supabase
  .from('profiles')
  .select('*');

if (pError) {
  console.error("Error al obtener perfiles:", pError);
} else {
  console.log("Perfiles encontrados en DB:", profiles);
}

const { data: siteConfig, error: sError } = await supabase
  .from('site_config')
  .select('*');

if (sError) {
  console.error("Error al obtener site_config:", sError);
} else {
  console.log("site_config encontrado en DB:", siteConfig);
}
