'use client';
import { Password } from 'components/password';
import { Tel } from 'components/tel';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useAuth } from 'contexts/auth';
import Image from 'next/image';

export const AccountInfo = () => {
  const { user } = useAuth();

  return (
    <TabsContent value="account" className="space-y-4">
      <section className="w-full flex flex-col gap-8 p-8 max-sm:p-4 border-b">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Informações Pessoais</h2>
          <p className="italic text-muted-foreground">
            Atualize suas informações de perfil
          </p>
        </div>
        <form className="flex flex-col space-y-6">
          <div className="aspect-square w-52 flex rounded-lg items-center justify-center bg-accent">
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.name} />
            ) : (
              <span className="text-4xl select-none">{user?.email[0].toUpperCase()}</span>
            )}
          </div>
          <div className="w-full space-y-6">
            <div className="flex space-x-4">
              <Input placeholder="Nome" defaultValue={user?.name} required />
              <Tel error={false} loading={false} defaultValue={user?.phone} />
            </div>
            <Input placeholder="Email" value={user?.email} disabled />
          </div>

          <Button>Atualizar</Button>
        </form>
      </section>
      <section className="w-full flex flex-col gap-2 p-8 max-sm:p-4 border-b">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Segurança</h2>
          <p className="italic text-muted-foreground">
            Altere sua senha caso tenha esquecido ou suspeite de algo.
          </p>
        </div>
        <form className="flex flex-col space-y-6">
          <div className="flex space-x-4">
            <Input placeholder="Senha" type="password" required />
            <div className="flex flex-col w-full">
              <Password
                placeholder="Nova Senha"
                handleInvalidState={() => true}
                error={false}
                loading={false}
              />
            </div>
          </div>

          <Button>Atualizar</Button>
        </form>
      </section>
    </TabsContent>
  );
};
