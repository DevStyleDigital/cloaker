'use client';
import { UploadImageInput } from 'components/upload-image-input';
import { Tel } from 'components/tel';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth';
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
import { useRouter } from 'next/navigation';

const ACCEPTED_IMAGE_FORMATS = 'image/png,image/jpg,image/jpeg,image/webp';

export const AccountInfo = () => {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatar_url, setAvatarUrl] = useState<File | null>(null);

  async function uploadAvatar() {
    const file = avatar_url! as File;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      return 'error';
    }
    return filePath;
  }

  async function onSubmitInfo(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);

    const { name, tel } = ev.target as unknown as {
      [k: string]: HTMLInputElement;
    };

    const path =
      !avatar_url || typeof avatar_url === 'string' ? undefined : await uploadAvatar();

    if (path === 'error') {
      setLoading(false);
      toast.error('Ocorreu um erro ao atualizar seu perfil. Tente novamente mais tarde');
      return;
    }

    await fetch(`/api/admin/users/${user?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: name.value,
        phone: tel.value,
        avatar_url: path,
      }),
    })
      .then(() => {
        supabase.auth.refreshSession();
        toast.success('Atualização feita com sucesso!', { pauseOnHover: false });
        router.refresh();
      })
      .catch(() =>
        toast.error(
          'Ocorreu um erro ao atualizar na sua conta, tente novamente mais tarde.',
        ),
      );
    setLoading(false);
  }

  return (
    <TabsContent value="account" className="space-y-4">
      <section className="w-full flex flex-col gap-8 p-8 max-sm:p-4 border-b max-w-7xl ml-8 bg-background rounded-lg">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Informações Pessoais</h2>
          <p className="italic text-muted-foreground">
            Atualize suas informações de perfil
          </p>
        </div>
        <form className="flex flex-col space-y-4" onSubmit={onSubmitInfo}>
          <div className="flex space-x-16 items-end">
            <div>
              <p className="italic text-muted-foreground mb-3">Foto de perfil:</p>
              <UploadImageInput
                file={avatar_url || (user?.avatar_url ? user.avatar_url : null)}
                className="relative border-border border-dashed text-sm text-muted-foreground aspect-square gap-4 w-52 flex rounded-lg items-center justify-center bg-accent hover:border-primary border cursor-pointer transition-all"
                handleFile={setAvatarUrl}
                id="profile-avatar_url"
                accept={ACCEPTED_IMAGE_FORMATS}
                disabled={loading}
              />
            </div>
            <div className="w-full space-y-6">
              <p className="italic text-muted-foreground">Usuário:</p>
              <div className="flex space-x-4">
                <Input
                  name="name"
                  placeholder="Nome*"
                  defaultValue={user?.name}
                  required
                  disabled={loading}
                />
                <Tel error={false} defaultValue={user?.phone} loading={loading} />
              </div>
              <Input placeholder="Email" defaultValue={user?.email} disabled />
              <Button disabled={loading} className="w-fit">
                Atualizar
              </Button>
            </div>
          </div>
        </form>
        <hr className="border-none bg-destructive h-px" />
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
