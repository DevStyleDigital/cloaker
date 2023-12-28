'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Step1 } from './(step1)';
import { Step2 } from './(step2)';
import { Step3 } from './(step3)';
import { Step4 } from './(step4)';
import { Step5 } from './(step5)';
import { Step6 } from './(step6)';
import { Step7 } from './(step7)';
import { Step8 } from './(step8)';
import { Step9 } from './(step9) ';
import { Step11 } from './(step11)';
import { Step12 } from './(step12)';
import { Step13 } from './(step13)';

import { cn } from 'utils/cn';
import { ArrowRight, RotateCcw, Undo2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import { SuccessVector } from 'assets/svgs/success';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/ui/tooltip';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CampaignData } from 'types/campaign';
import { useAuth } from 'context/auth';

const NUMBER_OF_STEP = 12;
const STEP_FINISH_NUMBER = 13;

const CampaignDataContext = createContext<CampaignData>({} as CampaignData);
export const useCampaignData = () => useContext(CampaignDataContext);

export const CampaignForm = ({
  campaignDefault,
}: {
  campaignDefault?: CampaignData | null;
}) => {
  const router = useRouter();
  const { user, supabase } = useAuth();

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [returnTimes, setReturnTimes] = useState(0);
  const [step, setStep] = useState(1);
  const [stepsOpened, setStepsOpened] = useState(campaignDefault ? NUMBER_OF_STEP : 1);
  const [campaignData, setCampaignData] = useState<CampaignData>(
    campaignDefault || ({} as CampaignData),
  );

  async function handleCreateCampaign({ useReadyProvidersList, ...data }: CampaignData) {
    setLoading(true);
    setHasError(false);
    setReturnTimes(returnTimes + 1);
    const blockProviders = useReadyProvidersList
      ? ((user?.block_providers as string[]) || []).concat(data.blockProviders || [])
      : data.blockProviders || [];

    await fetch('/api/campaigns', {
      body: JSON.stringify({ ...data, blockProviders, user_id: user?.id }),
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Origin: process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
      },
    })
      .then((res) => {
        return toast.success(
          !!campaignDefault
            ? 'Sua campanha foi atualizada! E está ativa e pronta para uso!'
            : 'Sua campanha foi criada! E está ativa e pronta para uso!',
          {
            pauseOnHover: false,
          },
        );
      })
      .catch(() => {
        setHasError(true);
        setStep(data.redirectType === 'simple' ? 11 : 12);
        setStepsOpened(data.redirectType === 'simple' ? 11 : 12);
        return toast.error(
          !!campaignDefault
            ? 'Ops... Não foi possivel atualizar sua campanha.'
            : 'Ops... Não foi possivel criar sua campanha.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleNextStep =
    (nextStep: number) => async (stepData: Partial<CampaignData>) => {
      setCampaignData((prev) => ({ ...prev, ...stepData }));

      if (nextStep === 8) {
        setStepsOpened((prev) =>
          campaignData.redirectType === 'complex' && stepData.redirectType === 'simple'
            ? prev - 1
            : campaignData.redirectType === 'simple' &&
                stepData.redirectType === 'complex'
              ? prev + 1
              : prev,
        );
      }

      if (nextStep > stepsOpened) setStepsOpened(nextStep);
      setStep(nextStep);

      if (nextStep === STEP_FINISH_NUMBER)
        await handleCreateCampaign({ ...campaignData, ...stepData });
    };

  return (
    <CampaignDataContext.Provider value={campaignData}>
      {!loading && (
        <Link
          href="/dash/campaigns"
          className={cn(
            'absolute top-8 left-8 flex gap-4 text-lg items-center transition-all opacity-80 hover:opacity-100 !no-underline',
            {
              'text-muted-foreground': stepsOpened === STEP_FINISH_NUMBER,
              'text-destructive': stepsOpened < STEP_FINISH_NUMBER,
            },
          )}
        >
          <Undo2 className="w-4 h-4 mb-0.5" />
          {stepsOpened === 13 ? 'Voltar para Campanhas' : 'cancelar'}
        </Link>
      )}
      {step <= NUMBER_OF_STEP && (
        <div className="flex gap-2 absolute top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl">
          {Array.from(
            {
              length:
                stepsOpened <= 6
                  ? 6
                  : campaignData.redirectType === 'simple'
                    ? NUMBER_OF_STEP - 1
                    : NUMBER_OF_STEP,
            },
            (_, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setStep(i + 1)}
                      aria-label={`ir para step ${i + 1}`}
                      className={cn(
                        'h-2 w-full bg-primary/20 hover:bg-primary/40 block rounded-full disabled:bg-ring/5 disabled:hover:bg-ring/5 disabled:!cursor-not-allowed transition-colors',
                        {
                          '!bg-primary': step === i + 1 || step === i + 0.5,
                        },
                      )}
                      disabled={i + 1 > stepsOpened}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ir para step {i + 1}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ),
          )}
        </div>
      )}
      <div className="w-full">
        {step === 1 ? (
          <Step1 handleNextStep={handleNextStep(2)} />
        ) : step === 2 ? (
          <Step2 handleNextStep={handleNextStep(3)} />
        ) : step === 3 ? (
          <Step3 handleNextStep={handleNextStep(4)} />
        ) : step === 4 ? (
          <Step4 handleNextStep={handleNextStep(5)} />
        ) : step === 5 ? (
          <Step5 handleNextStep={handleNextStep(6)} />
        ) : step === 6 ? (
          <Step6 handleNextStep={handleNextStep(7)} />
        ) : step === 7 ? (
          <Step13 handleNextStep={handleNextStep(8)} />
        ) : null}

        {campaignData.redirectType === 'simple' && step === 8 ? (
          <Step8
            redirectType={campaignData.redirectType}
            handleNextStep={handleNextStep(9)}
          />
        ) : campaignData.redirectType === 'simple' && step === 9 ? (
          <Step9 handleNextStep={handleNextStep(10)} />
        ) : campaignData.redirectType === 'simple' && step === 10 ? (
          <Step11 handleNextStep={handleNextStep(11)} />
        ) : campaignData.redirectType === 'simple' && step === 11 ? (
          <Step12
            isEdit={!!campaignDefault}
            handleNextStep={handleNextStep(STEP_FINISH_NUMBER)}
          />
        ) : null}

        {campaignData.redirectType === 'complex' && step === 8 ? (
          <Step7 handleNextStep={handleNextStep(9)} />
        ) : campaignData.redirectType === 'complex' && step === 9 ? (
          <Step8
            redirectType={campaignData.redirectType}
            handleNextStep={handleNextStep(10)}
          />
        ) : campaignData.redirectType === 'complex' && step === 10 ? (
          <Step9 handleNextStep={handleNextStep(11)} />
        ) : campaignData.redirectType === 'complex' && step === 11 ? (
          <Step11 handleNextStep={handleNextStep(12)} />
        ) : campaignData.redirectType === 'complex' && step === 12 ? (
          <Step12
            isEdit={!!campaignDefault}
            handleNextStep={handleNextStep(STEP_FINISH_NUMBER)}
          />
        ) : null}

        {!loading && step === STEP_FINISH_NUMBER && !hasError ? (
          <div className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center gap-4">
            <div>
              <h1 className="uppercase font-bold text-center">
                {!!campaignDefault ? 'Campanha Atualizada' : 'Campanha Criada'}
              </h1>
              <p className="italic text-muted-foreground text-center">
                {!!campaignDefault
                  ? 'Sua campanha foi atualizada! Agora você pode utilizar os links desejados'
                  : 'Sua campanha foi criada! Agora você pode utilizar os links desejados'}
              </p>
            </div>
            <SuccessVector />

            <Button
              type="button"
              className="w-fit mt-4 !font-normal"
              size="lg"
              onClick={() => {
                router.refresh();
                router.push('/dash/campaigns');
              }}
            >
              Finalizar <ArrowRight className="w-6 h-6 ml-4" />
            </Button>
          </div>
        ) : null}

        {loading && (
          <div role="status" className="h-screen justify-center flex items-center gap-4">
            <span
              aria-hidden
              className="animate-ping w-2 h-2 bg-gray-400 rounded-full delay-100"
            />
            <span
              aria-hidden
              className="animate-ping w-2 h-2 bg-gray-400 rounded-full delay-300"
            />
            <span
              aria-hidden
              className="animate-ping w-2 h-2 bg-gray-400 rounded-full delay-500"
            />
            <span className="sr-only">Criando sua campanha... Aguarde</span>
          </div>
        )}
      </div>
    </CampaignDataContext.Provider>
  );
};
