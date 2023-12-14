'use client';
import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { ArrowRight, CloudCog, Globe, Link2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CardButton } from '../card-button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Code, CodeCopy } from 'components/code';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { SupabaseClient } from '@supabase/supabase-js';

export const Step11 = ({
  handleNextStep,
  step,
  supabase,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
  step: number;
  supabase: SupabaseClient<any, 'public', any>;
}) => {
  const { useCustomDomain: useCustomDomainDefault, customDomain } = useCampaignData();
  const [useCustomDomain, setUseCustomDomain] = useState(useCustomDomainDefault || false);
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(customDomain || '');
  const [urlError, setUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>(
    !!customDomain ? true : undefined,
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const token = useMemo(() => uuid(), [step]);

  useEffect(() => {
    const connections = supabase
      .channel('public:connections')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'connections',
          filter: `id=eq.${token}`,
        },
        (payload) => {
          clearTimeout(timeoutId);
          setIsLoading(false);
          setSuccess((payload.new as any).ready);
          supabase
            .from('connections')
            .delete()
            .eq('id', (payload.new as any).id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connections);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function testDomain() {
    setSuccess(undefined);
    if (!url.length) {
      setUrlError(true);
      toast.warn('Input obrigatório');
      return urlRef.current?.focus();
    }

    if (
      !/^(((http|https):\/\/)?(www.)?)\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/gm.test(url)
    ) {
      setUrlError(true);
      toast.warn('Insira uma URL válida');
      return urlRef.current?.focus();
    }
    setIsLoading(true);

    await supabase.from('connections').upsert({
      id: token,
      ready: false,
    });
    (() => window.open(`${url}?connect=${token}`, '_blank'))(); // CHANGE CONNECT TO A GOOD NAME
    setTimeoutId(
      setTimeout(() => {
        setIsLoading(false);
        setSuccess((prev) => (!prev ? false : prev));
      }, 15 * 1000),
    );
  }

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!success && useCustomDomain)
      return toast.warn(
        'O teste do dominio não deu certo. Tente novamente antes de avançar essa step.',
      );
    handleNextStep({ useCustomDomain, customDomain: url });
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
          <DialogContent>
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
              }}
              help='Exemplo: "https://meudominio.com/r"'
              error={urlError}
            />

            <div className="mt-10">
              <p className="text-muted-foreground mb-2">
                Agora vá até o arquivo .html do seu domínio ou correspondente, e cole o
                seguinte código:
              </p>
              <CodeCopy
                text={`<script src="${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/cdn/r.min.js"></script>`}
                language="jsx"
                customStyle={{ padding: '1rem' }}
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
                  `     <script src="${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/cdn/r.min.js"></script>`,
                  '</head>',
                ].join('\n')}
                language="jsx"
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
                    Ocorreu um erro ao vincular com seu domínio, verifique se o código
                    está no lugar correto.
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
