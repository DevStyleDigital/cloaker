export function cors(header: HeadersInit = {}) {
  return {
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...header,
    },
  };
}
