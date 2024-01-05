'use client';

import { useRef, useState } from 'react';
import cookies from 'js-cookie';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { LogIn, Mail, User } from 'lucide-react';
import { cn } from 'utils/cn';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ThirdPatty } from '../ThirdPatty';
import { Password } from 'components/password';
import { Tel } from 'components/tel';
import { useAuth } from 'context/auth';
import { AuthError } from '@supabase/supabase-js';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useTheme } from 'next-themes';

export const UserAuthForm = () => {
  const { resolvedTheme } = useTheme();
  const { supabase, setEmailDialogOpen } = useAuth();
  const captcha = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const clearError = () => setError(null);

  async function onSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();
    if (passwordInvalid) return;
    if (!captchaToken) return toast.warn('Faça primeiro o captcha antes de prosseguir!');

    setLoading(true);

    const {
      password: { value: password },
      tel: { value: tel },
      name: { value: name },
    } = ev.currentTarget as EventTarget &
      Element & { [key in 'email' | 'password' | 'tel' | 'name']: { value: string } };

    supabase.auth
      .signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            phone: tel,
            name,
            subscription: null,
            avatar_url: null,
          },
          captchaToken,
        },
      })
      .then(async (res) => {
        if (!res.data.user || res.error) throw res.error;
        setEmailDialogOpen(true);
        cookies.set('confirm-email', email, { expires: 365 * 2 });
        return res;
      })
      .catch((err: AuthError | null) => {
        if (err?.status === 429) {
          setEmailDialogOpen(true);
          return toast.warn(
            'Foram feitas muitas requisições, tente novamente mais tarde.',
          );
        }
        toast.error('Ocorreu um erro ao criar na sua conta, tente novamente mais tarde.');
        return err;
      })
      .finally(() => {
        setLoading(false);
        setCaptchaToken(undefined);
        captcha.current?.resetCaptcha();
      });
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
              onChange={({ target: { value } }) => setEmail(value)}
            />
          </div>
          <Tel error={!!error} loading={loading} />
          <Password
            error={!!error}
            loading={loading}
            handleInvalidState={(invalid) => setPasswordInvalid(invalid)}
          />

          <HCaptcha
            ref={captcha}
            theme={resolvedTheme as 'light'}
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY!}
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
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

      <ThirdPatty loading={loading} setLoading={setLoading} />
    </div>
  );
};
