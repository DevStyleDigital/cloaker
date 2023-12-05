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
};

export type Campaign = CampaignData & {
  status: string;
  requestsAmount: number;
  cat: string;
  user_id: string;
};
