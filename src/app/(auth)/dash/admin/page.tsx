/* eslint-disable react-hooks/rules-of-hooks */
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
import { notFound } from 'next/navigation';

export type Filters = {};

const ITEM_PER_PAGE = 10;

const Requests = () => {
  const { user } = useAuth();

  if (user?.subscription !== process.env.NEXT_PUBLIC_ADMIN_ROLE) return notFound();

  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<any[]>([]);

  const getDataFiltered = async (pageP: number) => {
    if (user?.subscription !== process.env.NEXT_PUBLIC_ADMIN_ROLE) return [];

    const data = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({
        page: pageP,
        perPage: ITEM_PER_PAGE + 1,
      }),
    })
      .then((r) => r.json())
      .then((r) => r)
      .catch((e) => e);

    console.log(data);

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
      {/* <div className="w-full flex h-fit items-end flex-col bg-background rounded-md">
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
      </div> */}
      <DataTableDemo data={data} fetchData={getDataFiltered} />
    </section>
  );
};

export default Requests;
