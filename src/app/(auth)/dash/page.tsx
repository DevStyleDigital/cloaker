import { Card } from 'components/card';
import { TrafficGraphic } from './traffic-chart';
import { PieChart } from './pie-chart';
import { Docs } from './docs';
import { DeviceChart } from './device-chart';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { CampaignRequest } from 'types/campaign';
import { formatNumber } from 'utils/format-number';
import countries from 'assets/countries.json';
import Link from 'next/link';
import { TikTok } from 'assets/svgs/logos/tiktok';
import { Instragram } from 'assets/svgs/logos/instagram';
import { Facebook } from 'assets/svgs/logos/facebook';
import { Google } from 'assets/svgs/logos/google';

function getAverageOfRequests(req: CampaignRequest[]) {
  const campaignCounts = req.reduce(
    (acc, request) => {
      acc[request.campaign] = (acc[request.campaign] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const uniqueCampaigns = Object.keys(campaignCounts);
  let totalRequests = 0;

  uniqueCampaigns.forEach((campaign) => {
    totalRequests += campaignCounts[campaign];
  });

  return totalRequests / (uniqueCampaigns.length || 1);
}

function howMuchIncreases(v1: number, v2: number) {
  const increases = ((v1 - v2) * 100) / (v2 || 1);
  return increases;
}

const Dash = async () => {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });

  const { data: monthly_details } = await supabase.rpc('get_monthly_details');

  const requests = (monthly_details?.requests || []) as CampaignRequest[];
  const last_requests = (monthly_details?.last_requests || []) as CampaignRequest[];

  const campaignsMoreVisit = Object.entries(
    requests.reduce(
      (acc, item) => {
        const newItem = {
          amount: (acc[item.campaign]?.amount || 0) + 1,
          name: acc[item.campaign]?.name || item.campaign_name,
          locale: acc[item.campaign]?.locale || item.campaign_locale,
        };
        acc[item.campaign] = newItem;
        return acc;
      },
      {} as Record<string, { amount: number; name: string; locale: string }>,
    ),
  )
    .sort((a, b) => a[1].amount - b[1].amount)
    .slice(0, 5)
    .map(([k, v]) => ({ id: k, ...v }));

  const thisMothRequestAmount = requests.length || 0;
  const lastMothRequestAmount = last_requests.length || 0;
  const thisCampaignsAverage = getAverageOfRequests(requests);

  const [blocks, success] = requests.reduce(
    (acc, item) => {
      if (item.status) acc[1] = acc[1] + 1;
      else acc[0] = acc[0] + 1;
      return acc;
    },
    [0, 0] as [number, number],
  );

  const [last_blocks, last_success] = last_requests.reduce(
    (acc, item) => {
      if (item.status) acc[1] = acc[1] + 1;
      else acc[0] = acc[0] + 1;
      return acc;
    },
    [0, 0] as [number, number],
  );

  const monthlyDetails = [
    {
      id: '1',
      title: 'Total Requisições',
      label: formatNumber(thisMothRequestAmount),
      progress_percent:
        last_requests.length &&
        formatNumber(howMuchIncreases(thisMothRequestAmount, lastMothRequestAmount)),
    },
    {
      id: '2',
      title: 'Média por Campanha',
      label: formatNumber(thisCampaignsAverage),
      progress_percent:
        last_requests.length &&
        formatNumber(
          howMuchIncreases(thisCampaignsAverage, getAverageOfRequests(last_requests)),
        ),
    },
    {
      id: '3',
      title: 'Usuários Bloqueados',
      label: formatNumber(blocks),
      progress_percent:
        last_requests.length && formatNumber(howMuchIncreases(blocks, last_blocks)),
    },
    {
      id: '4',
      title: 'Acesso Permitidos',
      label: formatNumber(success),
      progress_percent:
        last_requests.length && formatNumber(howMuchIncreases(success, last_success)),
    },
  ];

  return (
    <div className="px-8 py-10 min-h-[80vh]">
      <section className="w-full grid 2xl:grid-cols-4 max-[880px]:grid-cols-2 gap-2 xl:gap-6">
        {(monthlyDetails as any).map((item: any, i: number) => (
          <Card key={item.id} index={i} {...item} />
        ))}
      </section>
      <div className="flex w-full h-full mt-8 gap-6 max-lg:flex-col">
        <div className="grid w-full 2xl:grid-cols-2 grid-cols-1 gap-6">
          <TrafficGraphic
            data={requests.reduce(
              (acc, item) => {
                const newItem = {
                  amount: (acc[item.campaign_locale]?.amount || 0) + 1,
                  percent:
                    (((acc[item.campaign_locale]?.amount || 0) + 1) / requests.length) *
                    100,
                };

                acc[item.campaign_locale] = newItem;

                return acc;
              },
              {} as Record<string, { amount: number; percent: number }>,
            )}
          />
          <PieChart
            data={Object.entries(
              requests.reduce(
                (acc, item) => {
                  acc[item.ip.country_code] = (acc[item.ip.country_code] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([country, value]) => ({
              name: countries.find((c) => c.code === country)?.name,
              value,
              color: `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`,
            }))}
          />
          <DeviceChart
            data={requests.reduce(
              (acc, item) => {
                acc[item.system] = (acc[item.system] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            )}
          />
        </div>
        <div className="flex flex-col lg:flex-[1_1_30rem] gap-6">
          <Docs />
          <div className="max-lg:w-full max-lg:h-full lg:flex-[1_1_30rem] flex flex-col items-center gap-6 p-7 bg-accent rounded-xl">
            <h1 className="text-lg w-full font-bold">Campanhas mais vistas</h1>
            <ul className="flex flex-col w-full">
              {campaignsMoreVisit.map((item) => (
                <li key={item.id} className="w-full">
                  <Link
                    href={`/dash/campaigns/${item.id}`}
                    className="flex items-center w-full hover:bg-black/10 p-4 rounded-lg transition-all hover:no-underline group"
                  >
                    {item.locale === 'tiktok' ? (
                      <TikTok className="w-8 h-8 flex-shrink-0" />
                    ) : item.locale === 'instagram' ? (
                      <Instragram className="w-8 h-8 flex-shrink-0" />
                    ) : item.locale === 'facebook' ? (
                      <Facebook className="w-8 h-8 flex-shrink-0" />
                    ) : (
                      <Google className="w-8 h-8 flex-shrink-0" />
                    )}
                    <div className="ml-4 w-full group-hover:underline">
                      <p className="text-sm font-medium leading-none">
                        {item.name || 'Campanha'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.id.split('.')[1]}
                      </p>
                    </div>
                    <span className="font-medium whitespace-nowrap">
                      {formatNumber(item.amount).replace('+', '')} req
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;
