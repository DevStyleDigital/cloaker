import { CampaignForm } from './campaign-form';
import { notFound } from 'next/navigation';
import { createSupabaseServer } from 'app/actions/supabase';

export const dynamic = 'force-dynamic';

const Campaign = async ({ params }: { params: { id: string } }) => {
  const { supabase } = createSupabaseServer();

  if (params.id === 'create')
    return (
      <section>
        <CampaignForm />
      </section>
    );

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id);

  if (error || !campaigns.length || !campaigns[0]) return notFound();

  return (
    <section>
      <CampaignForm campaignDefault={campaigns[0] as any} />
    </section>
  );
};

export default Campaign;
