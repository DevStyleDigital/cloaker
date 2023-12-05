import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { userAgent } from 'next/server';
import { Campaign } from 'types/campaign';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export async function GET(
  request: Request,
  context: { params: { urls_redirect: string } },
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const [id, url_id] = context.params.urls_redirect.split('.');

  const campaignRes = await supabase
    .from('campaigns')
    .select('*')
    .like('id', `%.${id}%`)
    .single();

  if (!campaignRes.data || campaignRes.error) return redirect('/');

  const campaign = campaignRes.data as Campaign;

  if (campaign.status === 'inactive')
    return Response.json({ error: 'Campaign is inactive' });

  // NOT BOT AND CRAWL
  const { isBot } = userAgent(request);
  if (isBot) redirect(campaign.blockRedirectUrl);

  const geoIp = (await fetch('https://geolocation-db.com/json/').then((response) =>
    response.json(),
  )) as { country_code: string };

  // NO EXT
  if (campaign.noExt && geoIp.country_code !== 'BR') redirect(campaign.blockRedirectUrl);

  return Response.json(campaign);
}
