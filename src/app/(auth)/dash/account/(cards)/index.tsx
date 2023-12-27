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

export const Cards = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [dateError, setDateError] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [cardType, setCardType] = useState<ReturnType<typeof creditCardType>>(undefined);

  useEffect(() => {
    fetch(`/api/cards?cid=${user?.paymentId}`)
      .then((res) => res.json())
      .then(setCards)
      .catch(() => []);
  }, [user]);

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
          <form onSubmit={onSubmit} className="w-full flex flex-col space-y-4">
            <div className="flex flex-col text-center">
              <h2 className="uppercase font-bold">Adicionar novo cartão</h2>
              <p className="italic text-muted-foreground">
                Adicione um novo cartão de crédito para realizar pagamentos.
              </p>
            </div>
            <Input required placeholder="Nome do cartão" name="name" />
            <InputMask
              placeholder="Número do cartão"
              icons={[CreditCard, cardType ? CardLogo({ brand: cardType }) : null]}
              required
              name="number"
              showMask={false}
              error={!cardType}
              onChange={({ target: { value } }) =>
                setCardType(creditCardType(value.replaceAll(' ', '')))
              }
              mask={[
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                ' ',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                ' ',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                ' ',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                ' ',
                /\d/,
                /\d/,
                /\d/,
              ]}
            />

            <div className="flex space-x-4">
              <Select name="month" required onValueChange={setMonth}>
                <SelectTrigger
                  className={dateError ? '!border-destructive' : undefined}
                  id="month"
                  name="month"
                  placeholder="Mês"
                />
                <SelectContent>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Otubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
              <Select name="year" required onValueChange={setYear}>
                <SelectTrigger
                  className={dateError ? '!border-destructive' : undefined}
                  id="year"
                  name="year"
                  placeholder="Ano"
                />
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                      {new Date().getFullYear() + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputMask
                id="cvc"
                name="cvc"
                required
                placeholder="CVC"
                mask={[/\d/, /\d/, /\d/]}
              />
            </div>
            {dateError && (
              <p className="text-sm text-destructive italic !mt-0">
                Seu Cartão expirou insira outro
              </p>
            )}
            <label className="flex space-x-4">
              <Switch
                className="mt-1"
                name="priority"
                disabled={!cards.length}
                defaultChecked={!cards.length ? true : false}
              />
              <span className="flex flex-col">
                <span>
                  Definir como <span className="italic">principal</span>
                </span>
                <span className="text-sm italic text-muted-foreground">
                  Ao definir como principal, este cartão será utilizado para pagamentos
                  recorrentes.
                </span>
              </span>
            </label>

            <Button loading={loading} type="submit">
              Adicionar
            </Button>
          </form>
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
