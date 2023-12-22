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

const Account = () => {
  const { user } = useAuth();

  return (
    <Tabs
      defaultValue="account"
      value={
        user?.addr && !user?.subscription
          ? 'subscription'
          : !user?.addr
            ? 'account'
            : undefined
      }
      className="space-y-4 h-full"
    >
      <TabsList className="m-8 mb-0">
        <TabsTrigger disabled={user?.addr && !user?.subscription} value="account">
          Informações da Conta
        </TabsTrigger>
        <TabsTrigger disabled={!user?.subscription} value="security">
          Segurança
        </TabsTrigger>
        <TabsTrigger disabled={!user?.addr} value="subscription">
          Assinaturas
        </TabsTrigger>
        <TabsTrigger disabled={!user?.subscription} value="payments">
          Pagamentos
        </TabsTrigger>
        <TabsTrigger disabled={!user?.subscription} value="cards">
          Cartões
        </TabsTrigger>
      </TabsList>
      <AccountInfo />
      <Payments />
      <Subscription />
      <Cards />
      <Security />
    </Tabs>
  );
};

export default Account;
