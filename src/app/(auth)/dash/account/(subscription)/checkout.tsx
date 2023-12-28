import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { CardForm } from '../card-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAuth } from 'context/auth';
import { creditCardType } from 'utils/credit-card-type';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { ArrowLeft, Mail } from 'lucide-react';
import { Card } from './card';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { CardLogo } from 'components/card-logo';
import { useRouter } from 'next/navigation';

export const Checkout = ({
  open,
  handleOpen,
  subscription,
  cards,
}: {
  open: boolean;
  handleOpen: (o: boolean) => void;
  cards: any[];
  subscription: {
    id: string;
    t: string;
    p: string;
    d: string;
    do: [boolean, string][];
    price: string;
  };
}) => {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [cardType, setCardType] = useState<ReturnType<typeof creditCardType>>(undefined);
  const [card, setCard] = useState<string | string>();

  useEffect(() => {
    if (month.length && year.length)
      setDateError(
        Number(month) <= new Date().getMonth() + 1 &&
          Number(year) <= new Date().getFullYear(),
      );
  }, [month, year]);

  const onSubmit = (card?: string) => async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (card) {
      setLoading(true);
      await fetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify({
          price: subscription.price,
          subscription: subscription.id,
          cardType,
          card,
          cid: user?.paymentId,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((r) => r.json())
        .then(async () => {
          setCardType(undefined);
          toast.success(
            'Assinatura feita! Agora você pode desfrutar de nossos recursos.',
          );
          await supabase.auth.refreshSession();
          router.push('/dash');
          handleOpen(false);
        })
        .catch(() => toast.error('Ocorreu um erro ao assinar o plano. Tente novamente!'));
      setLoading(false);

      return;
    }

    if (dateError) return;
    if (!cardType) return toast.error('Número de cartão inválido!');

    const {
      name: { value: name },
      cvc: { value: cvc },
      number: { value: number },
      email: { value: email },
      priority: { checked },
    } = ev.currentTarget as unknown as {
      [k: string]: HTMLInputElement;
    };

    setLoading(true);
    await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify({
        price: subscription.price,
        subscription: subscription.id,
        name,
        cardType,
        cvc,
        year: Number(year),
        month: Number(month),
        number,
        email,
        cid: user?.paymentId,
        priority: checked ? 'primary' : undefined,
        old_card_primary:
          checked && cards.length
            ? cards.find(({ priority }: any) => priority === 'primary').id
            : undefined,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then(async () => {
        setCardType(undefined);
        toast.success('Assinatura feita! Agora você pode desfrutar de nossos recursos.');
        await supabase.auth.refreshSession();
        router.push('/dash');
        handleOpen(false);
      })
      .catch(() => toast.error('Ocorreu um erro ao assinar o plano. Tente novamente!'));
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : handleOpen}>
      <DialogContent className="min-w-full h-[100dvh]">
        <div className="md:hidden" />
        <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
            <div className="absolute inset-0 bg-primary rounded-xl" />
            <div className="relative z-20 flex items-center text-lg font-medium text-white">
              LOGO
            </div>
            <div className="relative z-20 mx-auto my-auto flex flex-col">
              <DialogTrigger className="hover:underline flex items-center text-white p-4">
                <ArrowLeft className="mr-4" /> Voltar
              </DialogTrigger>
              <Card i={subscription.id === 'basic' ? 0 : 2} subscription={subscription} />
            </div>
            <div className="relative z-20 mt-auto text-white">
              <blockquote className="space-y-2">
                <p className="text-lg">&ldquo;Comentário sobre o plano&rdquo;</p>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-[500px]">
              <div className="flex flex-col">
                <h2 className="uppercase font-bold">Processar pagamento</h2>
                <p className="italic text-muted-foreground">
                  Adicione um cartão de crédito para realizar o pagamento.
                </p>
              </div>
              <form onSubmit={onSubmit(card)} className="w-full flex flex-col space-y-4">
                <Select name="card" required onValueChange={setCard}>
                  <SelectTrigger
                    className={dateError ? '!border-destructive' : undefined}
                    id="card"
                    name="card"
                    placeholder="Selecione um cartão"
                  />
                  <SelectContent>
                    {cards.length ? (
                      cards.map((card, i) => {
                        const Brand = CardLogo({ brand: card.company }) as BTypes.FCIcon;
                        return (
                          <SelectItem key={card.id} value={card.id}>
                            <div className="flex items-center">
                              <Brand className="w-10 h-10 mr-4" />
                              <p>**** **** **** {card.last_four_digits}</p>
                            </div>
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem
                        value="none"
                        disabled
                        className="text-center justify-center flex"
                      >
                        Nenhum Cartão adicionado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button loading={loading} type="submit" className="">
                  Assinar plano com o cartão
                </Button>
              </form>
              <div className="relative w-full mt-10 mb-4">
                <hr className=" border-border" />
                <span className="text-sm whitespace-nowrap text-muted-foreground bg-background px-2 absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
                  Ou usar um novo
                </span>
              </div>
              <CardForm
                cardType={cardType}
                cards={[[]]}
                dateError={dateError}
                handleCardType={setCardType}
                handleMonth={setMonth}
                handleYear={setYear}
                loading={loading}
                onSubmit={onSubmit()}
                beforeForm={
                  <>
                    <Input
                      id="email"
                      placeholder="E-mail"
                      type="email"
                      name="email"
                      autoCorrect="off"
                      required
                      icons={[Mail]}
                    />
                    <div className="self-stretch h-px my-4 bg-zinc-600 bg-opacity-10" />
                  </>
                }
                button={
                  <Button loading={loading} type="submit" className="w-fit">
                    Assinar plano
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
