async function r() {
  const params = new URLSearchParams(window.location.search);
  const connection = params.get('c');
  if (connection) {
    const campaigns = document.querySelectorAll(
      `script[src="${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}}/cdn/r.min.js"]`,
    );
    if (campaigns.length === 1)
      await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/connection?connect=${connection}`,
        {
          method: 'POST',
        },
      );
    window.close();
    window.location.search = '';
    return;
  }

  const params_url = params.get('p');
  const campaign_id = document
    .querySelector(`script[src="${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}}/cdn/r.min.js"]`)
    .getAttribute('data-campaign');
  if (!campaign_id) return;

  window.location.href = `${
    process.env.NEXT_PUBLIC_DOMAIN_ORIGIN
  }/${campaign_id}.${params_url}${window.location.search.replace(
    `p=${params.get('p')}`,
    `origin=${window.location.origin}`,
  )}`;
}

r();
