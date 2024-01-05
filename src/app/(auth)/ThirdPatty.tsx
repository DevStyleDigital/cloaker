import { Google } from 'assets/svgs/logos/google';
import { Apple } from 'assets/svgs/logos/apple';
import { Button } from 'components/ui/button';
import { cn } from 'utils/cn';
import { useTheme } from 'next-themes';
import { useAuth } from 'context/auth';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AuthError } from '@supabase/supabase-js';

const pulseAnimation = 'animate-pulse pointer-events-none opacity-80';

export const ThirdPatty = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (v: boolean) => void;
}) => {
  const { resolvedTheme } = useTheme();
  const { supabase, setEmailDialogOpen } = useAuth();

  async function onSubmit(provider: 'google') {
    setLoading(true);

    supabase.auth
      .signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      .then(async (res) => {
        if (!res.data || res.error) throw res.error;
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
      });
  }

  return (
    <div className="w-full">
      <div className="relative w-full mt-10 mb-8">
        <hr className=" border-border" />
        <span className="text-sm whitespace-nowrap text-muted-foreground bg-background px-2 absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          Ou continuar com
        </span>
      </div>
      <div className="flex xs:space-x-4 max-xs:space-y-4 max-xs:flex-col">
        <Button
          variant="secondary"
          className={cn('w-full', { [pulseAnimation]: loading })}
          aria-disabled={loading}
          onClick={() => {
            onSubmit('google');
          }}
        >
          <Google className="w-6 h-6 mr-4" />
          Google
        </Button>
        <Button
          variant="secondary"
          className={cn('w-full', { [pulseAnimation]: loading })}
          aria-disabled={loading}
        >
          <Apple className="w-6 h-6 mr-4" />
          Apple
        </Button>
      </div>
    </div>
  );
};
