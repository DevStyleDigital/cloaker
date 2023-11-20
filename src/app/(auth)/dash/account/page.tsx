import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { AccountInfo } from './account-info';
import { Cards } from './(cards)';
import { Payments } from './(payments)';

const Account = () => {
  return (
    <Tabs defaultValue="account" className="space-y-4">
      <TabsList className="m-8 mb-0">
        <TabsTrigger value="account">Informações da Conta</TabsTrigger>
        <TabsTrigger value="subscription">Assinaturas</TabsTrigger>
        <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        <TabsTrigger value="cards">Cartões</TabsTrigger>
      </TabsList>
      <AccountInfo />
      <Payments />
      <Cards />
    </Tabs>
  );
};

export default Account;
