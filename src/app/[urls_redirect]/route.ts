import regionsCountries from '../../assets/regions-countries.json';
import { type NextRequest, userAgent, NextResponse } from 'next/server';
import { Campaign } from 'types/campaign';
import { getDeviceType } from 'utils/get-device-type';
import { arraysEqual } from 'utils/arrays-equal';
import { createSupabaseServer } from 'services/supabase';

function formatOsName(os: string) {
  if (/Windows/i.test(os)) return 'windows';
  if (/macOS|iOS/i.test(os)) return 'apple-os';
  if (/Android/i.test(os)) return 'android';
  if (/Linux/i.test(os)) return 'linux';
  return 'other';
}

const GHOST_PROVIDERS =
  'facebook|google|yandex|amazon|azure|digitalocean|microsoft|TIKTOK PTE. LTD|AS-CHOOPA|BYTEDANCE|Latitude.sh LTDA';

function formatRule(rule: string) {
  const orRules = rule
    .trim()
    .split('|')
    .map((s) => s.trim());
  const andRules = orRules.map((or) => or.split('&').map((s) => s.trim()));
  return andRules;
}

export async function GET(
  request: NextRequest,
  context: { params: { urls_redirect: string } },
) {
  const { supabase } = createSupabaseServer();
  const [id, url_id] = context.params.urls_redirect.split('.');
  const { isBot, ua, os } = userAgent(request);
  const device = getDeviceType(ua);

  const campaignRes = await supabase
    .from('campaigns')
    .select('*, requests(count)')
    .eq('id', id)
    .single();

  function blockAccess() {
    return NextResponse.redirect(
      request.nextUrl.searchParams.get('origin') || 'https://google.com',
      { headers: { 'Set-Cookie': 'block=true; Max-Age=3600; Path=/; SameSite=Strict' } },
    );
  }

  if (!campaignRes.data || campaignRes.error) return blockAccess();
  const campaign = campaignRes.data as Campaign;
  const count = campaign.requests[0].count;

  if (
    !(campaign.useCustomDomain && !!request.nextUrl.searchParams.get('origin')) ||
    campaign.status === 'inactive'
  )
    blockAccess();

  const subscription = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/api/admin/users/${campaign.user_id}`,
  )
    .then((r) => r.json())
    .then((r) => r)
    .catch(() => null);

  if (
    (subscription.subscription === 'basic' && count >= 10000) ||
    (subscription.subscription === 'premium' && count >= 25000) ||
    (subscription.subscription === 'gold' && count >= 50000) ||
    (campaign.useCustomDomain && subscription.subscription === 'basic')
  )
    return blockAccess();

  const geoIp = (await fetch(
    `http://ip-api.com/json/${request.ip || '127.0.0.1'}?fields=isp,org,as`,
  )
    .then((response) => response.json())
    .then((res) => ({
      country_code: request.geo?.country || 'US',
      region: regionsCountries.find(({ countries }) =>
        countries.includes(request.geo?.country || 'US'),
      )?.code,
      isp: res.isp || 'server',
      org: res.org || 'server',
      as: res.as || 'server',
      IPv4: request.ip || '127.0.0.1',
    }))) as { [k in 'country_code' | 'region' | 'isp' | 'org' | 'as' | 'IPv4']: string };

  async function insertRequest(status: boolean, redirect: string) {
    const now = new Date();
    const newReq = {
      status,
      redirect,
      ua,
      system: formatOsName(os.name || 'other'),
      campaign: campaign.id,
      campaign_name: campaign.name,
      campaign_locale: campaign.publishLocale,
      ip: geoIp,
      device,
      user_id: campaign.user_id,
      origin:
        request.nextUrl.searchParams.get('origin') ||
        process.env.NEXT_PUBLIC_DOMAIN_ORIGIN,
      created_at: now,
    };
    await supabase.from('requests').insert({
      ...newReq,
      search: `&${newReq.status ? 'success' : 'block'}&${newReq.campaign}&${
        newReq.ip.country_code
      }&${newReq.ip.region}&${newReq.device}&${newReq.origin}&${newReq.ip.IPv4}&${
        newReq.ip.org
      }&${newReq.ip.isp}`,
    });
  }

  if (campaign.status === 'inactive')
    return NextResponse.json({ error: 'Campaign is inactive' });

  // NOT BOT AND CRAWL
  if (campaign.noBots && isBot) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return NextResponse.redirect(campaign.blockRedirectUrl, 302);
  }

  // NO EXT
  if (campaign.noExt && geoIp.country_code !== 'BR') {
    await insertRequest(false, campaign.blockRedirectUrl);
    return NextResponse.redirect(campaign.blockRedirectUrl, 302);
  }

  // BLOCK NO PERMITTED PROVIDERS
  if (
    [...campaign.blockProviders, campaign.userBlockProviders, GHOST_PROVIDERS].join('|')
      .length &&
    `${geoIp.as}${geoIp.isp}${geoIp.org}`
      .toLowerCase()
      .search(new RegExp(campaign.blockProviders.join('|').toLowerCase(), 'gi')) !== -1
  ) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return NextResponse.redirect(campaign.blockRedirectUrl, 302);
  }

  // BLOCK NO PERMITTED DEVICES
  if (!campaign.devices.includes(device)) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return NextResponse.redirect(campaign.blockRedirectUrl, 302);
  }

  // BLOCK NO PERMITTED OS
  if (!campaign.systems.includes(formatOsName(os.name || 'other'))) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return NextResponse.redirect(campaign.blockRedirectUrl, 302);
  }

  const paramsArr = Object.entries(
    campaign.urls?.find((item) => item.id === url_id)?.params || {},
  ).map(([a, b]) => [a, b.toLowerCase().split(',')]) as [string, string[]][];
  request.nextUrl.searchParams.forEach((v, k) => {
    paramsArr.push([k, [v.toLowerCase()]]);
  });
  const paramsUrl = paramsArr
    .reduce(
      (acc, item) => {
        const accEqualsIndex = acc.findIndex((accItem) => accItem[0] === item[0]);
        if (accEqualsIndex === -1) return [...acc, item];
        acc[accEqualsIndex][1].push(...item[1]);
        return acc;
      },
      [] as [string, string[]][],
    )
    .reduce(
      (acc, item) => {
        return { ...acc, [item[0]]: item[1] };
      },
      {} as Record<string, string[]>,
    );

  const urlsRedirect = campaign.redirects.map((redirectRule) => {
    if (!redirectRule.devices.includes(device)) return undefined;

    const region = regionsCountries.find(({ countries }) =>
      countries.includes(geoIp.country_code),
    )?.code;
    const permitLocale = redirectRule.locales.some((l) =>
      [geoIp.country_code, region].includes(l),
    );

    if (campaign.redirectType === 'simple') return redirectRule.redirectUrl;
    if (!permitLocale) return undefined;

    const paramsRules = redirectRule.rules || [];
    if (!paramsRules.length) return redirectRule.redirectUrl;

    const permit = paramsRules.some((param) => {
      return Object.entries(param).every(([key, v]) => {
        if (!paramsUrl[key]) return false;
        const permitByRule = formatRule(v).some((rule) =>
          arraysEqual(paramsUrl[key], rule),
        );
        return permitByRule;
      });
    });

    if (permit) return redirectRule.redirectUrl;
    return undefined;
  });

  const urlSuccess = urlsRedirect.find((url) => !!url);

  if (urlSuccess) {
    await insertRequest(true, urlSuccess);
    return NextResponse.redirect(urlSuccess, 302);
  }

  await insertRequest(false, campaign.blockRedirectUrl);
  return NextResponse.redirect(campaign.blockRedirectUrl, 302);
}
