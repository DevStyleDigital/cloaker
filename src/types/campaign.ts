import { genNewUrlObject } from 'app/(auth)/(dash-no-layout)/dash/campaigns/[id]/(step12)';
import { genNewRedirectRule } from 'app/(auth)/(dash-no-layout)/dash/campaigns/[id]/(step8)';

export type CampaignData = {
  name: string;
  publishLocale: string;
  noBots: boolean;
  noExt: boolean;
  blockProviders: string[];
  useReadyProvidersList: boolean;
  devices: string[];
  systems: string[];
  params: string[];
  redirects: ReturnType<typeof genNewRedirectRule>[];
  blockRedirectUrl: string;
  useCustomDomain: boolean;
  id: string;
  urls: ReturnType<typeof genNewUrlObject>[];
  redirectType: string;
  customDomain: string;
};

export type Campaign = CampaignData & {
  status: string;
  requests: [{ count: number }];
  cat: string;
  user_id: string;
};

export type CampaignRequest = {
  campaign_locale: string;
  campaign_name: string;
  campaign: string;
  created_at: string;
  device: string;
  id: string;
  ip: { [k in 'country_code' | 'isp' | 'org' | 'as' | 'IPv4']: string };
  origin: string;
  redirect: string;
  status: boolean;
  system: string;
  ua: string;
  user_id: string;
};
