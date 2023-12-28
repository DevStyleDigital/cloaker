import { CardLogo } from 'components/card-logo';
import { Button } from 'components/ui/button';
import { Input, InputMask } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { creditCardType } from 'utils/credit-card-type';

export const CardForm = ({
  onSubmit,
  cardType,
  handleCardType,
  handleMonth,
  handleYear,
  cards,
  dateError,
  loading,
  button,
  beforeForm,
}: {
  onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
  cardType: string | undefined;
  dateError: boolean;
  loading: boolean;
  cards: any[];
  handleCardType: (v: string | undefined) => void;
  handleMonth: (v: string) => void;
  handleYear: (v: string) => void;
  beforeForm?: React.ReactNode;
  button?: React.ReactNode;
}) => {
  const [cardNumber, setCardNumber] = useState('');

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col space-y-4">
      <Input required placeholder="Nome do Cartão" name="name" />
      {beforeForm}
      <InputMask
        placeholder="Número do Cartão"
        icons={[CreditCard, cardType ? CardLogo({ brand: cardType }) : null]}
        required
        name="number"
        showMask={false}
        error={!!cardNumber.length && !cardType}
        onChange={({ target: { value } }) => {
          setCardNumber(value);
          handleCardType(creditCardType(value.replaceAll(' ', '')));
        }}
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
        <Select name="month" required onValueChange={handleMonth}>
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
        <Select name="year" required onValueChange={handleYear}>
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
          Definir como principal
          <span className="text-sm italic text-muted-foreground">
            Ao definir como principal, este cartão será utilizado para pagamentos
            recorrentes.
          </span>
        </span>
      </label>

      {button || (
        <Button loading={loading} type="submit">
          Adicionar
        </Button>
      )}
    </form>
  );
};
