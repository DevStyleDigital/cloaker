'use client';

import { Button } from 'components/ui/button';
import { CornerDownLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const GoBack = () => {
  const router = useRouter();

  return (
    <Button size="lg" onClick={() => router.back()}>
      Voltar <CornerDownLeft aria-hidden className="inline ml-2" />
    </Button>
  );
};
