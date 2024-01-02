import { Card } from 'components/card';
import { CardCampaign } from './card-campaign';
import { FolderOpen, Plus, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { BlockProvider } from './block-providers';
import { createSupabaseServer } from 'app/actions/supabase';

const Campaigns = async () => {
  const { supabase } = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user.user_metadata;

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(
      'id, name, status, cat, requests(count), publishLocale, useCustomDomain, customDomain, redirectType, urls',
    )
    .eq('user_id', session?.user.id);

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
      title: 'Média de Requisições por Campanha',
      label: (
        (campaigns?.reduce((acc, { requests }) => acc + requests[0].count, 0) || 0) /
        (campaigns?.length || 1)
      ).toString(),
      icon: Rocket,
    },
  ];

  return (
    <div className="px-8 py-10 flex flex-col space-y-8">
      <div className="flex items-center justify-end space-x-8">
        <BlockProvider blockProvidersDefault={user?.block_providers} uid={user?.id} />
        <Link href="/dash/campaigns/create" className="flex items-center justify-end">
          <Plus className="w-4 h-4 mr-4" />
          Criar campanha
        </Link>
      </div>
      <section className="w-full grid xl:grid-cols-3 max-[880px]:grid-cols-2 gap-2 xl:gap-6 bg-background rounded-xl py-8">
        {campaignsDetails.map((item, i) => (
          <Card key={item.id} index={i} {...item} />
        ))}
      </section>
      <div className="w-full flex gap-6 max-xl:gap-2 max-md:flex-wrap">
        {campaigns?.map((item) => <CardCampaign key={item.id} {...(item as any)} />)}
      </div>
    </div>
  );
};

export default Campaigns;
