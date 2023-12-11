import { Button } from 'components/ui/button';
import { DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { MultiSelect } from 'components/ui/multi-select';
import { useState } from 'react';
import { useCampaignData } from '../campaign-form';

export const ParamForm = ({
  onSubmit,
  defaultParams,
}: {
  defaultParams: Record<string, string>;
  onSubmit: (rules: Record<string, string>) => void;
}) => {
  const { params } = useCampaignData();

  const [paramsSelected, setParamsSelected] = useState<string[]>(
    Object.keys(defaultParams),
  );
  const [paramsValues, setParamsValues] = useState<Record<string, string>>(
    defaultParams || {},
  );

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col text-center">
        <h2 className="uppercase font-bold">Adicionar Parâmetro</h2>
        <p className="italic text-muted-foreground">Informe o(s) parâmetro(s) criados.</p>
      </div>
      <MultiSelect
        onValueChange={setParamsSelected}
        defaultValues={paramsSelected}
        options={[params?.map((param) => ({ value: param, label: param }))]}
        placeholder="Pesquise pelos Parâmetros"
      />
      <div className="flex flex-col text-center">
        <h2 className="uppercase font-bold">Informe os valores de cada parâmetro</h2>
        <p className="italic text-muted-foreground">
          cada parametro deve conter apenas um valor, caso deseje adicionar multiplos
          valores separe por {'","'}
        </p>
      </div>
      {paramsSelected.length ? (
        <div className="grid grid-cols-3 gap-4 py-4">
          {paramsSelected.map((param) => (
            <div key={param} className="w-full flex flex-col space-y-4 items-center">
              <p>{param}</p>
              <Input
                placeholder="Valor"
                className="w-full"
                defaultValue={paramsValues[param]}
                onChange={({ target: { value } }) =>
                  setParamsValues((prev) => ({ ...prev, [param]: value }))
                }
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
            onSubmit(
              Object.entries(paramsValues)
                .filter(([k]) => paramsSelected.includes(k))
                .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
            );
          }}
        >
          Salvar
        </Button>
      </DialogTrigger>
    </div>
  );
};
