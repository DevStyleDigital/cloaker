import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { ArrowRight, CloudCog, Globe, Link2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CardButton } from '../card-button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Code, CodeCopy } from 'components/code';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';
import { toast } from 'react-toastify';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const Step11 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const supabase = createClientComponentClient();
  const { useCustomDomain: useCustomDomainDefault } = useCampaignData();
  const [useCustomDomain, setUseCustomDomain] = useState(useCustomDomainDefault || false);
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>();

  useEffect(() => {
    const connections = supabase
      .channel('public:connections')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'connections',
          filter: 'id=eq.TOKEN_HERE',
        },
        (payload) => {
          clearTimeout(timeoutId);
          setIsLoading(false);
          setSuccess((payload.new as any).ready);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connections);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function testDomain() {
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

    await supabase.from('connections').insert({
      id: 'TOKEN_HERE',
      ready: false,
    });
    (() => window.open(`${url}?connect=TOKEN_HERE`, '_blank'))();
    setTimeoutId(
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(false);
      }, 15 * 1000),
    );
  }

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep({ useCustomDomain });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Domínio customizado?</h1>
      <p className="italic text-muted-foreground text-center">
        Selecione seu domínio próprio ou utilize nosso domínio {'"devstyle.com"'}
      </p>

      <div className="mt-4 w-fit flex self-center space-x-4 mb-8">
        <span className="italic text-muted-foreground text-center">devstyle.com</span>
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
                text='<script src="https://website.com/cdn.js"></script>'
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
                  '     <script src="https://website.com/cdn.js"></script>',
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
                <span role="status" className="text-sm italic text-muted-foreground">
                  Aguardando início do teste...
                </span>
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

            <DialogTrigger asChild>
              <Button type="button" className="w-full">
                Feito
              </Button>
            </DialogTrigger>
          </DialogContent>
        </Dialog>
      )}
      <Button type="submit" className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
