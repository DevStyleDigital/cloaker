'use client';
import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { ArrowRight, CloudCog, Globe, Link2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CardButton } from '../card-button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Code, CodeCopy } from 'components/code';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

const URL_REGEX = /^(https|http)(:\/\/).*(:|\.).{2,}/gm;

export const Step11 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { useCustomDomain: useCustomDomainDefault, customDomain, id } = useCampaignData();
  const [campaignId] = useState(id || uuid());
  const [useCustomDomain, setUseCustomDomain] = useState(useCustomDomainDefault || false);
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(customDomain || '');
  const [urlError, setUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>(
    !!customDomain ? true : undefined,
  );

  async function testDomain() {
    setSuccess(undefined);
    if (!url.length) {
      setUrlError(true);
      toast.warn('Input obrigatório');
      return urlRef.current?.focus();
    }

    const isInvalidUrl = !url.match(URL_REGEX)?.length;

    if (isInvalidUrl) {
      setUrlError(true);
      toast.warn('Insira uma URL válida');
      return urlRef.current?.focus();
    }
    setIsLoading(true);

    const newUrl = new URL(url);
    newUrl.searchParams.set('connect', campaignId);

    const page = await fetch(newUrl)
      .then((r) => r.text())
      .then((html) => html)
      .catch(() => null);
    if (!page) return;

    const range = document.createRange();
    const fragment = range.createContextualFragment(page);

    const campaigns = fragment.querySelectorAll(
      `script[src="${window.location.origin}/cdn/r.min.js"]`,
    );
    if (
      campaigns &&
      (campaigns?.length > 1 ||
        campaigns?.length === 0 ||
        campaigns?.[0].getAttribute('data-campaign') !== campaignId)
    ) {
      // setUrl('');
      // urlRef.current!.value = '';
      setSuccess(false);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  }

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!success && useCustomDomain)
      return toast.warn(
        'O dominio não foi configurado corretamente. Tente novamente antes de avançar essa step.',
      );
    handleNextStep({ useCustomDomain, customDomain: url, id: campaignId });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Domínio customizado?</h1>
      <p className="italic text-muted-foreground text-center">
        Selecione seu domínio próprio ou utilize nosso domínio{' '}
        {`"${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}"`}
      </p>

      <div className="mt-4 w-fit flex self-center space-x-4 mb-8">
        <span className="italic text-muted-foreground text-center">
          {process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}
        </span>
        <Switch checked={useCustomDomain} onCheckedChange={setUseCustomDomain} />
        <span className="italic text-muted-foreground text-center">Domínio prórpio</span>
      </div>

      {useCustomDomain && (
        <Dialog>
          <DialogTrigger asChild>
            <CardButton
              icon={Globe}
              title="Configurar"
              desc="Configurar domínio próprio"
            />
          </DialogTrigger>
          <DialogContent className="flex flex-col">
            <div className="flex flex-col text-center">
              <h2 className="uppercase font-bold">Configurar Domínio</h2>
              <p className="italic text-muted-foreground">
                Informe o domínio a ser utilizado
              </p>
            </div>
            <Input
              placeholder="URL"
              type="url"
              ref={urlRef}
              className="w-full"
              icons={[Link2]}
              value={url}
              onChange={({ target }) => {
                setUrlError(false);
                setUrl(target.value);
                setSuccess(target.value !== customDomain ? undefined : true);
              }}
              help='Exemplo: "https://meudominio.com/r"'
              error={urlError}
            />

            <div className="mt-10 w-full">
              <p className="text-muted-foreground mb-2">
                Agora vá até o arquivo .html do seu domínio ou correspondente, e cole o
                seguinte código:
              </p>
              <CodeCopy
                text={`<script src="${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/cdn/r.min.js" data-campaign="${campaignId}"></script>`}
                language="jsx"
                customStyle={{ padding: '1rem', overflow: 'auto' }}
                className="w-full relative [&>div]:static"
              />
              <p className="text-muted-foreground mt-4 mb-2">
                Caso deseje que a página “meudominio.com/r.html” fique responsável pelo
                redirecionamento. Para isso vá até o arquivo HTML correspondente e cole o
                script dentro da seção “head” conforme o exemplo:
              </p>
              <Code
                text={[
                  '// r.html',
                  '<head>',
                  '     ...',
                  `     <script src="${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/cdn/r.min.js" data-campaign="..."></script>`,
                  '</head>',
                ].join('\n')}
                language="jsx"
                className="overflow-x-auto w-full bg-[#282a36]"
              />
              <p className="text-muted-foreground mt-4 mb-2">
                Agora vamos testar para ter certeza de que tudo está funcionando.
              </p>
              <Button
                type="button"
                onClick={testDomain}
                loading={isLoading}
                disabled={success}
              >
                Testar <CloudCog className="w-4 h-4 ml-4" />
              </Button>

              <div className="flex flex-col text-center w-full bg-accent rounded-lg p-4 mt-4">
                {!isLoading && success === undefined && (
                  <span role="status" className="text-sm italic text-muted-foreground">
                    Aguardando início do teste...
                  </span>
                )}
                {isLoading && (
                  <span role="status" className="text-sm italic text-yellow-500">
                    Conectando ao seu domínio...
                  </span>
                )}
                {success && (
                  <span role="status" className="text-sm italic text-green-500">
                    Domínio funcionando e pronto para ser utilizado.
                  </span>
                )}
                {!success && success !== undefined && (
                  <span role="status" className="text-sm italic text-destructive">
                    Ocorreu um erro ao vincular com seu domínio, verifique se o script
                    está no lugar correto e certifique-se de que haja apenas um script
                    apontando para nosso dominio.
                  </span>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Button type="submit" className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
