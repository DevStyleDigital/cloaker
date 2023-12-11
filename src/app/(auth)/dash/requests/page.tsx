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
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

const Requests = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', session?.user.id);

  //implementar filtragem de paginação
  //implementar filtragem de pelos filtros da página (ele deve ter paginação também)
  // pode mudar a estrutura

  return (
    <section className="w-full flex flex-col gap-2 p-8 max-sm:p-4">
      <div className="w-full flex h-fit items-end flex-col bg-accent rounded-md">
        <Accordion type="single" collapsible className="w-full border-b-0">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="justify-end data-[state=open]:text-primary cursor-pointer px-8">
              <Filter /> Filtrar
            </AccordionTrigger>
            <AccordionContent>
              <FiltersReq />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <DataTableDemo data={data || []} />
    </section>
  );
};

export default Requests;
