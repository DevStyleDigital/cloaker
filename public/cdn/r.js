async function redirect() {
  const params = new URLSearchParams(window.location.search);
  const connection = params.get('connect'); // CHANGE connect TO A GOOD NAME
  if (connection) {
    await fetch(`http://localhost:3000/connection?connect=${connection}`, {
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

redirect(); // CHANGE redirect TO A GOOD NAME
