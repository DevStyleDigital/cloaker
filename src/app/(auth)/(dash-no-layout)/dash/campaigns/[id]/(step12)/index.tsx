import { Button } from 'components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { FormUrl } from './form-url';
import Link from 'next/link';
import { useCampaignData } from '../campaign-form';
import { CampaignData } from 'types/campaign';

export const genNewUrlObject = () => ({
  id: Math.random().toString(16).slice(2).slice(0, 7),
  params: {} as Record<string, string>,
});

export const Step12 = ({
  handleNextStep,
  isEdit,
  userId,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
  isEdit: boolean;
  userId: string;
}) => {
  const { id: idDefault, urls: urlsDefault } = useCampaignData();
  const [campaignId] = useState(
    idDefault?.split('.')[1] || Math.random().toString(16).slice(2).slice(0, 6),
  );
  const [urls, setUrls] = useState(urlsDefault || [genNewUrlObject()]);

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      id: `${userId}.${campaignId}`,
      urls,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center gap-4"
    >
      <div>
        <h1 className="uppercase font-bold text-center">Gerar URLs</h1>
        <p className="italic text-muted-foreground text-center">
          Gerencie as urls da campanha baseado nas regras criadas.
          <br />
          Você também pode utilizar uma url longa. <Link href="/">Saiba mais</Link>
        </p>
      </div>
      <Button
        type="button"
        onClick={() => setUrls((prev) => [...prev, genNewUrlObject()])}
      >
        Adicionar <Plus className="w-4 h-4 ml-4" />
      </Button>

      {!!urls.length && (
        <div className="mt-4 w-full flex gap-4 flex-col md:max-h-[50vh] md:overflow-auto md:py-8 md:pt-4 md:pr-4">
          {urls.map((item, index) => (
            <FormUrl
              {...item}
              key={item.id}
              campaignId={campaignId}
              handleUrl={(data) => {
                setUrls((prev) => {
                  const newArray = [...prev];
                  newArray[index] = data;
                  return newArray;
                });
              }}
              handleDelete={() =>
                setUrls((prev) => {
                  const newArray = [...prev];
                  newArray.splice(index, 1);
                  return newArray;
                })
              }
            />
          ))}
        </div>
      )}
      {!urls.length && (
        <p className="italic text-sm text-muted-foreground text-center w-full">
          Nenhuma url criada.
        </p>
      )}

      <Button className="w-fit self-end mt-4 !font-normal" size="lg">
        {isEdit ? 'Editar' : 'Criar'} Campanha <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
