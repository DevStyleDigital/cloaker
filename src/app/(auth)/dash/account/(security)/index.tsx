'use client';
import { Password } from 'components/password';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useAuth } from 'context/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui/alert-dialog';

export const Security = () => {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  async function onSubmitNewPassword(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (passwordInvalid) return;

    setLoading(true);
    const { password_old, password } = ev.target as unknown as {
      [k: string]: HTMLInputElement;
    };

    await supabase
      .rpc('change_user_password', {
        current_plain_password: password_old.value,
        new_plain_password: password.value,
      })
      .then(async (res) => {
        if (res.error?.message.includes('incorrect password')) {
          setError('true');
          return toast.error('Sua Senha está incorreta tente novamente!');
        }
        toast.success('Senha alterada com sucesso!');
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
      });
    setLoading(false);
  }

  return (
    <TabsContent value="security" className="space-y-4">
      <section className="w-full flex flex-col gap-2 p-8 max-sm:p-4 border-b max-w-7xl ml-8 bg-background rounded-lg">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Segurança</h2>
        </div>
        <form className="flex flex-col space-y-6 mt-8" onSubmit={onSubmitNewPassword}>
          <p className="inline-flex italic space-x-1">
            <span className="text-muted-foreground">Altere sua senha ou</span>
            <Link href={`/forgot?email=${user?.email}`}>clique aqui</Link>
            <span className="text-muted-foreground">caso tenha esquecido</span>
          </p>
          <div className="flex space-x-4 !mt-2">
            <Input
              placeholder="Senha Antiga"
              type="password"
              name="password_old"
              id="password_old"
              required
              error={!!error}
              onChange={() => setError(null)}
            />
            <div className="flex flex-col w-full">
              <Password
                placeholder="Nova Senha"
                handleInvalidState={(invalid) => setPasswordInvalid(invalid)}
                error={false}
                loading={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-fit self-end">
            Atualizar
          </Button>
        </form>
        <hr className="border-none bg-destructive h-px my-8" />
        <div className="flex flex-col">
          <h2 className="uppercase text-destructive font-bold">Area Senssível</h2>
          <p className="italic text-muted-foreground">
            Se você deletar sua conta todas as suas campanhas serão excluidas e pararão de
            funcionar!
          </p>
          <AlertDialog>
            <AlertDialogTrigger className="w-fit">
              <Button disabled={loading} variant="destructive" className="w-fit mt-4">
                Deletar minha conta!
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Você perderá todo os seus dados dentro
                  da plataforma!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="items-center">
                <AlertDialogCancel className="h-fit">Cancelar</AlertDialogCancel>
                <Button
                  disabled={loading}
                  variant="destructive"
                  className="w-fit"
                  onClick={() => {
                    setLoading(true);
                    fetch(`/api/admin/users/${user?.id}`, { method: 'DELETE' })
                      .then((r) => r.json())
                      .then(() => {
                        toast.success('Conta deletada com sucesso!');
                        router.push('/login');
                      })
                      .catch(() =>
                        toast.error(
                          'Não foi possivel deletar sua conta. Tente novamente mais tarde!',
                        ),
                      )
                      .finally(() => setLoading(false));
                  }}
                >
                  Delatar minha conta!
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </TabsContent>
  );
};
