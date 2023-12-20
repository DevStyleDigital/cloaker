import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { AccountInfo } from './account-info';
import { Cards } from './(cards)';
import { Payments } from './(payments)';
import { Security } from './(security)';

const Account = () => {
  return (
    <Tabs defaultValue="account" className="space-y-4 h-full">
      <TabsList className="m-8 mb-0">
        <TabsTrigger value="account">Informações da Conta</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="subscription">Assinaturas</TabsTrigger>
        <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        <TabsTrigger value="cards">Cartões</TabsTrigger>
      </TabsList>
      <AccountInfo />
      <Payments />
      <Cards />
      <Security />
    </Tabs>
  );
};

export default Account;
