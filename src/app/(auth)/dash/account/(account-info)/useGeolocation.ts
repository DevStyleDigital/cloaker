import { useEffect, useState } from 'react';

export function useGeolocation() {
  const [input, search] = useState('');
  const [data, setData] = useState<{
    state: string;
    city: string;
    neighborhood: string;
  } | null>(null);

  useEffect(() => {
    if (input.length < 9) return;
    const ac = new AbortController();
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://brasilapi.com.br/api/cep/v2/${input}`, { signal: ac.signal })
        .then((r) => r.json())
        .then(setData)
        .catch(() => setData(null));
    }, 3000);

    return () => {
      ac.abort();
      clearTimeout(delayDebounceFn);
    };
  }, [input]);

  return { data, search };
}
