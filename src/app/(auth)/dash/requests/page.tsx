'use client';
import { Filter } from 'lucide-react';
import FiltersReq from './filter';
import { DataTableDemo } from './table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import { useEffect, useState } from 'react';
import { useAuth } from 'context/auth';

export type Filters = {
  campaign: string[];
  status: string;
  devices: string[];
  countries: string[];
  domain: string;
  isp: string;
  dateFrom: Date;
  dateTo: Date;
};

const ITEM_PER_PAGE = 10;

const Requests = () => {
  const { user, supabase } = useAuth();

  const [filters, setFilters] = useState<Filters>({
    campaign: [''],
    status: '',
    devices: [''],
    countries: [''],
    domain: '',
    isp: '',
    dateFrom: new Date('2023-01-01'),
    dateTo: new Date(),
  });
  const [data, setData] = useState<any[]>([]);

  function getFromAndTo(pageP: number) {
    let from = pageP * ITEM_PER_PAGE;
    let to = from + ITEM_PER_PAGE;

    if (pageP > 0) {
      from += 1;
      to += 1;
    }

    return { from, to };
  }

  const getDataFiltered = async (pageP: number) => {
    const { from, to } = getFromAndTo(pageP);
    if (!user?.id) return [];
    console.log(filters);
    const deviceAndCountriesILike = [
      ...filters.devices,
      ...filters.countries,
      ...filters.campaign,
    ].map((p) => `%${p}%`);
    const search = `&${filters.status === 'all' ? '' : filters.status}%${
      filters.domain
    }%${filters.isp}%`;

    const { data } = deviceAndCountriesILike.length
      ? await supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id)
          .ilike('search', search)
          .ilikeAnyOf('search', deviceAndCountriesILike)
          .gte('created_at', filters.dateFrom.toISOString())
          .lte('created_at', filters.dateTo.toISOString())
          .range(from, to)
      : await supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id)
          .ilike('search', search)
          .gte('created_at', filters.dateFrom.toISOString())
          .lte('created_at', filters.dateTo.toISOString())
          .range(from, to);

    return data || [];
  };

  useEffect(() => {
    getDataFiltered(0).then((d) => setData(d));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <section className="w-full flex flex-col gap-2 p-8 max-sm:p-4">
      <div className="w-full flex h-fit items-end flex-col bg-accent rounded-md">
        <Accordion type="single" collapsible className="w-full border-b-0">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="justify-end data-[state=open]:text-primary cursor-pointer px-8">
              <Filter /> Filtrar
            </AccordionTrigger>
            <AccordionContent>
              <FiltersReq onFiltersChange={handleFiltersChange} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <DataTableDemo data={data} fetchData={getDataFiltered} />
    </section>
  );
};

export default Requests;
