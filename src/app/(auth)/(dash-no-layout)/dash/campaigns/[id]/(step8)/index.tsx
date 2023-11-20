import { Button } from 'components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { FormRedirect } from './form-redirect';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const genNewRedirectRule = () => ({
  id: Date.now().toString(),
  redirectUrl: '',
  locales: [] as string[],
  devices: [] as string[],
  rules: [] as Record<string, string>[],
});

export const Step8 = ({
  handleNextStep,
  redirectType,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
  redirectType: string;
}) => {
  const { redirects: redirectsDefault } = useCampaignData();
  const [redirects, setRedirects] = useState(redirectsDefault || [genNewRedirectRule()]);

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({ redirects });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center gap-8"
    >
      <div>
        <h1 className="uppercase font-bold">
          Redirecionamentos {redirectType === 'complex' ? 'Específicos' : 'Simples'}
        </h1>
        <p className="italic text-center text-muted-foreground">
          Forneça todos os detalhes pedidos corretamente.
        </p>
      </div>
      <Button
        type="button"
        onClick={() => setRedirects((prev) => [...prev, genNewRedirectRule()])}
      >
        Adicionar <Plus className="w-4 h-4 ml-4" />
      </Button>

      {!!redirects.length && (
        <div className="mt-4 w-full grid gap-4 grid-cols-2 md:h-[calc(60vh-10rem)] md:overflow-auto md:py-8 md:p-4">
          {redirects.map((item, index) => (
            <FormRedirect
              {...item}
              key={item.id}
              redirectType={redirectType}
              handleRedirect={(data) => {
                setRedirects((prev) => {
                  const newArray = [...prev];
                  newArray[index] = data;
                  return newArray;
                });
              }}
              handleDelete={() =>
                setRedirects((prev) => {
                  const newArray = [...prev];
                  newArray.splice(index, 1);
                  return newArray;
                })
              }
            />
          ))}
        </div>
      )}
      {!redirects.length && (
        <p className="italic text-sm text-muted-foreground text-center w-full">
          Nenhuma regra criada.
        </p>
      )}
      <Button className="w-fit self-end mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
