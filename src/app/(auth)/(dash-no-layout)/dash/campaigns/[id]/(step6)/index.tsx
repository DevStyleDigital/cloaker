import { Button } from 'components/ui/button';
import { CardSelect, CardSelectItem } from 'components/ui/card-select';
import { ArrowRight, Apple, Bot, LayoutTemplate, Ghost, Building2 } from 'lucide-react';
import { useState } from 'react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step6 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { systems: systemsDefault } = useCampaignData();
  const [systems, setSystems] = useState<string[]>(
    systemsDefault || ['ios', 'android', 'windows', 'linux', 'other'],
  );

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      systems,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Filtrar pelo Sistema Operacional</h1>
      <p className="italic text-muted-foreground">
        Selecione os sistemas que serão permitidosNÃO selecionados serão BLOQUEADOS
      </p>

      <div className="mt-4 w-full">
        <CardSelect
          multi
          defaultValue={systems}
          onChangeValue={setSystems}
          className="w-full flex gap-4"
        >
          <CardSelectItem value="apple-os">
            <Apple />
            <span className="bold">iOS & macOS</span>
          </CardSelectItem>
          <CardSelectItem value="android">
            <Bot />
            <span className="bold">Android</span>
          </CardSelectItem>
          <CardSelectItem value="windows">
            <LayoutTemplate />
            <span className="bold">Windows</span>
          </CardSelectItem>
          <CardSelectItem value="linux">
            <Building2 />
            <span className="bold">Linux</span>
          </CardSelectItem>
          <CardSelectItem value="other">
            <Ghost />
            <span className="bold">Outro</span>
          </CardSelectItem>
        </CardSelect>
      </div>
      <Button type="submit" className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
