'use client';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from 'components/ui/button';
import { cn } from 'utils/cn';
import { TabsContent } from 'components/ui/tabs';
import { useAuth } from 'context/auth';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const services = [
  {
    id: 'basic',
    t: 'Basic',
    p: 'R$20',
    d: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    do: [
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [false, 'Lorem ipsum dolor sit.'],
      [false, 'Lorem ipsum dolor sit.'],
    ],
  },
  {
    id: 'premium',
    t: 'Premium',
    p: 'R$40',
    d: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    do: [
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
    ],
  },
  {
    id: 'gold',
    t: 'Gold',
    p: 'R$60',
    d: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    do: [
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
      [true, 'Lorem ipsum dolor sit.'],
    ],
  },
];

export const Subscription = () => {
  const { user } = useAuth();

  const curr = [
    user?.subscription,
    services.findIndex(({ id }) => id === user?.subscription),
  ];

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
  }

  return (
    <TabsContent value="subscription" className="space-y-4 !mb-16">
      <div className="mx-8 py-16 space-y-12 flex flex-col items-center px-4 bg-white rounded-xl">
        <div className="self-stretch flex-col justify-center items-center gap-2 flex">
          <h1 className="text-center text-5xl font-bold">Nossos Planos</h1>
          <p className="!opacity-60 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
            numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
            optio, eaque rerum!
          </p>
        </div>

        <ul className="self-stretch justify-center items-center gap-8 flex max-lg:flex-col">
          {services.map((service, i) => (
            <li
              key={service.id}
              className={cn(
                'lg:w-[360px] w-full p-8 bg-white rounded-[10px] border-primary border shadow flex-col justify-start items-start inline-flex',
                { 'bg-primary text-white': i % 2 !== 0 },
              )}
            >
              <span className="text-lg font-bold">{service.t}</span>
              <h2 className="text-3xl font-bold">
                {service.p}
                <span className="text-xl">/mês</span>
              </h2>
              <p className="opacity-60 text-sm leading-snug mt-2">{service.d}</p>
              <ul className="self-stretch flex-col justify-start items-start gap-4 flex mt-6">
                {service.do.map((item) => (
                  <li
                    key={item[1] as string}
                    className="self-stretch justify-start items-start gap-2.5 inline-flex"
                  >
                    {item[0] ? (
                      <CheckCircle className="w-5 h-5 text-lime-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="opacity-60 text-base font-medium leading-snug">
                      {item[1]}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className={cn('self-stretch h-px my-4 bg-zinc-600 bg-opacity-10', {
                  'bg-white': i % 2 !== 0,
                })}
              />
              <div className="opacity-60 text-xs font-medium leading-snug">
                Additional Feature:
              </div>
              <div className="text-xs font-medium leading-snug">
                Contact us for additional services
              </div>
              <form onSubmit={onSubmit} className="w-full">
                <Button
                  size="lg"
                  type="submit"
                  disabled={curr[0] === service.id}
                  className={cn('w-full mt-8 [&>*]:w-full', {
                    'bg-white text-primary': i % 2 !== 0,
                  })}
                >
                  {curr[0] === service.id
                    ? 'Plano Atual'
                    : i < (curr[1] as number)
                      ? 'Perder Recursos'
                      : curr[0]
                        ? 'Aumentar o Nível'
                        : 'Escolher'}
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </TabsContent>
  );
};
