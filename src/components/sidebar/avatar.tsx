'use client';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { User } from 'components/user';
import { useAuth } from 'context/auth';
import { LogOut } from 'lucide-react';
import { getRandomColor } from 'utils/get-random-color';

export const AvatarPopover = () => {
  const { user, signOut } = useAuth();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <User user={user} />
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-sm" align="start">
        <button
          type="button"
          className="flex items-center text-sm"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5 mr-4" /> Sair
        </button>
      </PopoverContent>
    </Popover>
  );
};
