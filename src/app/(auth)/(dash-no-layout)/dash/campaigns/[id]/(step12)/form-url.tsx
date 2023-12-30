import { CodeCopy } from 'components/code';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/ui/tooltip';
import { Link2, Trash2 } from 'lucide-react';
import { ParamForm } from './param-form';
import { atomOneLight, dracula } from 'react-code-blocks';
import { genNewUrlObject } from '.';
import { useCampaignData } from '../campaign-form';
import { useTheme } from 'next-themes';

export const FormUrl = ({
  handleDelete,
  handleUrl,
  campaignId,
  urlsLength,
  ...url
}: {
  urlsLength: number;
  handleUrl: (d: ReturnType<typeof genNewUrlObject>) => void;
  handleDelete: () => void;
  campaignId: string;
} & ReturnType<typeof genNewUrlObject>) => {
  const { theme } = useTheme();
  const { redirectType, useCustomDomain, customDomain } = useCampaignData();

  return (
    <div className="w-full flex flex-col space-y-4">
      <Dialog>
        <div className="flex w-full gap-4">
          <CodeCopy
            text={
              useCustomDomain
                ? `${customDomain}${redirectType === 'complex' ? `?p=${url.id}` : ''}`
                : `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/${campaignId}.${url.id}`
            }
            language="bash"
            className="[&_span]:!text-ring/80 dark:[&_span]:!text-muted-foreground"
            customStyle={{ padding: '1rem' }}
            showLineNumbers={false}
            theme={theme === 'light' ? atomOneLight : dracula}
          />
          {redirectType === 'complex' && (
            <DialogTrigger asChild>
              <Button type="button" className="whitespace-nowrap">
                Vincular Parâmetros <Link2 className="w-4 h-4 ml-4" />
              </Button>
            </DialogTrigger>
          )}
          {urlsLength > 1 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleDelete}
                    aria-label="Deletar Link"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar Link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        <DialogContent>
          <ParamForm
            defaultParams={url.params}
            onSubmit={(d) => handleUrl({ params: d, id: url.id })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
