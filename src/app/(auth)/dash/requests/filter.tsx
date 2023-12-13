'use client';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { DateRangePicker } from 'components/ui/date-range-picker';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Filters } from './page';
import { MultiSelect } from 'components/ui/multi-select';
import regions from 'assets/regions.json';
import countries from 'assets/countries.json';

const FiltersReq = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: Filters) => void;
}) => {
  const [locales, setLocales] = useState<string[]>([]);
  const [devicesSelected, setDevicesSelected] = useState<string[]>([]);

  const onSubmit = (event: any) => {
    event.preventDefault();
    const { campaign, status, device, country, domain, isp } = event.currentTarget as {
      [k: string]: HTMLInputElement;
    };
    const newFilters = {
      campaign: campaign.value || '',
      status: status.value || '',
      devices: devicesSelected,
      countries: locales,
      domain: domain.value || '',
      isp: isp.value || '',
    };

    onFiltersChange(newFilters);
  };

  return (
    <form
      onSubmit={(ev) => onSubmit(ev)}
      className={clsx(
        'w-full py-4 px-8 pointer-events-auto opacity-100 flex gap-4 flex-wrap transition-all duration-100',
      )}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4">
          <Select>
            <SelectTrigger
              className="w-full"
              placeholder="Campanha"
              labelClassName="!bg-accent"
            />
            <SelectContent />
          </Select>
          <Select>
            <SelectTrigger
              className="w-full"
              placeholder="Status"
              labelClassName="!bg-accent"
            />
            <SelectContent>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="bloq">Bloqueado</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker
            initialDateFrom="2023-01-01"
            initialDateTo={new Date(Date.now())}
            align="start"
            className="w-full"
            locale="pt-BR"
            showCompare={false}
          />
        </div>

        <div className="flex gap-4">
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
          <Input
            placeholder="Domínio"
            className="w-full"
            name="domain"
            labelClassName="!bg-accent"
          />
          <Input
            placeholder="ISP"
            name="isp"
            className="w-full"
            labelClassName="!bg-accent"
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
