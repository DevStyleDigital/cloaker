import { AuthUser } from 'context/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getRandomColor } from 'utils/get-random-color';
import { forwardRef } from 'react';

type UserProps = {
  user: AuthUser | null;
  enableCopyEmail?: boolean;
};

export const User = forwardRef<HTMLDivElement, UserProps>(
  ({ user, enableCopyEmail }, ref) => {
    return (
      <div ref={ref} className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback
            className="text-xl font-bold"
            style={{ backgroundColor: getRandomColor() }}
            suppressHydrationWarning
          >
            {user?.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col -space-y-1 items-start">
          <p className="block font-semibold max-w-[10rem] truncate" title={user?.name}>
            {user?.name}
          </p>
          {user?.name && (
            <p
              className="block text-muted-foreground max-w-[10rem] truncate"
              role={enableCopyEmail ? 'button' : 'textbox'}
              title={enableCopyEmail ? 'clique para copiar' : user?.email}
              onClick={() =>
                enableCopyEmail && navigator.clipboard.writeText(user?.email)
              }
            >
              {user?.email}
            </p>
          )}
        </div>
      </div>
    );
  },
);
