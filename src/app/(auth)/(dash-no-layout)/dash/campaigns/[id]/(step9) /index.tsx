import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { ArrowRight, Link2 } from 'lucide-react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step9 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { blockRedirectUrl } = useCampaignData();

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      blockRedirectUrl: (ev.target as unknown as { block_redirect: HTMLInputElement })
        .block_redirect.value,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Redirecionamento BLOQ</h1>
      <p className="italic text-muted-foreground text-center">
        diga um link para redirecionamento de usuários que foram BLOQUEADOS por algum
        filtro anterior
      </p>

      <div className="mt-4 w-full">
        <Input
          placeholder="Redirecionar para"
          type="url"
          required
          className="w-full"
          icons={[Link2]}
          defaultValue={blockRedirectUrl}
          name="block_redirect"
        />
      </div>
      <Button className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
