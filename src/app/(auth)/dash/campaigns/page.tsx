import { Card } from 'components/card';
import { CardCampaign } from './card-campaign';
import { FolderOpen, Plus, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const Campaigns = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, name, status, cat, requestsAmount, publishLocale');

  const campaignsDetails = [
    {
      id: '1',
      title: 'Total de Campanhas',
      label: (campaigns?.length || 0).toString(),
      icon: FolderOpen,
    },
    {
      id: '2',
      title: 'Campanhas Ativas',
      label: (
        campaigns?.filter(({ status }) => status === 'active').length || 0
      ).toString(),
      icon: TrendingUp,
    },
    {
      id: '3',
      title: 'Média Requisições por Campanha',
      label: (
        (campaigns?.reduce((acc, { requestsAmount }) => acc + requestsAmount, 0) || 0) /
        (campaigns?.length || 1)
      ).toString(),
      icon: Rocket,
    },
  ];

  return (
    <div className="px-8 py-10 flex flex-col space-y-8">
      <Link
        href="/dash/campaigns/create"
        className="flex w-full items-center justify-end"
      >
        <Plus className="w-4 h-4 mr-4" />
        Criar campanha
      </Link>
      <section className="w-full grid grid-cols-3 gap-2 xl:gap-6">
        {campaignsDetails.map((item, i) => (
          <Card key={item.id} index={i} {...item} />
        ))}
      </section>
      <div className="w-full flex gap-6 max-xl:gap-2 max-md:flex-wrap">
        {campaigns?.map((item) => <CardCampaign key={item.id} {...item} />)}
      </div>
    </div>
  );
};

export default Campaigns;
