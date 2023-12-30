import { SupabaseClient } from '@supabase/supabase-js';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent } from 'components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export const EmailConfirmDialog = ({
  open,
  email,
  supabase,
  onClose,
}: {
  open: boolean;
  email: string;
  supabase: SupabaseClient<any, 'public', any>;
  onClose: () => void;
}) => {
  const [time, setTime] = useState<number>(1);
  const [counter, setCounter] = useState<number | null>(null);
  const [tryTomorrow, setTryTomorrow] = useState(false);

  useEffect(() => {
    const storedCounter = cookies.get('resend-counter');
    const storedTime = cookies.get('resend-time');
    const storedTomorrow = cookies.get('resend-try-tomorrow');
    if (storedCounter)
      setCounter(Math.floor((parseInt(storedCounter) - Date.now()) / 1000));

    if (storedTime) setTime(parseInt(storedTime));
    if (storedTomorrow) setTryTomorrow(true);
  }, []);

  useEffect(() => {
    if (counter !== null && counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleResendClick = (newCounter: number) => {
    setCounter(newCounter);
    cookies.set('resend-counter', String(Date.now() + newCounter * 1000), { expires: 1 });
    cookies.set('resend-time', String(time), { expires: 1 });

    supabase.auth.resend({
      email,
      type: 'signup',
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
  };

  const handleButtonClick = (seconds: number) => {
    if (time === 4) {
      cookies.set('resend-try-tomorrow', 'true', { expires: 1 });
      cookies.set('resend-counter', '0', { expires: 1 });
      cookies.set('resend-time', '1', { expires: 1 });

      setTryTomorrow(true);
      setCounter(null);
      setTime(1);
    }
    handleResendClick(seconds);
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <div className="flex items-center flex-col">
          <h2 className="text-xl font-bold">Email Enviado!</h2>
          <p className="break-all text-center">Um email foi enviado para {email}.</p>
          <span className="text-gray-600 italic text-sm mb-4 text-center">
            Verifique sua caixa de entrada ou span.
          </span>
          <CheckCircle className="w-28 h-28 text-lime-400 mb-3" />
        </div>
        <div className="flex flex-col items-center space-y-4">
          <p className="break-all text-center">Email não chegou ou expirou?</p>

          <Button
            type="button"
            variant="secondary"
            disabled={tryTomorrow || (counter !== null && counter > 0)}
            onClick={() => {
              if (time === 3) {
                handleButtonClick(60 * 60);
                setTime(4);
              } else if (time === 2) {
                handleButtonClick(60);
                setTime(3);
              } else {
                handleButtonClick(5);
                setTime(2);
              }
            }}
          >
            {tryTomorrow
              ? 'Tente novamente amanhã'
              : counter !== null && counter > 0
                ? `Tente novamente em ${
                    counter >= 60 && counter < 60 * 60
                      ? `${Math.floor(counter / 60)} minuto(s)`
                      : counter >= 60 * 60
                        ? `${counter / (60 * 60)} hora(s)`
                        : `${counter} segundo(s)`
                  } `
                : 'Reenviar email'}
          </Button>
          <Button
            variant="link"
            className="text-muted-foreground"
            onClick={() => {
              cookies.remove('resend-counter', { expires: new Date() });
              cookies.remove('resend-time', { expires: new Date() });
              cookies.remove('confirm-email', { expires: new Date() });
              cookies.remove('resend-try-tomorrow', {
                expires: new Date(),
              });
              onClose();
            }}
          >
            O email está errado? Clique aqui.
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
