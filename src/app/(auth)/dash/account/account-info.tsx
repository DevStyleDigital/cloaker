'use client';
import { UploadImageInput } from 'components/upload-image-input';
import { Tel } from 'components/tel';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth';
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

  const subscriptionColors: Record<string, string> = {
    basic: 'bg-gray-500/10 border border-gray-500 text-gray-500',
    premium: 'bg-blue-500/10 border border-blue-500 text-blue-500',
    gold: 'bg-yellow-500/10 border border-yellow-500 text-yellow-500',
  };

  const tagColor = user?.subscription && subscriptionColors[user.subscription];

  return (
    <TabsContent value="account" className="space-y-4">
      <section className="w-full flex flex-col gap-8 p-8 pb-16 max-sm:p-4 border-b max-w-7xl ml-8 bg-background rounded-lg">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Informações Pessoais</h2>
          <p className="italic text-muted-foreground">
            Atualize suas informações de perfil
          </p>
        </div>
        <form className="flex flex-col space-y-4 mt-16" onSubmit={onSubmitInfo}>
          <div className="flex flex-col justify-center items-center">
            <div>
              <div className="relative">
                <UploadImageInput
                  file={avatar_url || (user?.avatar_url ? user.avatar_url : null)}
                  className="relative border-border border-dashed text-sm text-muted-foreground aspect-square gap-4 w-52 flex rounded-full items-center justify-center bg-accent hover:border-primary border cursor-pointer transition-all"
                  handleFile={setAvatarUrl}
                  id="profile-avatar_url"
                  accept={ACCEPTED_IMAGE_FORMATS}
                  disabled={loading}
                />
                <span className="flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center w-fit space-x-2 cursor-default select-none">
                  <span
                    className={`inline-block px-4 py-px rounded-full text-sm font-bold uppercase ${
                      tagColor || ''
                    }`}
                  >
                    {user?.subscription}
                  </span>
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-center truncate max-w-52">
                {user?.name}
              </p>
            </div>
            <div className="space-y-6 w-full mt-16 flex-col flex">
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
              <Button disabled={loading} className="w-fit px-8 mx-auto">
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </section>
    </TabsContent>
  );
};
