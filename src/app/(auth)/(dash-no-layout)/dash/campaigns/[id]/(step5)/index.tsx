import { Button } from 'components/ui/button';
import { CardSelect, CardSelectItem } from 'components/ui/card-select';
import { ArrowRight, Smartphone, Tv2, Tablet, Ghost } from 'lucide-react';
import { useState } from 'react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step5 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { devices: devicesDefault } = useCampaignData();
  const [devices, setDevices] = useState(
    devicesDefault || ['phone', 'computer', 'tablet'],
  );

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      devices,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Filtrar pelo dispositivo</h1>
      <p className="italic text-muted-foreground">
        Os dispositivos NÃO selecionados serão BLOQUEADOS
      </p>

      <div className="mt-4 w-full">
        <CardSelect
          multi
          defaultValue={devices}
          onChangeValue={setDevices}
          className="w-full flex gap-4"
        >
          <CardSelectItem value="phone">
            <Smartphone />
            <span className="bold">Celular</span>
          </CardSelectItem>
          <CardSelectItem value="computer">
            <Tv2 />
            <span className="bold">Computador</span>
          </CardSelectItem>
          <CardSelectItem value="tablet">
            <Tablet />
            <span className="bold">Tablet</span>
          </CardSelectItem>
          <CardSelectItem value="other">
            <Ghost />
            <span className="bold">Outro</span>
          </CardSelectItem>
        </CardSelect>
      </div>
      <Button className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
