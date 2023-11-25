'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { LogIn, Mail, User } from 'lucide-react';
import { cn } from 'utils/cn';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ThirdPatty } from '../ThirdPatty';
import { Password } from '../../../components/password';
import { Tel } from '../../../components/tel';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const UserAuthForm = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const clearError = () => setError(null);
  const handleSignUp = () => router.push('/dash');

  async function onSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();
    if (passwordInvalid) return;

    setLoading(true);

    const {
      email: { value: email },
      password: { value: password },
      tel: { value: tel },
      name: { value: name },
    } = ev.currentTarget as EventTarget &
      Element & { [key in 'email' | 'password' | 'tel' | 'name']: { value: string } };

    supabase.auth
      .signUp({ email, password })
      .then(async (res) => {
        console.log(res);
        if (!res.data.user || res.error) throw 'err';
        const upsertRes = await supabase.from('profiles').upsert({
          id: res.data.user.id,
          phone: tel,
          name,
        });

        if (upsertRes.error) throw 'err';

        handleSignUp();
        return res;
      })
      .catch((err: string) => {
        toast.error(
          'Ocorreu um erro ao entrar na sua conta, tente novamente mais tarde.',
        );
        return err;
      })
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <form onSubmit={onSubmit} onInput={clearError}>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-destructive italic">{error}</p>
          <div>
            <Label className="sr-only" htmlFor="email">
              Nome
            </Label>
            <Input
              id="name"
              placeholder="Nome"
              name="name"
              required
              icons={[User]}
              className={cn({ 'border-destructive': !!error })}
              disabled={loading}
            />
          </div>
          <div>
            <Label className="sr-only" htmlFor="email">
              E-mail
            </Label>
            <Input
              id="email"
              placeholder="E-mail"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              icons={[Mail]}
              className={cn({ 'border-destructive': !!error })}
              disabled={loading}
            />
          </div>
          <Tel error={!!error} loading={loading} />
          <Password
            error={!!error}
            loading={loading}
            handleInvalidState={(invalid) => setPasswordInvalid(invalid)}
          />

          <Button loading={loading} size="lg">
            Criar conta <LogIn className="inline h-6 w-6 ml-4" />
          </Button>
          <span className="text-muted-foreground text-[.9rem] text-center max-sm:text-[.7rem]">
            Ao clicar em “Criar conta”, você concorda com nossos{' '}
            <Link href="/terms" className="text-ring">
              Termos
            </Link>{' '}
            e{' '}
            <Link href="/privacy-policy" className="text-ring">
              Política de Privacidade
            </Link>
          </span>
        </div>
      </form>

      <ThirdPatty loading={loading} />
    </div>
  );
};
