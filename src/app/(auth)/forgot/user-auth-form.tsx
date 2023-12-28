'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Mail, Send } from 'lucide-react';
import { cn } from 'utils/cn';
import { useAuth } from 'context/auth';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Password } from 'components/password';

export const UserAuthForm = () => {
  const router = useRouter();
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const searchParams = useSearchParams();

  const clearError = () => setError(null);

  async function onSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();

    const { email, password } = ev.currentTarget as unknown as {
      [k: string]: HTMLInputElement;
    };
    setLoading(true);

    if (searchParams?.get('code')) {
      if (passwordInvalid) return setLoading(false);
      await fetch('/api/forgot', {
        body: JSON.stringify({ password: password.value }),
        method: 'POST',
      })
        .then((r) => r.json())
        .then(() => {
          toast.success('Senha alterada com sucesso!');
          router.push('/login');
        })
        .catch(() => {
          toast.error(
            'Ocorreu um error ao alterar sua senha. Tente novamente mais tarde!',
          );
        });
      return setLoading(false);
    }

    supabase.auth
      .resetPasswordForEmail(email.value, {
        redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!}/forgot`,
      })
      .then((res) => {
        if (res.error) throw res.error.message;
        toast.success('Enviamos uma mensagem para seu e-mail.');
      })
      .catch((err: any) => {
        toast.error('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde!');
        return err;
      })
      .finally(() => setLoading(false));
  }

  return !searchParams?.get('code') ? (
    <div>
      <form onSubmit={onSubmit} onInput={clearError}>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-destructive italic">{error}</p>

          <div className="grid gap-1 !mb-8">
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
              defaultValue={searchParams?.get('email') || undefined}
              icons={[Mail]}
              className={cn({ 'border-destructive': !!error })}
              disabled={loading}
              help="Seu e-mail para enviarmos um link para recuperar sua conta"
            />
          </div>

          <Button loading={loading} size="lg">
            Recuperar conta <Send className="inline h-6 w-6 ml-4" />
          </Button>
        </div>
      </form>
    </div>
  ) : (
    <div>
      <form onSubmit={onSubmit} onInput={clearError}>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-destructive italic">{error}</p>

          <div className="grid gap-1 !mb-8">
            <div className="flex flex-col w-full">
              <Password
                placeholder="Nova Senha"
                handleInvalidState={(invalid) => setPasswordInvalid(invalid)}
                error={false}
                loading={loading}
              />
            </div>
          </div>

          <Button loading={loading} size="lg">
            Recuperar conta <Send className="inline h-6 w-6 ml-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
