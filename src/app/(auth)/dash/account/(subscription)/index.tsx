'use client';
import { Button } from 'components/ui/button';
import { cn } from 'utils/cn';
import { TabsContent } from 'components/ui/tabs';
import { useAuth } from 'context/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { Checkout } from './checkout';
import { Card } from './card';

const services = [
  {
    id: 'basic',
    t: 'BASIC',
    p: 'R$20',
    d: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    do: [
      [true, '6 camuflagens.'],
      [true, '10 mil requisições por mês.'],
      [false, 'Detalhes avançados da requisição.'],
      [false, 'Campanhas complexas.'],
      [false, 'Domínio customizado.'],
    ] as [boolean, string][],
  },
  {
    id: 'premium',
    t: 'PRO',
    p: 'R$40',
    d: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    do: [
      [true, '20 camuflagens.'],
      [true, '25 mil requisições por mês inclusas.'],
      [true, 'Detalhes avançados da requisição.'],
      [true, 'Domínio customizado.'],
      [false, 'Campanhas complexas.'],
    ] as [boolean, string][],
  },
  {
    id: 'gold',
    t: 'GHOST',
    p: 'R$60',
    d: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    do: [
      [true, '20 camuflagens.'],
      [true, '50 mil requisições por mês inclusas.'],
      [true, 'Detalhes avançados da requisição.'],
      [true, 'Domínio customizado.'],
      [true, 'Campanhas complexas.'],
    ] as [boolean, string][],
  },
];

export const Subscription = ({ prices, cards }: { prices: any[]; cards: any[] }) => {
  const [open, setOpen] = useState(false);
  const [subscription, setSubscription] = useState<
    ((typeof services)[number] & { price: string }) | undefined
  >();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const curr = [
    user?.subscription,
    services.findIndex(({ id }) => id === user?.subscription),
  ];

  useEffect(() => {
    if (searchParams?.get('e'))
      toast.error('Não foi possível fazer o checkout. Tente novamente!');
  }, [searchParams]);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const {
      price_id: { value: price },
      subscription_index: { value: subscription_index },
    } = ev.currentTarget as unknown as { [k: string]: HTMLInputElement };

    const data = services[Number(subscription_index)];
    setSubscription({ price, ...data });
    setOpen(true);
  }

  return (
    <TabsContent value="subscription" className="space-y-4 !pb-16">
      {subscription && (
        <Checkout
          cards={cards}
          open={open}
          handleOpen={setOpen}
          subscription={subscription}
        />
      )}
      <div className="mx-8 py-16 space-y-12 flex flex-col items-center px-4 bg-white rounded-xl">
        <div className="self-stretch flex-col justify-center items-center gap-2 flex">
          <h1 className="text-center text-5xl font-bold">Nossos Planos</h1>
          <p className="!opacity-60 text-center max-w-7xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
            numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
            optio, eaque rerum!
          </p>
        </div>

        <ul className="self-stretch justify-center items-center gap-8 flex max-lg:flex-col">
          {!prices.length
            ? services.map((service, i) => (
                <Card
                  i={i}
                  key={service.id}
                  subscription={{ ...service, price_id: undefined }}
                />
              ))
            : services.map((service, i) => {
                const price = prices.find(({ nickname }: any) => nickname === service.id);
                return (
                  <Card
                    i={i}
                    key={service.id}
                    subscription={{ ...service, price_id: price?.id }}
                  >
                    <form onSubmit={onSubmit} className="w-full">
                      <input
                        type="hidden"
                        name="price_id"
                        value={price?.unit_amount_decimal.toString()}
                      />
                      <input type="hidden" name="subscription_index" value={i} />
                      <Button
                        size="lg"
                        type="submit"
                        disabled={curr[0] === service.id}
                        className={cn('w-full mt-8 [&>*]:w-full', {
                          'bg-white text-primary hover:bg-white/90': i % 2 !== 0,
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
                  </Card>
                );
              })}
        </ul>
      </div>
    </TabsContent>
  );
};
