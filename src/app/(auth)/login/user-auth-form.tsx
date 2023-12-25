'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Lock, LogIn, Mail } from 'lucide-react';
import { cn } from 'utils/cn';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ThirdPatty } from '../ThirdPatty';
import { useAuth } from 'context/auth';
import { AuthError } from '@supabase/supabase-js';

export const UserAuthForm = () => {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);
  const handleSignIn = () => router.push('/dash');

  async function onSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();
    setLoading(true);

    const {
      email: { value: email },
      password: { value: password },
    } = ev.currentTarget as EventTarget &
      Element & { [key in 'email' | 'password']: { value: string } };

    supabase.auth
      .signInWithPassword({ email, password })
      .then((res) => {
        if (res.error) throw res.error;
        handleSignIn();
      })
      .catch((err: AuthError | null) => {
        if (err?.status === 429)
          return toast.warn(
            'Foram feitas muitas requisições, tente novamente mais tarde.',
          );
        if (err?.message === 'Invalid login credentials')
          return setError('E-mail ou senha inválidos, verifique-os e tente novamente.');
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

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              E-mail
            </Label>
            <Input
              id="email"
              placeholder="E-mail"
              type="email"
              name="email"
              autoCorrect="off"
              required
              icons={[Mail]}
              className={cn({ 'border-destructive': !!error })}
              disabled={loading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Senha
            </Label>
            <Input
              id="password"
              placeholder="Senha"
              type="password"
              name="password"
              required
              icons={[Lock]}
              className={cn({ 'border-destructive': !!error })}
              disabled={loading}
            />
          </div>
          <Link
            href="/forgot"
            className={cn('text-sm self-end', {
              'pointer-events-none': loading,
            })}
          >
            Esqueceu sua senha?
          </Link>

          <Button loading={loading} size="lg">
            Entrar <LogIn className="inline h-6 w-6 ml-4" />
          </Button>
        </div>
      </form>
      <ThirdPatty loading={loading} />
    </div>
  );
};
