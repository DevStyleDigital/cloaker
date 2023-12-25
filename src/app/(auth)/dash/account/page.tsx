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

const AccountPage = async () => {
  const prices = await getPrices();

  return <Account prices={prices} />;
};

export default AccountPage;
