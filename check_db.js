const url = 'https://dyuadrzdrphzywbnxnhz.supabase.co';
const apiKey = 'sb_publishable_rCwOvgVa1kGlO5PFAa8tRg_E1KIWKWX';

async function check() {
  try {
    const profRes = await fetch(`${url}/rest/v1/profiles`, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const profiles = await profRes.json();
    console.log('\n--- All rows in public.profiles ---');
    console.log(JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error(err);
  }
}

check();
