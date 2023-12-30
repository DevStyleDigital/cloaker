'use client';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { User } from 'components/user';
import { useAuth } from 'context/auth';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { getRandomColor } from 'utils/get-random-color';

export const AvatarPopover = ({ showName = true }: { showName?: boolean }) => {
  const { user, signOut } = useAuth();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <User user={user} showName={showName} />
      </PopoverTrigger>
      <PopoverContent className="w-full flex flex-col space-y-4 rounded-sm" align="end">
        {!showName && (
          <div className="flex flex-col -space-y-1 items-start">
            <p className="block font-semibold truncate" title={user?.name}>
              {user?.name}
            </p>
            <p className="block text-muted-foreground truncate" title={user?.email}>
              {user?.email}
            </p>
          </div>
        )}
        <hr className="bg-foreground/20 border-none h-px" />
        <div className="w-full flex flex-col">
          <Button
            variant="ghost"
            type="button"
            className="text-sm justify-between"
            asChild
          >
            <Link href="/dash/account?screen=account">Informações da Conta</Link>
          </Button>
          <Button
            variant="ghost"
            type="button"
            className="text-sm justify-between"
            asChild
          >
            <Link href="/dash/account?screen=subscription">Assinaturas</Link>
          </Button>
          <Button
            variant="ghost"
            type="button"
            className="text-sm justify-between"
            asChild
          >
            <Link href="/dash/account?screen=cards">Cartões</Link>
          </Button>
        </div>

        <hr className="bg-foreground/20 border-none h-px" />
        <Button
          variant="ghost"
          type="button"
          className="text-sm justify-between"
          onClick={() => signOut()}
        >
          Sair <LogOut className="w-5 h-5 ml-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
};
