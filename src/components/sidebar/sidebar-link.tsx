'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from 'utils/cn';

export const SidebarLink: BTypes.FC<{ href: string; disabled?: boolean }> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      aria-disabled={disabled}
      className={cn(
        className,
        'relative flex items-center px-8 py-2 opacity-80 !no-underline rounded-lg transition colors hover:opacity-95 focus:opacity-95',
        {
          'bg-muted opacity-100 hover:bg-acent focus:bg-acent': pathname === props.href,

          'opacity-50 pointer-events-none': disabled,
        },
      )}
    >
      {pathname === props.href && (
        <span className="block w-2 h-1/2 absolute left-0 bg-primary rounded-full" />
      )}
      {children}
    </Link>
  );
};
