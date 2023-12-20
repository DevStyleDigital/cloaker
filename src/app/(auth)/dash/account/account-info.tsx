'use client';
import { UploadImageInput } from 'components/upload-image-input';
import { Password } from 'components/password';
import { Tel } from 'components/tel';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context/auth';

const ACCEPTED_IMAGE_FORMATS = 'image/png,image/jpg,image/jpeg,image/webp';

export const AccountInfo = () => {
  const router = useRouter();
  const { user, setUser, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatar_url, setAvatarUrl] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

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

    await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        name: name.value,
        phone: tel.value,
        avatar_url: path,
      })
      .then((res) => {
        if (res.error)
          return toast.error(
            'Ocorreu um erro ao atualizar na sua conta, tente novamente mais tarde.',
          );
        setUser((prev) => ({
          ...prev!,
          name: name.value,
          phone: tel.value,
          avatar_url: path ? URL.createObjectURL(avatar_url!) : prev?.avatar_url,
        }));
        toast.success('Atualização feita com sucesso!', { pauseOnHover: false });
      });
    setLoading(false);
  }

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
      .then((res) => {
        if (res.error?.message.includes('incorrect password')) {
          setError('true');
          return toast.error('Sua Senha está incorreta tente novamente!');
        }
        toast.success('Senha alterada com sucesso!');
        supabase.auth.signOut();
        router.refresh();
        router.push('/login');
      });
    setLoading(false);
  }

  return (
    <TabsContent value="account" className="space-y-4">
      <section className="w-full flex flex-col gap-8 p-8 max-sm:p-4 border-b">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Informações Pessoais</h2>
          <p className="italic text-muted-foreground">
            Atualize suas informações de perfil
          </p>
        </div>
        <form className="flex flex-col space-y-6" onSubmit={onSubmitInfo}>
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
          </div>

          <Button disabled={loading}>Atualizar</Button>
        </form>
      </section>
      <section className="w-full flex flex-col gap-2 p-8 max-sm:p-4 border-b">
        <div className="flex flex-col">
          <h2 className="uppercase font-bold">Segurança</h2>
          <p className="italic text-muted-foreground">
            Altere sua senha caso tenha esquecido ou suspeite de algo.
          </p>
        </div>
        <form className="flex flex-col space-y-6" onSubmit={onSubmitNewPassword}>
          <div className="flex space-x-4">
            <Input
              placeholder="Senha"
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

          <Button type="submit">Atualizar</Button>
        </form>
      </section>
    </TabsContent>
  );
};
