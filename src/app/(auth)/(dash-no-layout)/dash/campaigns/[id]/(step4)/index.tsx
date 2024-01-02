import { Button } from 'components/ui/button';
import { ArrowRight, Album, Plus, ShieldBan, X, Ghost } from 'lucide-react';
import { CardSwitch } from '../card-switch';
import { CardButton } from '../card-button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { useRef, useState } from 'react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step4 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { blockProviders: blockProvidersDefault, useReadyProvidersList } =
    useCampaignData();

  const ispRef = useRef<HTMLInputElement | null>(null);
  const [blockProviders, setBlockProviders] = useState<string[]>(
    blockProvidersDefault || [],
  );

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      blockProviders,
      useReadyProvidersList: (
        ev.target as unknown as { use_ready_providers_list: HTMLInputElement }
      ).use_ready_providers_list.checked,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Provedores</h1>
      <p className="italic text-muted-foreground">
        os provedores adicionados serão BLOQUEADOS.
      </p>

      <div className="mt-4 w-full flex gap-4 justify-center">
        <CardSwitch
          id="ready"
          icon={Ghost}
          title="Inteligência Ghost"
          desc="Utilizar provedores já cadastrados"
          name="use_ready_providers_list"
          defaultChecked={useReadyProvidersList}
        />
        <CardSwitch
          id="ready"
          icon={Album}
          title="Lista pronta"
          desc="Utilizar seus provedores já cadastrados"
          name="use_ready_providers_list"
          defaultChecked={useReadyProvidersList}
        />
        <Dialog>
          <DialogTrigger asChild>
            <CardButton
              icon={blockProviders.length ? Album : Plus}
              title={blockProviders.length ? 'Editar' : 'Adicionar'}
              desc={
                blockProviders.length
                  ? 'editar os novos provedores adicionados'
                  : 'adicionar novos provedores'
              }
            />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center">
            <div className="flex flex-col text-center">
              <h2 className="uppercase font-bold">Bloquear Provedores</h2>
              <p className="italic text-muted-foreground">
                Informe o nome de um provedor
              </p>
            </div>
            <div role="form" className="flex space-x-4 w-full">
              <Input
                name="isp"
                id="isp"
                placeholder="Provedor"
                ref={ispRef}
                help="Todos os ISPs que incluirem o provedor mencionado serão bloqueados."
              />
              <Button
                type="button"
                onClick={() => {
                  if (!ispRef?.current || !ispRef.current.value) return;
                  setBlockProviders((prev) =>
                    prev.includes(ispRef.current!.value)
                      ? prev
                      : [ispRef.current!.value.toUpperCase(), ...prev],
                  );
                  ispRef.current.value = '';
                }}
              >
                Bloquear <ShieldBan className="w-6 h-6 ml-6" />
              </Button>
            </div>
            <ul className="mb-4 mt-8 flex flex-wrap gap-4">
              {blockProviders.map((isp, index) => (
                <li key={isp}>
                  <button
                    type="button"
                    className="bg-ring text-background w-fit px-8 py-2 rounded-full flex items-center"
                    onClick={() =>
                      setBlockProviders((prev) => {
                        const newArray = [...prev];
                        newArray.splice(index, 1);
                        return newArray;
                      })
                    }
                  >
                    {isp} <X className="w-4 h-4 ml-4" />
                  </button>
                </li>
              ))}
            </ul>
            <DialogTrigger asChild>
              <Button type="button" className="self-end">
                Salvar
              </Button>
            </DialogTrigger>
          </DialogContent>
        </Dialog>
      </div>
      <Button type="submit" className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
