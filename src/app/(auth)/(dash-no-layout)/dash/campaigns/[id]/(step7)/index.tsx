import { Button } from 'components/ui/button';
import { ArrowRight, Album, Plus, ShieldBan, X } from 'lucide-react';
import { CardButton } from '../card-button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { useState } from 'react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

function replaceSpecialCharacters(str: string) {
  if (str.search(/[\xC0-\xFF]/g) > -1) {
    str = str
      .replace(/[\xC0-\xC5]/g, 'A')
      .replace(/[\xC6]/g, 'AE')
      .replace(/[\xC7]/g, 'C')
      .replace(/[\xC8-\xCB]/g, 'E')
      .replace(/[\xCC-\xCF]/g, 'I')
      .replace(/[\xD0]/g, 'D')
      .replace(/[\xD1]/g, 'N')
      .replace(/[\xD2-\xD6\xD8]/g, 'O')
      .replace(/[\xD9-\xDC]/g, 'U')
      .replace(/[\xDD]/g, 'Y')
      .replace(/[\xDE]/g, 'P')
      .replace(/[\xE0-\xE5]/g, 'a')
      .replace(/[\xE6]/g, 'ae')
      .replace(/[\xE7]/g, 'c')
      .replace(/[\xE8-\xEB]/g, 'e')
      .replace(/[\xEC-\xEF]/g, 'i')
      .replace(/[\xF1]/g, 'n')
      .replace(/[\xF2-\xF6\xF8]/g, 'o')
      .replace(/[\xF9-\xFC]/g, 'u')
      .replace(/[\xFE]/g, 'p')
      .replace(/[\xFD\xFF]/g, 'y');
  }

  return str.replace(/[^A-Z0-9]+/gi, '_');
}

export const Step7 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { params: paramsDefault } = useCampaignData();
  const [param, setParam] = useState('');
  const [params, setParams] = useState<string[]>(paramsDefault || []);

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({ params });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Parâmetros</h1>
      <p className="italic text-muted-foreground">
        informe os parâmetros que poderão ser utilizados na criação das URLs
      </p>

      <div className="mt-4 w-full flex gap-4 justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <CardButton
              icon={params.length ? Album : Plus}
              title={params.length ? 'Editar' : 'Adicionar'}
              desc={
                params.length
                  ? 'editar os novos parâmetros adicionados'
                  : 'adicionar novos parâmetros'
              }
            />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center">
            <div className="flex flex-col text-center">
              <h2 className="uppercase font-bold">Criação de Parâmetros</h2>
              <p className="italic text-muted-foreground">Informe o nome do parâmetro</p>
            </div>
            <div role="form" className="flex space-x-4 w-full">
              <Input
                name="isp"
                id="isp"
                placeholder="Parâmetro"
                value={param}
                onChange={({ target: { value } }) => {
                  setParam(replaceSpecialCharacters(value));
                }}
                help='Não inclua caracteres especiais como: espaços, ! @ # $ % & * (), etc... Utilize "_" ao invés'
              />
              <Button
                type="button"
                onClick={() => {
                  if (!param.length) return;
                  setParams((prev) => (prev.includes(param) ? prev : [param, ...prev]));
                  setParam('');
                }}
              >
                Adicionar <Plus className="w-6 h-6 ml-6" />
              </Button>
            </div>
            <ul className="mb-4 mt-8 flex flex-wrap gap-4">
              {params.map((item, index) => (
                <li key={item}>
                  <button
                    type="button"
                    className="bg-ring text-background w-fit px-8 py-2 rounded-full flex items-center"
                    onClick={() =>
                      setParams((prev) => {
                        const newArray = [...prev];
                        newArray.splice(index, 1);
                        return newArray;
                      })
                    }
                  >
                    {item} <X className="w-4 h-4 ml-4" />
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
