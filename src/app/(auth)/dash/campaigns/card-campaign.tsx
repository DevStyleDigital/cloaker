'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Facebook } from 'assets/svgs/logos/facebook';
import { Google } from 'assets/svgs/logos/google';
import { Instragram } from 'assets/svgs/logos/instagram';
import { TikTok } from 'assets/svgs/logos/tiktok';
import { Button } from 'components/ui/button';
import { format } from 'date-fns';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    'id' | 'name' | 'status' | 'cat' | 'requestsAmount' | 'publishLocale'
  >,
) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  return (
    <div
      className={cn('w-full max-w-lg flex flex-col gap-6 p-8 bg-accent rounded-md', {
        'opacity-50': campaign.status === 'inactive',
      })}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Status status={campaign.status} />
        </div>
        <div className="flex items-center gap-2">
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
          {campaign.requestsAmount === 0 ? (
            <span className="text-lg">nenhuma ainda</span>
          ) : (
            campaign.requestsAmount
          )}
        </span>
      </div>
    </div>
  );
};
