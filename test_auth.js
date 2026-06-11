import { createClient } from '@supabase/supabase-js';

const url = 'https://dyuadrzdrphzywbnxnhz.supabase.co';
const apiKey = 'sb_publishable_rCwOvgVa1kGlO5PFAa8tRg_E1KIWKWX';

const supabase = createClient(url, apiKey);

async function testLoginAndCheckProfile() {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'pabloclsa87@gmail.com',
      password: 'Kessia.pc12'
    });
    if (authError) {
      console.log('Login failed:', authError.message);
      return;
    }
    console.log('Login success!');
    const userId = authData.user.id;
    console.log('User UUID:', userId);

    // Intentamos consultar el perfil con el cliente autenticado
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (profileError) {
      console.log('Error fetching profile:', profileError.message);
    } else {
      console.log('Profile rows found:', JSON.stringify(profileData, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
}

testLoginAndCheckProfile();
