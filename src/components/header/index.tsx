'use client';

import { usePathname, useRouter } from 'next/navigation';
import { InputSearch } from './input-search';
import { Button } from 'components/ui/button';
import { AlertTriangle, Bell, Receipt, RefreshCw, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { cn } from 'utils/cn';
import { notifications } from 'mocks/notifications';
import { useAuth } from 'context/auth';

const ROUTES = {
  '/dash': 'Início',
  '/dash/campaigns': 'Campanhas',
  '/dash/requests': 'Requisições',
  '/dash/account': 'Perfil',
  '/dash/admin': 'Admin',
} as Record<string, string>;

export const Header = () => {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex items-center px-7 bg-background py-5 justify-between border-b border-input fixed left-64 top-0 w-[calc(100%-16rem)] z-10">
      <div className="flex space-x-4 text-sm select-none cursor-default">
        <span className="text-muted-foreground">Dashboard</span>
        <span className="text-muted-foreground">/</span>
        <span>{ROUTES[pathname as keyof typeof ROUTES]}</span>
      </div>
      {user?.subscription ? (
        <span className="bg-blue-50 border-blue-200 text-blue-400 border px-4 rounded-full">
          {user?.subscription}
        </span>
      ) : (
        <button
          onClick={async () => {
            await supabase.auth.updateUser({ data: { subscription: 'premium' } });
            supabase.auth.refreshSession();
          }}
        >
          GET FAKE SUBSCRIPTION
        </button>
      )}

      <div className="flex gap-4">
        {/* <InputSearch /> */}
        <Button variant="ghost" onClick={() => router.refresh()} className="p-0 px-2">
          <RefreshCw className="w-6 h-6" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0 px-2">
              <Bell className="w-6 h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mr-2 w-96">
            {notifications.map((notify) => (
              <div className="flex gap-2 mt-2 items-center" key={notify.id}>
                {notify.stats !== 'none' && (
                  <div
                    className={cn('p-2 rounded-lg', {
                      'bg-green-200': notify.stats === 'receipt',
                      'bg-red-200': notify.stats === 'error',
                      'bg-yellow-200': notify.stats === 'warn',
                    })}
                  >
                    {notify.stats === 'receipt' ? (
                      <Receipt className="w-6 h-6" />
                    ) : notify.stats === 'error' ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-sm truncate max-w-xs">{notify.message}</p>
                  <time className="text-black/30 text-sm">{notify.created_at}</time>
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
