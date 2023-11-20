import { Facebook } from 'assets/svgs/logos/facebook';
import { Google } from 'assets/svgs/logos/google';
import { Instragram } from 'assets/svgs/logos/instagram';
import { TikTok } from 'assets/svgs/logos/tiktok';
import { Button } from 'components/ui/button';
import { CardSelect, CardSelectItem } from 'components/ui/card-select';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step2 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { publishLocale: publishLocaleDefault } = useCampaignData();
  const [publishLocale, setPublishLocale] = useState(publishLocaleDefault || 'instagram');

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({ publishLocale });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Onde você irá publicar?</h1>

      <div className="mt-4 w-full">
        <CardSelect
          onChangeValue={(v) => setPublishLocale(v[0])}
          defaultValue={[publishLocale]}
          className="w-full flex gap-4"
        >
          <CardSelectItem value="tiktok">
            <TikTok />
            <span className="bold">TikTok</span>
          </CardSelectItem>
          <CardSelectItem value="instagram">
            <Instragram />
            <span className="bold">Instagram</span>
          </CardSelectItem>
          <CardSelectItem value="facebook">
            <Facebook />
            <span className="bold">Facebook</span>
          </CardSelectItem>
          <CardSelectItem value="google">
            <Google />
            <span className="bold">Google</span>
          </CardSelectItem>
        </CardSelect>
      </div>
      <Button className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
