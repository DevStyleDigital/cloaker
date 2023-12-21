'use client';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { DateRangePicker } from 'components/ui/date-range-picker';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Filters } from './page';
import { MultiSelect } from 'components/ui/multi-select';
import regions from 'assets/regions.json';
import countries from 'assets/countries.json';
import { useAuth } from 'context/auth';

const FiltersReq = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: Filters) => void;
}) => {
  const { user, supabase } = useAuth();
  const [locales, setLocales] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<{ value: string; label: string }[]>([]);
  const [campaignsSelected, setCampaignsSelected] = useState<string[]>([]);
  const [devicesSelected, setDevicesSelected] = useState<string[]>([]);
  const [rangeDate, setRangeDate] = useState<Date[]>([
    new Date('2023-01-01'),
    new Date(),
  ]);

  const onSubmit = (event: any) => {
    event.preventDefault();
    const { status, domain, isp } = event.currentTarget as {
      [k: string]: HTMLInputElement;
    };
    const newFilters = {
      campaign: campaignsSelected,
      status: status?.value || '',
      devices: devicesSelected,
      countries: locales,
      domain: domain?.value || '',
      isp: isp?.value || '',
      dateFrom: rangeDate[0],
      dateTo: rangeDate[1],
    };

    onFiltersChange(newFilters);
  };

  useEffect(() => {
    if (user?.id)
      supabase
        .from('campaigns')
        .select('name, id')
        .eq('user_id', user.id)
        .then(({ data }) =>
          setCampaigns(data?.map(({ id, name }) => ({ label: name, value: id })) || []),
        );
  }, [user, supabase]);

  return (
    <form
      onSubmit={(ev) => onSubmit(ev)}
      className={clsx(
        'w-full py-4 px-8 pointer-events-auto opacity-100 flex gap-4 flex-wrap transition-all duration-100',
      )}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4">
          <Select name="status">
            <SelectTrigger className="w-full" placeholder="Status" />
            <SelectContent>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="block">Bloqueado</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker
            initialDateFrom="2023-01-01"
            initialDateTo={new Date()}
            onUpdate={({ range }) => setRangeDate([range.from, range.to || new Date()])}
            align="start"
            className="w-full"
            locale="pt-BR"
            showCompare={false}
          />
          <Input placeholder="Domínio" className="w-full" name="domain" />
          <Input placeholder="Página Destino" className="w-full" name="domain" />
          <Input placeholder="ISP" name="isp" className="w-full" />
        </div>

        <div className="flex gap-4">
          <MultiSelect
            onValueChange={setCampaignsSelected}
            options={[campaigns]}
            className="w-full"
            placeholder="Campanhas"
          />
          <MultiSelect
            onValueChange={setLocales}
            options={[
              'Regiões',
              regions.map(({ code, name }) => ({ label: name, value: code })),
              'Países',
              countries.map(({ code, name }) => ({ label: name, value: code })),
            ]}
            className="w-full"
            placeholder="Todos de localidade"
          />

          <MultiSelect
            onValueChange={setDevicesSelected}
            options={[
              [
                { value: 'phone', label: 'Celular' },
                { value: 'computer', label: 'Computador' },
                { value: 'tablet', label: 'Tablet' },
                { value: 'other', label: 'Outro' },
              ],
            ]}
            className="w-full"
            placeholder="E dispositivos"
          />
        </div>
      </div>
      <Button type="submit">
        <Filter className="w-4 h-4 mr-4" /> Filtrar
      </Button>
    </form>
  );
};

export default FiltersReq;
