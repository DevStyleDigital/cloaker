import { Button } from 'components/ui/button';
import { CardSelect, CardSelectItem } from 'components/ui/card-select';
import { ArrowRight, Boxes, Diamond } from 'lucide-react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';
import { useState } from 'react';

export const Step13 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { redirectType: redirectTypeDefault } = useCampaignData();
  const [redirectType, setRedirectType] = useState(redirectTypeDefault || 'simple');

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({ redirectType });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Selecione o tipo de Redirecionamentos</h1>
      <p className="italic text-muted-foreground">
        Redirecionamentos complexos permitem parâmetros.
      </p>

      <div className="mt-4 w-full">
        <CardSelect
          defaultValue={[redirectType]}
          onChangeValue={(v) => setRedirectType(v[0])}
          className="w-full flex gap-4"
        >
          <CardSelectItem value="simple">
            <Diamond />
            <span className="bold">Simples</span>
          </CardSelectItem>
          <CardSelectItem value="complex">
            <Boxes />
            <span className="bold">Complexos</span>
          </CardSelectItem>
        </CardSelect>
      </div>
      <Button type="submit" className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
