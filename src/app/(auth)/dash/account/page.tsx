import Account from './account';

async function getPrices() {
  const prices = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/api/billing-prices`,
  )
    .then((res) => res.json())
    .then((res) => res)
    .catch(() => []);
  return prices;
}

async function getCards() {
  const prices = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/api/cards`)
    .then((res) => res.json())
    .then((res) => res)
    .catch(() => []);
  return prices;
}

const AccountPage = async () => {
  const prices = await getPrices();
  // const cards = await getCards();

  return <Account prices={prices} cards={[]} />;
};

export default AccountPage;
