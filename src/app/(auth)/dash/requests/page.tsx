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
import { cookies } from 'next/headers';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useUser } from 'context/user';

export type Filters = {
  campaign: string;
  status: string;
  devices: string[];
  countries: string[];
  domain: string;
  isp: string;
};

const ITEM_PER_PAGE = 10;

const Requests = () => {
  const { user } = useUser();
  const supabase = createClientComponentClient();

  const [filters, setFilters] = useState({
    campaign: '',
    status: '',
    device: '',
    country: '',
    domain: '',
    isp: '',
    dateFrom: '2023-01-01',
    dateTo: new Date(Date.now()).toISOString().split('T')[0],
  });
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [disableNext, setDisableNext] = useState(false);

  function getFromAndTo(pageP: number) {
    let from = pageP * ITEM_PER_PAGE;
    const to = from * ITEM_PER_PAGE;

    if (pageP > 0) from += 1;

    return { from, to };
  }

  const getDataFiltered = async (pageP: number) => {
    const { from, to } = getFromAndTo(pageP);
    const { data, count } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', user?.id)
      // .eq('campaign', filters.campaign)
      // .eq('status', filters.status)
      // .eq('device', filters.device)
      // .eq('ip.country_code', filters.country)
      // .ilike('ip.isp', `%${filters.isp}%`)
      // .gte('created_at', filters.dateFrom)
      // .lte('created_at', filters.dateTo)
      .range(from, to);

    setPage(page + 1);
    setDisableNext((count || 0) <= ITEM_PER_PAGE);

    return data || [];
  };

  async function fetchData(pageP: number, push?: boolean) {
    await getDataFiltered(pageP).then((d) =>
      push ? setData((p) => [...p, ...d]) : setData(d),
    );
  }

  useEffect(() => {
    setPage(0);
    fetchData(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => {
    setPage(0);
    fetchData(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <DataTableDemo
        data={data}
        page={page}
        fetchData={fetchData}
        disableNext={disableNext}
      />
    </section>
  );
};

export default Requests;
