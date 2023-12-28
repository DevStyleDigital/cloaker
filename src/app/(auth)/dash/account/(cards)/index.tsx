'use client';
import { TabsContent } from 'components/ui/tabs';
import { Table } from './table';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { CreditCard, Plus } from 'lucide-react';
import { Input, InputMask } from 'components/ui/input';
import { useEffect, useState } from 'react';
import { creditCardType } from 'utils/credit-card-type';
import { VISA } from 'assets/svgs/logos/visa';
import { Mastercard } from 'assets/svgs/logos/mastercard';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { Button } from 'components/ui/button';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth';
import { CardLogo } from 'components/card-logo';
import { CardForm } from '../card-form';

export const Cards = ({ cards: cardsProps }: { cards: any[] }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<any[]>(cardsProps);
  const [dateError, setDateError] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [cardType, setCardType] = useState<ReturnType<typeof creditCardType>>(undefined);

  useEffect(() => {
    if (month.length && year.length)
      setDateError(
        Number(month) <= new Date().getMonth() + 1 &&
          Number(year) <= new Date().getFullYear(),
      );
  }, [month, year]);

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const {
      name: { value: name },
      cvc: { value: cvc },
      number: { value: number },
      priority: { checked },
    } = ev.currentTarget as unknown as {
      [k: string]: HTMLInputElement;
    };

    if (dateError) return;

    if (!cardType) return toast.error('Número de cartão inválido!');

    setLoading(true);

    fetch('/api/cards', {
      method: 'POST',
      body: JSON.stringify({
        brand: cardType,
        name,
        year: Number(year),
        month: Number(month),
        cvc,
        number,
        cid: user?.paymentId,
        priority: checked ? 'primary' : 'secondary',
        old_card_primary:
          checked && cards.length
            ? cards.find(({ priority }: any) => priority === 'primary').id
            : undefined,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setOpen(false);
        setCardType(undefined);
        toast.success('Cartão adicionado!');
        setCards([...cards, { ...data, company: cardType }]);
      })
      .catch(() => toast.error('Ocorreu um erro ao criar seu cartão. Tente novamente!'));
    setLoading(false);
  }

  return (
    <TabsContent
      value="cards"
      className="space-y-4 p-8 bg-background max-w-7xl rounded-xl ml-8"
    >
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger className="flex items-center justify-end w-full">
          <Plus className="w-4 h-4 mr-4" />
          Adicionar novo cartão
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col text-center">
            <h2 className="uppercase font-bold">Adicionar novo cartão</h2>
            <p className="italic text-muted-foreground">
              Adicione um novo cartão de crédito para realizar pagamentos.
            </p>
          </div>

          <CardForm
            cardType={cardType}
            cards={cards}
            dateError={dateError}
            handleCardType={setCardType}
            handleMonth={setMonth}
            handleYear={setYear}
            loading={loading}
            onSubmit={onSubmit}
          />
        </DialogContent>
      </Dialog>
      <Table
        data={cards}
        handleDeleteCard={(i, i2) => {
          setCards((prev: any) => {
            const newPrev = [...prev];
            if (i2) newPrev[i2].priority = 'primary';
            newPrev.splice(i, 1);
            return newPrev;
          });
        }}
      />
    </TabsContent>
  );
};
