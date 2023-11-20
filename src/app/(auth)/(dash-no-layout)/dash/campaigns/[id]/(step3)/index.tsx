import { Button } from 'components/ui/button';
import { ArrowRight, Bot, MapPin } from 'lucide-react';
import { CardSwitch } from '../card-switch';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step3 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { noBots, noExt } = useCampaignData();

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      noBots: (ev.target as unknown as { no_bots: HTMLInputElement }).no_bots.checked,
      noExt: (ev.target as unknown as { no_ext: HTMLInputElement }).no_ext.checked,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Onde você irá publicar?</h1>
      <p className="italic text-muted-foreground">
        esses são filtros para Bloqueio de Acessos
      </p>

      <div className="mt-4 w-full flex gap-4 justify-center">
        <CardSwitch
          id="bot"
          icon={Bot}
          title="Bots"
          desc="Bloquear bots e crawlers"
          defaultChecked={noBots || true}
          name="no_bots"
        />
        <CardSwitch
          id="geo"
          icon={MapPin}
          title="Fora do Brasil"
          desc="bloquear estrangeiros (VPN incluso)"
          name="no_ext"
          defaultChecked={noExt}
        />
      </div>
      <Button className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
