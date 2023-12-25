'use client';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { AccountInfo } from './account-info';
import { Cards } from './(cards)';
import { Payments } from './(payments)';
import { Security } from './(security)';
import { Subscription } from './(subscription)';
import { useAuth } from 'context/auth';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Account = ({ prices }: { prices: any }) => {
  const { user } = useAuth();

  return (
    <Tabs
      defaultValue="account"
      value={!user?.subscription ? 'subscription' : undefined}
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
      <Subscription prices={prices} />
      <Cards />
      <Security />
    </Tabs>
  );
};

export default Account;
