'use client';
import { TabsContent } from 'components/ui/tabs';
import { Table } from './table';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { CreditCard, Plus } from 'lucide-react';
import { Input, InputMask } from 'components/ui/input';
import { useState } from 'react';
import { creditCardType } from 'utils/credit-card-type';
import { VISA } from 'assets/svgs/logos/visa';
import { Mastercard } from 'assets/svgs/logos/mastercard';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { Button } from 'components/ui/button';

export const Cards = () => {
  const [cardType, setCardType] = useState<ReturnType<typeof creditCardType>>(undefined);

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
  }

  return (
    <TabsContent value="cards" className="space-y-4 p-8">
      <Dialog>
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
            <Input required placeholder="Nome do cartão" />
            <InputMask
              placeholder="Número do cartão"
              icons={[
                CreditCard,
                cardType === 'visa'
                  ? VISA
                  : cardType === 'mastercard'
                  ? Mastercard
                  : null,
              ]}
              required
              showMask={false}
              error={!!cardType && !['visa', 'mastercard'].includes(cardType)}
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
              ]}
            />

            <div className="flex space-x-4">
              <Select required>
                <SelectTrigger id="month" placeholder="Mês" />
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
              <Select required>
                <SelectTrigger id="year" placeholder="Ano" />
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

            <label className="flex space-x-4">
              <Switch className="mt-1" />
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

            <Button type="submit">Adicionar</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table />
    </TabsContent>
  );
};
