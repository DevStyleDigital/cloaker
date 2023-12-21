'use client';
import { UploadImageInput } from 'components/upload-image-input';
import { Password } from 'components/password';
import { Tel } from 'components/tel';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth';

const ACCEPTED_IMAGE_FORMATS = 'image/png,image/jpg,image/jpeg,image/webp';

export const AccountInfo = () => {
  const { user, setUser, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatar_url, setAvatarUrl] = useState<File | null>(null);

  async function uploadAvatar() {
    const file = avatar_url! as File;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}.${fileExt}`;
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

    const { name, tel } = ev.target as unknown as { [k: string]: HTMLInputElement };

    const path =
      !avatar_url || typeof avatar_url === 'string' ? undefined : await uploadAvatar();

    if (path === 'error') {
      setLoading(false);
      toast.error('Ocorreu um erro ao atualizar seu perfil. Tente novamente mais tarde');
      return;
    }

    await supabase.auth
      .updateUser({
        data: {
          name: name.value,
          phone: tel.value,
          avatar_url: path,
        },
      })
      .then((res) => {
        if (res.error)
          return toast.error(
            'Ocorreu um erro ao atualizar na sua conta, tente novamente mais tarde.',
          );
        supabase.auth.refreshSession();
        toast.success('Atualização feita com sucesso!', { pauseOnHover: false });
      });
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
        <form className="flex  items-end space-x-16" onSubmit={onSubmitInfo}>
          <div>
            <p className="italic text-muted-foreground">Foto de perfil:</p>
            <UploadImageInput
              file={avatar_url || user?.avatar_url!}
              className="relative border-border border-dashed text-sm text-muted-foreground aspect-square gap-4 w-52 flex rounded-lg items-center justify-center bg-accent hover:border-primary border cursor-pointer transition-all"
              handleFile={setAvatarUrl}
              id="profile-avatar_url"
              accept={ACCEPTED_IMAGE_FORMATS}
              disabled={loading}
            />
          </div>
          <div className="w-full space-y-6">
            <div className="flex space-x-4">
              <Input
                name="name"
                placeholder="Nome"
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
        </form>
      </section>
    </TabsContent>
  );
};
