import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { MultiSelect } from 'components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { Pen, Trash } from 'lucide-react';
import { useState } from 'react';
import { useCampaignData } from '../campaign-form';

export const RuleFormWithTrigger = ({
  deleteRule,
  rule,
  index,
  onSubmit,
}: {
  rule: Record<string, string>;
  index: number;
  deleteRule: () => void;
  onSubmit: (rule: Record<string, string>) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-ring text-background w-fit px-8 py-2 rounded-full flex items-center">
          Regra {index} <Pen className="pointer-events-none w-4 h-4 ml-4" />
          <button type="button" onClick={deleteRule}>
            <Trash className="w-4 h-4 ml-4" />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <RuleForm rule={rule} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export const RuleForm = ({
  rule,
  onSubmit,
}: {
  rule?: Record<string, string>;
  onSubmit: (rule: Record<string, string>) => void;
}) => {
  const { params } = useCampaignData();

  const [paramsValues, setParamsValues] = useState<Record<string, string>>(rule || {});
  const [paramsSelected, setParamsSelected] = useState<string[]>(Object.keys(rule || {}));

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col text-center">
        <h2 className="uppercase font-bold">Adicionar Parâmetro</h2>
        <p className="italic text-muted-foreground">
          Informe o(s) parâmetro(s) criados na step anterior
        </p>
      </div>
      <MultiSelect
        onValueChange={setParamsSelected}
        defaultValues={paramsSelected}
        options={params.map((param) => ({ value: param, label: param }))}
        placeholder="Pesquise pelos Parâmetros"
      />
      <div className="flex flex-col text-center">
        <h2 className="uppercase font-bold">Informe os valores de cada parâmetro</h2>
        <p className="italic text-muted-foreground">
          os símbolos ( ‘|’ e ‘&’ ) podem ser utilizados para criar regras mais complexas.
        </p>
      </div>
      {paramsSelected.length ? (
        <div className="grid grid-cols-3 gap-4 py-4">
          {paramsSelected.map((param) => (
            <div key={param} className="w-full flex flex-col space-y-4 items-center">
              <p>{param}</p>
              <Input
                placeholder="Adicione sua regra aqui"
                className="w-full"
                onChange={({ target: { value } }) => {
                  setParamsValues((prev) => {
                    prev[param] = value;
                    return prev;
                  });
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-muted-foreground text-center">
          Nenhum parâmetro selecionado.
        </p>
      )}

      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            onSubmit(paramsValues);
          }}
        >
          Salvar
        </Button>
      </DialogTrigger>
    </div>
  );
};
