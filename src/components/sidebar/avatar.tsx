'use client';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useUser } from 'context/user';
import { LogOut } from 'lucide-react';

export const AvatarPopover = () => {
  const { user, signOut } = useUser();

  return (
    <Popover>
      <PopoverTrigger className="flex items-center space-x-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="block font-semibold truncate">{user?.name || user?.email}</span>
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
