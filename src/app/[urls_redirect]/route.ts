import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import regionsCountries from '../../assets/regions-countries.json';
import { cookies } from 'next/headers';
import { type NextRequest, userAgent } from 'next/server';
import { Campaign } from 'types/campaign';
import { getDeviceType } from 'utils/get-device-type';
import { arraysEqual } from 'utils/arrays-equal';

export const dynamic = 'force-dynamic';

function formatOsName(os: string) {
  if (/Windows/i.test(os)) return 'windows';
  if (/macOS|iOS/i.test(os)) return 'apple-os';
  if (/Android/i.test(os)) return 'android';
  if (/Linux/i.test(os)) return 'linux';
  return 'other';
}

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
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const [id, url_id] = context.params.urls_redirect.split('-');
  const { isBot, ua, os } = userAgent(request);
  const device = getDeviceType(ua);

  const campaignRes = await supabase
    .from('campaigns')
    .select('*')
    .like('id', `%.${id}%`)
    .single();

  if (!campaignRes.data || campaignRes.error)
    return Response.redirect(
      request.nextUrl.searchParams.get('origin') ||
        'https://www.youtube.com/watch?v=BjNFw2foHOI', // CHANGE TO TROLL
      302,
    );
  const campaign = campaignRes.data as Campaign;

  const geoIp = (await fetch('http://ip-api.com/json')
    .then((response) => response.json())
    .then((res) => ({
      country_code: res.countryCode,
      isp: res.isp,
      org: res.org,
      as: res.as,
      IPv4: res.query,
    }))) as { [k in 'country_code' | 'isp' | 'org' | 'as' | 'IPv4']: string };

  async function insertRequest(status: boolean, redirect: string) {
    const { error } = await supabase.from('requests').insert({
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
    });
  }

  // const { data, error } = await supabase
  //   .from('profiles')
  //   .select('plan')
  //   .eq('id', campaign.user_id)
  //   .single();

  // if (error || data.plan === 'disabled')
  //   return Response.redirect(
  //     request.nextUrl.searchParams.get('origin') || 'https://www.google.com/', // CHANGE TO URL
  //     302,
  //   );

  if (campaign.status === 'inactive')
    return Response.json({ error: 'Campaign is inactive' });

  // NOT BOT AND CRAWL
  if (isBot) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return Response.redirect(campaign.blockRedirectUrl, 302);
  }

  // NO EXT
  if (campaign.noExt && geoIp.country_code !== 'BR') {
    await insertRequest(false, campaign.blockRedirectUrl);
    return Response.redirect(campaign.blockRedirectUrl, 302);
  }

  // BLOCK NO PERMITTED PROVIDERS
  if (
    `${geoIp.as}${geoIp.isp}${geoIp.org}`
      .toLowerCase()
      .search(new RegExp(campaign.blockProviders.join('|').toLowerCase(), 'gi')) !== -1
  ) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return Response.redirect(campaign.blockRedirectUrl, 302);
  }

  // BLOCK NO PERMITTED DEVICES
  if (!campaign.devices.includes(device)) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return Response.redirect(campaign.blockRedirectUrl, 302);
  }

  // BLOCK NO PERMITTED OS
  if (campaign.devices.includes(formatOsName(os.name || 'other'))) {
    await insertRequest(false, campaign.blockRedirectUrl);
    return Response.redirect(campaign.blockRedirectUrl, 302);
  }

  const paramsArr = Object.entries(
    campaign.urls?.find((item) => item.id === url_id)?.params || {},
  ).map(([a, b]) => [a, b.toLowerCase().split(',')]) as [string, string[]][];
  let paramsUrl = {} as Record<string, string[]>;
  request.nextUrl.searchParams.forEach((v, k) => {
    paramsUrl = paramsArr
      .reduce(
        (acc, item) => {
          if (item[0] === k) item[1].push(v.toLowerCase());
          const accEqualsIndex = acc.findIndex((accItem) => accItem[0] === item[0]);
          if (accEqualsIndex !== -1) return [...acc, item];
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
  });

  const urlsRedirect = campaign.redirects.map((redirectRule) => {
    if (!redirectRule.devices.includes(device)) return undefined;

    const region = regionsCountries.find(({ countries }) =>
      countries.includes(geoIp.country_code),
    )?.code;
    const permitLocale = redirectRule.locales.some((l) =>
      [geoIp.country_code, region].includes(l),
    );

    if (!permitLocale) return undefined;
    if (campaign.redirectType === 'simple') return redirectRule.redirectUrl;

    const paramsRules = redirectRule.rules || [];
    if (!paramsRules.length) return redirectRule.redirectUrl;

    const permit = paramsRules.some((param) => {
      if (!paramsUrl[param[0]]) return false;
      const permitByRule = formatRule(param[1]).some((rule) =>
        arraysEqual(paramsUrl[param[0]], rule),
      );
      return permitByRule;
    });

    if (permit) return redirectRule.redirectUrl;
    return undefined;
  });

  const urlSuccess = urlsRedirect.find((url) => !!url);

  if (urlSuccess) {
    await insertRequest(false, urlSuccess);
    return Response.redirect(urlSuccess, 302);
  }

  await insertRequest(false, campaign.blockRedirectUrl);
  return Response.redirect(campaign.blockRedirectUrl, 302);
}
