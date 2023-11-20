import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step1 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { name } = useCampaignData();

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({
      name: (ev.target as unknown as { name: HTMLInputElement }).name.value,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Criando</h1>
      <p className="italic text-muted-foreground">
        Para começar de um nome a sua campanha:
      </p>

      <div className="mt-4 w-full">
        <Input placeholder="Nome da Campanha" name="name" defaultValue={name} required />
      </div>
      <Button className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
