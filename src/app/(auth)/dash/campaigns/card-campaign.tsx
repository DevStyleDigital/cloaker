'use client';
import { Facebook } from 'assets/svgs/logos/facebook';
import { Google } from 'assets/svgs/logos/google';
import { Instragram } from 'assets/svgs/logos/instagram';
import { TikTok } from 'assets/svgs/logos/tiktok';
import { CodeCopy } from 'components/code';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Switch } from 'components/ui/switch';
import { useAuth } from 'context/auth';
import { format } from 'date-fns';
import { Link2, LucideLink, Pencil, Trash } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { atomOneLight, dracula } from 'react-code-blocks';
import { toast } from 'react-toastify';
import { Campaign } from 'types/campaign';
import { cn } from 'utils/cn';

const Status = ({ status }: { status: string }) => (
  <>
    <span
      className={cn('w-4 h-4 border rounded-full flex justify-center items-center', {
        'border-green-600': status === 'active',
        'border-yellow-400': status === 'inactive',
      })}
    >
      <span
        className={cn('w-2 h-2 rounded-full', {
          'bg-green-600': status === 'active',
          'bg-yellow-400': status === 'inactive',
        })}
      />
    </span>
    <span
      className={cn('text-sm', {
        'text-green-600': status === 'active',
        'text-yellow-400': status === 'inactive',
      })}
    >
      {status === 'active' ? 'Ativa' : 'Inativa'}
    </span>
  </>
);

export const CardCampaign = (
  campaign: Pick<
    Campaign,
    | 'id'
    | 'name'
    | 'status'
    | 'cat'
    | 'requests'
    | 'publishLocale'
    | 'useCustomDomain'
    | 'customDomain'
    | 'redirectType'
    | 'urls'
  >,
) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { supabase } = useAuth();

  return (
    <div
      className={cn('w-full max-w-lg flex flex-col gap-6 p-8 bg-background rounded-md', {
        'opacity-50': campaign.status === 'inactive',
      })}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Status status={campaign.status} />
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost" className="w-fit p-2">
                <LucideLink />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col text-center">
                <h2 className="uppercase font-bold">Links cadastrados</h2>
              </div>
              <ul>
                {campaign.urls.map((url) => {
                  const params = Object.entries(url.params);
                  return (
                    <li key={url.id}>
                      <CodeCopy
                        text={
                          campaign.useCustomDomain
                            ? `${campaign.customDomain}${
                                campaign.redirectType === 'complex' ? `?p=${url.id}` : ''
                              }`
                            : `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/${campaign.id}.${url.id}`
                        }
                        language="bash"
                        className="[&_span]:!text-ring/80 dark:[&_span]:!text-muted-foreground"
                        customStyle={{ padding: '1rem' }}
                        showLineNumbers={false}
                        theme={resolvedTheme === 'light' ? atomOneLight : dracula}
                      />

                      <div className="mt-2 flex flex-wrap space-x-4">
                        <span>Parâmetros inclusos:</span>
                        <ul className="space-x-2">
                          {params.length ? (
                            params.map(([key, value]) => (
                              <li key={key} className="bg-muted-foreground">
                                {key}: {value}
                              </li>
                            ))
                          ) : (
                            <span>nenhum parâmetro vinculado</span>
                          )}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" asChild className="w-fit p-2">
            <Link href={`/dash/campaigns/${campaign.id}`}>
              <Pencil />
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="w-fit p-2"
            onClick={() => {
              supabase
                .from('campaigns')
                .delete()
                .eq('id', campaign.id)
                .then((res) => {
                  if (res.error)
                    return toast.error(
                      'Ocorreu um erro ao deletar sua campanha. Tente novamente mais tarde!',
                    );
                  toast.success('Sua campanha foi deletada!');
                  router.refresh();
                });
            }}
          >
            <Trash />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{campaign.name}</span>
          <span className="text-sm text-muted-foreground">
            Data criação: {format(new Date(campaign.cat), 'dd/MM/yyyy')}
          </span>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <label htmlFor="toggle-campaign" className="items-center flex">
              <AlertDialogTrigger className="w-fit">
                <Switch
                  id="toggle-campaign"
                  className="mr-4 mt-2"
                  checked={campaign.status === 'active'}
                />
              </AlertDialogTrigger>
              <span className="mt-1.5">&nbsp;Ativa / Desativar a campanha</span>
            </label>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Você perderá todo os seus dados dentro
                  da plataforma!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="items-center">
                <AlertDialogCancel className="h-fit">Cancelar</AlertDialogCancel>
                <Button
                  disabled={loading}
                  variant={campaign.status === 'active' ? 'destructive' : 'default'}
                  className="w-fit"
                  onClick={() => {
                    setLoading(true);
                    supabase
                      .from('campaigns')
                      .update({
                        status: campaign.status === 'active' ? 'inactive' : 'active',
                      })
                      .eq('id', campaign.id)
                      .then((res) => {
                        console.log(res);
                        setLoading(false);
                        if (res.error)
                          return toast.error(
                            'Ocorreu um erro ao ativar/desativar sua campanha. Tente novamente mais tarde!',
                          );

                        setOpen(false);
                        toast.success(
                          `Sua campanha foi ${
                            campaign.status === 'active' ? 'desativada' : 'reativada'
                          }!`,
                        );
                        router.refresh();
                      });
                  }}
                >
                  {campaign.status === 'active'
                    ? 'Desativar Campanha'
                    : 'Reativar Campanha'}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {campaign.publishLocale === 'tiktok' ? (
          <TikTok />
        ) : campaign.publishLocale === 'instagram' ? (
          <Instragram />
        ) : campaign.publishLocale === 'facebook' ? (
          <Facebook />
        ) : (
          <Google />
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total de Requisições:</span>
        <span className="text-2xl font-semibold">
          {campaign.requests[0].count === 0 ? (
            <span className="text-lg">nenhuma ainda</span>
          ) : (
            campaign.requests[0].count
          )}
        </span>
      </div>
    </div>
  );
};
