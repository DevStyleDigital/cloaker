import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Link2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RuleForm, RuleFormWithTrigger } from './rule-form';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/ui/tooltip';
import { genNewRedirectRule } from '.';
import { MultiSelect } from 'components/ui/multi-select';
import { useCampaignData } from '../campaign-form';
import regions from 'assets/regions.json';
import countries from 'assets/countries.json';

export const FormRedirect = ({
  handleDelete,
  redirectType,
  handleRedirect,
  noDelete,
  ...redirect
}: {
  handleDelete: () => void;
  handleRedirect: (d: ReturnType<typeof genNewRedirectRule>) => void;
  redirectType: string;
  noDelete: boolean;
} & ReturnType<typeof genNewRedirectRule>) => {
  const { noExt, devices } = useCampaignData();

  const [redirectUrl, setRedirectUrl] = useState(redirect.redirectUrl);
  const [locales, setLocales] = useState<string[]>(redirect.locales || []);
  const [devicesSelected, setDevicesSelected] = useState<string[]>(
    redirect.devices || [],
  );
  const [rules, setRules] = useState(redirect.rules || []);

  useEffect(() => {
    handleRedirect({
      id: redirect.id,
      devices: devicesSelected,
      locales,
      redirectUrl,
      rules,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locales, devicesSelected, redirectUrl, rules]);

  return (
    <div className="w-full flex flex-col border rounded-lg shadow p-2 space-y-8 h-fit">
      <div className="flex space-x-4">
        <Input
          placeholder="Redirecionar para"
          type="url"
          className="w-full"
          icons={[Link2]}
          required
          defaultValue={redirectUrl}
          onChange={({ target: { value } }) => setRedirectUrl(value)}
        />
        {!noDelete && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  aria-label="Deletar redirecionamento"
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deletar redirecionamento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="h-fit flex flex-col">
        <MultiSelect
          onValueChange={setLocales}
          options={[
            'Regiões',
            regions.map(({ code, name }) => ({ label: name, value: code })),
            'Países',
            countries.map(({ code, name }) => ({ label: name, value: code })),
          ]}
          required
          className="w-full"
          defaultValues={!noExt ? locales : undefined}
          placeholder="Todos de localidade"
          disabled={noExt}
        />

        <MultiSelect
          onValueChange={setDevicesSelected}
          options={[
            [
              { value: 'phone', label: 'Celular' },
              { value: 'computer', label: 'Computador' },
              { value: 'tablet', label: 'Tablet' },
              { value: 'other', label: 'Outro' },
            ].filter(({ value }) => devices.includes(value)),
          ]}
          required
          className="w-full"
          defaultValues={devicesSelected.filter((value) => devices.includes(value))}
          placeholder="E dispositivos"
        />
      </div>
      {redirectType === 'complex' && (
        <div>
          <ul className="mb-4 flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">
                  Com as seguintes regras <Plus className="w-4 h-4 ml-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <RuleForm onSubmit={(rule) => setRules((prev) => [...prev, rule])} />
              </DialogContent>
            </Dialog>
            {rules.map((item, index) => (
              <li key={index}>
                <RuleFormWithTrigger
                  onSubmit={(rule) =>
                    setRules((prev) => {
                      const newArray = [...prev];
                      newArray[index] = rule;
                      return newArray;
                    })
                  }
                  deleteRule={() =>
                    setRules((prev) => {
                      const newArray = [...prev];
                      newArray.splice(index, 1);
                      return newArray;
                    })
                  }
                  index={index}
                  rule={item}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
