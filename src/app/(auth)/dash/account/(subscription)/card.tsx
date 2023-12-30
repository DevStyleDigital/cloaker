import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import { cn } from 'utils/cn';

export const Card = ({
  subscription,
  children,
  i,
}: {
  subscription: {
    id: string;
    t: string;
    p: string;
    d: string;
    do: [boolean, string][];
    [key: string]: any;
  };
  children?: React.ReactNode;
  i: number;
}) => {
  return (
    <li
      key={subscription.id}
      className={cn(
        'lg:w-[360px] w-full p-8 bg-background rounded-[10px] border-primary border shadow-lg flex-col justify-start items-start inline-flex',
        { 'bg-primary text-foreground': i % 2 !== 0 },
      )}
    >
      <span className="text-lg font-bold">{subscription.t}</span>
      <h2 className="text-3xl font-bold">
        {subscription.p}
        <span className="text-xl">/mês</span>
      </h2>
      <p className="opacity-70 text-sm leading-snug mt-2">{subscription.d}</p>
      <ul className="self-stretch flex-col justify-start items-start gap-4 flex mt-6">
        {subscription.do.map((item, i) => (
          <li
            key={item[1] as string}
            className="self-stretch justify-start items-start gap-2.5 inline-flex"
          >
            {item[0] ? (
              <CheckCircle className="w-5 h-5 text-lime-400" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <span className="opacity-70 text-base font-medium leading-snug">
              {item[1]}
            </span>
          </li>
        ))}
      </ul>
      {i >= 1 && (
        <div
          className={cn('self-stretch h-px my-4 bg-zinc-600 bg-opacity-10', {
            'bg-white': i % 2 !== 0,
          })}
        />
      )}
      {i >= 1 && (
        <>
          <div className="opacity-60 text-xs font-medium leading-snug">
            Recursos adicionais:
          </div>
          <div className="text-xs font-medium leading-snug">
            +0,05 por requisição adicional
          </div>
        </>
      )}
      {children}
    </li>
  );
};
