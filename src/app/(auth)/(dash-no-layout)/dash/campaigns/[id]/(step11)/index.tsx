import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { ArrowRight, CloudCog, Globe, Link2 } from 'lucide-react';
import { useState } from 'react';
import { CardButton } from '../card-button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Code, CodeCopy } from 'components/code';
import { CampaignData } from 'types/campaign';
import { useCampaignData } from '../campaign-form';

export const Step11 = ({
  handleNextStep,
}: {
  handleNextStep: (d: Partial<CampaignData>) => void;
}) => {
  const { useCustomDomain: useCustomDomainDefault } = useCampaignData();
  const [useCustomDomain, setUseCustomDomain] = useState(useCustomDomainDefault || false);

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
              className="w-full"
              icons={[Link2]}
              help='Exemplo: "https://meudominio.com/r"'
            />

            <div className="mt-10">
              <p className="text-muted-foreground mb-2">
                Agora vá até o arquivo .html do seu domínio ou correspondente, e cole o
                seguinte código:
              </p>
              <CodeCopy
                text='<script src="https://website.com/cdn.js" data-key="CHAVE-KEY"></script>'
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
                  '     <script src="https://website.com/cdn.js" data-key="CHAVE-KEY"></script>',
                  '</head>',
                ].join('\n')}
                language="jsx"
              />
              <p className="text-muted-foreground mt-4 mb-2">
                Agora vamos testar para ter certeza de que tudo está funcionando.
              </p>
              <Button type="button">
                Testar <CloudCog className="w-4 h-4 ml-4" />
              </Button>

              <div className="flex flex-col text-center w-full bg-accent rounded-lg p-4 mt-4">
                <span role="status" className="text-sm italic text-muted-foreground">
                  Aguardando...
                </span>
                <span role="status" className="text-sm italic text-yellow-500">
                  Conectando ao seu domínio...
                </span>
                <span role="status" className="text-sm italic text-green-500">
                  Domínio funcionando e pronto para ser utilizado.
                </span>
                <span role="status" className="text-sm italic text-destructive">
                  Ocorreu um erro ao vincular com seu domínio, verifique se o código está
                  no lugar correto.
                </span>
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
      <Button className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
