'use client';

import { DocsVector } from 'assets/svgs/docs';
import { Button } from 'components/ui/button';
import Link from 'next/link';

export const Docs = () => {
  return (
    <div className="max-lg:w-full max-lg:h-full lg:flex-[1_1_30rem] flex flex-col items-center justify-between gap-6 p-7 bg-accent rounded-xl">
      <h1 className="text-lg w-full font-bold">Possui alguma dúvida?</h1>
      <DocsVector className="lg:w-full lg:h-auto w-auto h-full" />
      <Button asChild className="w-full h-fit">
        <Link href="/">Visitar Documentação</Link>
      </Button>
    </div>
  );
};
