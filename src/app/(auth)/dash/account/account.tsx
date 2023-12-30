'use client';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { AccountInfo } from './account-info';
import { Cards } from './(cards)';
import { Payments } from './(payments)';
import { Security } from './(security)';
import { Subscription } from './(subscription)';
import { useAuth } from 'context/auth';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Account = () => {
  const searchParam = useSearchParams();
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(searchParam?.get('screen') || 'account');

  useEffect(() => {
    setScreen(searchParam?.get('screen') || 'account');
  }, [searchParam]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch(`/api/cards?cid=${user?.paymentId}`, { signal: controller.signal })
        .then((res) => res.json())
        .then(setCards)
        .catch(() => []),
      fetch('/api/billing-prices', { signal: controller.signal })
        .then((res) => res.json())
        .then(setPrices)
        .catch(() => []),
    ]).finally(() => setLoading(false));

    return () => controller.abort();
  }, [user?.paymentId]);

  return (
    <Tabs
      value={!user?.subscription ? 'subscription' : screen}
      onValueChange={(s) => setScreen(s)}
      className="space-y-4 h-full"
    >
      <TabsList className="m-8 mb-0">
        <TabsTrigger disabled={!user?.subscription} value="account">
          Informações da Conta
        </TabsTrigger>
        <TabsTrigger disabled={!user?.subscription} value="security">
          Segurança
        </TabsTrigger>
        <TabsTrigger value="subscription">Assinaturas</TabsTrigger>
        <TabsTrigger disabled={!user?.subscription} value="payments">
          Pagamentos
        </TabsTrigger>
        <TabsTrigger disabled={!user?.subscription} value="cards">
          Cartões
        </TabsTrigger>
      </TabsList>
      <AccountInfo />
      <Payments />
      <Subscription cards={cards} prices={prices} />
      <Cards cards={cards} loading={loading} />
      <Security />
    </Tabs>
  );
};

export default Account;
