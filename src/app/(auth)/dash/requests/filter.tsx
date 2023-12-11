'use client';
import clsx from 'clsx';
import React from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'components/ui/select';
import { DateRangePicker } from 'components/ui/date-range-picker';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';

const FiltersReq = () => {
  const onSubmit = (event: any) => {
    event.preventDefault();
    console.log(event.currentTarget.dispositivo.value);
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
          <Select>
            <SelectTrigger
              className="w-full"
              placeholder="Dispositivo"
              labelClassName="!bg-accent"
            />
            <SelectContent>
              <SelectItem value="smartphone">Smartphone</SelectItem>
              <SelectItem value="computer">Computador</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger
              className="w-full"
              placeholder="País"
              labelClassName="!bg-accent"
            />
            <SelectContent />
          </Select>
          <Input
            placeholder="Domínio"
            className="w-full"
            name="domain"
            required
            labelClassName="!bg-accent"
          />
          <Input
            placeholder="ISP"
            name="isp"
            className="w-full"
            required
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
