const url = 'https://dyuadrzdrphzywbnxnhz.supabase.co';
const apiKey = 'sb_publishable_rCwOvgVa1kGlO5PFAa8tRg_E1KIWKWX';

async function checkSiteConfig() {
  try {
    const res = await fetch(`${url}/rest/v1/site_config?id=eq.main`, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const config = await res.json();
    console.log('\n--- site_config row main ---');
    console.log(JSON.stringify(config, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkSiteConfig();
