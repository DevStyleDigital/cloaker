const x = Math.random().toFixed(8).slice(2).slice(0, 7);
async function redirect() {
  const params = new URLSearchParams(window.location.search);
  const connection = params.get('connect');

  if (connection) {
    await fetch(`http://localhost:3000/connect?connect=${connection}`, {
      method: 'POST',
    });
    window.close();
    window.location.search = '';
  }

  const campaign = params.get('c');
  if (!campaign) return;

  window.location.href = `http://localhost:3000/${campaign}${window.location.search.replace(
    `c=${params.get('c')}`,
    `origin=${window.location.origin}`,
  )}`;
}

redirect();
