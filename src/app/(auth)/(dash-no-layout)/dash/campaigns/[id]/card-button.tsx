import React, { forwardRef } from 'react';
import { cn } from 'utils/cn';

export const CardButton = forwardRef(
  (
    {
      desc,
      icon: Icon,
      title,
      children,
      className,
      ...props
    }: BTypes.FCProps<{
      icon: React.FC<{ className?: string }>;
      title: string;
      desc: string;
    }>,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <button
      className={cn(
        className,
        'bg-accent rounded-lg w-64 p-8 flex flex-col items-center justify-between text-center space-y-4',
      )}
      type="button"
      ref={ref}
      {...props}
    >
      <div className="flex flex-col items-center">
        <Icon className="stroke-2 w-16 h-16" />
        <h2 className="bold text-lg font-bold">{title}</h2>
        <p className="text-muted-foreground">{desc}</p>
      </div>
      {children}
    </button>
  ),
);
