'use client';
import { UploadImageInput } from 'components/upload-image-input';
import { Tel } from 'components/tel';
import { Button } from 'components/ui/button';
import { Input, InputMask } from 'components/ui/input';
import { TabsContent } from 'components/ui/tabs';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import countries from 'assets/countries.json';
import { useRouter } from 'next/navigation';

const ACCEPTED_IMAGE_FORMATS = 'image/png,image/jpg,image/jpeg,image/webp';

export const AccountInfo = () => {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [client, setClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar_url, setAvatarUrl] = useState<File | null>(null);
  const [states, setStates] = useState<string[][]>([]);
  const [postalCodeMask, setPostalCodeMask] = useState<string>('');
  const [error, setError] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if ((!user?.subscription || !user?.addr) && buttonRef.current && client) {
      toast.warning('Para usar a aplicação primeiro você precisa finalizar seu cadastro');
      setError(true);
      setTimeout(() => buttonRef.current!.click(), 500);
    }
  }, [client]);

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

    const {
      name,
      tel,
      city,
      complement,
      country,
      district,
      number,
      postal_code,
      state,
      street,
    } = ev.target as unknown as {
      [k: string]: HTMLInputElement;
    };

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
          addr: {
            city: city.value,
            complement: complement.value,
            country: country.value,
            district: district.value,
            number: number.value,
            postal_code: postal_code.value,
            state: state.value,
            street: street.value,
          },
        },
      })
      .then((res) => {
        if (res.error)
          return toast.error(
            'Ocorreu um erro ao atualizar na sua conta, tente novamente mais tarde.',
          );
        supabase.auth.refreshSession();
        toast.success('Atualização feita com sucesso!', { pauseOnHover: false });
        router.refresh();
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
        <form className="flex flex-col space-y-4" onSubmit={onSubmitInfo}>
          <div className="flex space-x-16">
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
            </div>
          </div>
          <p className="italic text-muted-foreground">Endereço:</p>
          <div className="grid grid-cols-[1fr_1fr_1fr_16rem] w-full gap-4">
            <Select
              name="country"
              defaultValue={user?.addr?.country}
              required
              disabled={loading}
              onValueChange={(v) => {
                setError(false);
                setStates(countries.find(({ code }) => code === v)?.states!);
                setPostalCodeMask(countries.find(({ code }) => code === v)?.zip_code!);
              }}
            >
              <SelectTrigger className="w-full" placeholder="País*" />
              <SelectContent>
                <SelectItem value="BR">Brasil</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="state"
              required
              disabled={!states.length || loading}
              defaultValue={user?.addr?.state}
            >
              <SelectTrigger className="w-full" placeholder="Estado*" />
              <SelectContent>
                {states.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="city"
              placeholder="Cidade*"
              defaultValue={user?.addr?.city}
              required
              error={error}
              onChange={() => setError(false)}
              disabled={loading}
            />
            <InputMask
              name="postal_code"
              placeholder="CEP*"
              defaultValue={user?.addr?.postal_code}
              mask={postalCodeMask.split('').map((d) => (d === 'N' ? /\d/ : d))}
              required
              disabled={!postalCodeMask || loading}
            />
          </div>
          <div className="grid grid-cols-[20rem_1fr_8rem] w-full gap-4">
            <Input
              name="district"
              placeholder="Bairro*"
              defaultValue={user?.addr?.district}
              required
              error={error}
              onChange={() => setError(false)}
              disabled={loading}
            />
            <Input
              name="street"
              placeholder="Rua*"
              className="w-full !max-w-full"
              defaultValue={user?.addr?.street}
              required
              error={error}
              onChange={() => setError(false)}
              disabled={loading}
            />
            <Input
              name="number"
              placeholder="Número*"
              defaultValue={user?.addr?.number}
              className="w-full"
              required
              error={error}
              onChange={() => setError(false)}
              disabled={loading}
            />
          </div>
          <Input
            name="complement"
            placeholder="Complemento"
            defaultValue={user?.addr?.complement}
            disabled={loading}
          />
          <Button disabled={loading} className="w-fit" ref={buttonRef}>
            Atualizar
          </Button>
        </form>
      </section>
    </TabsContent>
  );
};
