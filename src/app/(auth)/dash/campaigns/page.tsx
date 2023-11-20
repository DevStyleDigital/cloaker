import { Card } from 'components/card';
import { campaignsMonthlyDetails } from 'mocks/data-campaigns';
import { CardCampaign } from './card-campaign';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { supabase } from 'services/supabase';

const Campaigns = async () => {
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('id, name, status, cat, requestsAmount, publishLocale');
    console.log(error)

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
        {campaignsMonthlyDetails.map((item, i) => (
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
