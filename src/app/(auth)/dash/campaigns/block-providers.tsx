'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from 'components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Album, ShieldBan, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

export const BlockProvider = ({
  blockProvidersDefault,
  uid,
}: {
  uid: string;
  blockProvidersDefault: string[];
}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const ispRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockProviders, setBlockProviders] = useState<string[]>(
    blockProvidersDefault || [],
  );

  async function onSubmit() {
    setLoading(true);
    await supabase
      .from('profiles')
      .upsert({ block_providers: blockProviders })
      .eq('id', uid)
      .then((res) => {
        if (res.error)
          return toast.error('Houve um erro ao enviar a lista de provedores.');
        toast.success('Lista de provedores BLOQUEADOS atualizada com sucesso!');
      });
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button className="w-fit !font-normal">
          Bloquer Provedores <Album className="w-6 h-6 ml-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <div className="flex flex-col text-center">
          <h2 className="uppercase font-bold">Bloquear Provedores</h2>
          <p className="italic text-muted-foreground">Informe o nome de um provedor</p>
        </div>
        <div role="form" className="flex space-x-4 w-full">
          <Input
            name="isp"
            id="isp"
            placeholder="Provedor"
            ref={ispRef}
            help="Todos os ISPs que incluirem o provedor mencionado serão bloqueados."
          />
          <Button
            type="button"
            onClick={() => {
              if (!ispRef?.current || !ispRef.current.value) return;
              setBlockProviders((prev) =>
                prev.includes(ispRef.current!.value)
                  ? prev
                  : [ispRef.current!.value.toUpperCase(), ...prev],
              );
              ispRef.current.value = '';
            }}
          >
            Bloquear <ShieldBan className="w-6 h-6 ml-6" />
          </Button>
        </div>
        <ul className="mb-4 mt-8 flex flex-wrap gap-4">
          {blockProviders.map((isp, index) => (
            <li key={isp}>
              <button
                type="button"
                className="bg-ring text-background w-fit px-8 py-2 rounded-full flex items-center"
                onClick={() =>
                  setBlockProviders((prev) => {
                    const newArray = [...prev];
                    newArray.splice(index, 1);
                    return newArray;
                  })
                }
              >
                {isp} <X className="w-4 h-4 ml-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button loading={loading} type="button" className="self-end" onClick={onSubmit}>
          Salvar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
