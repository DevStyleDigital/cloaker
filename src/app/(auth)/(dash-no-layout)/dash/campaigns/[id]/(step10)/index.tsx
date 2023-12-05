import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { ArrowRight, Link2 } from 'lucide-react';

export const Step10 = ({ handleNextStep }: { handleNextStep: () => void }) => {
  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    handleNextStep();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto h-screen justify-center flex flex-col items-center"
    >
      <h1 className="uppercase font-bold">Redirecionamento Sucesso</h1>
      <p className="italic text-muted-foreground text-center">
        agora para os usuários que passaram pelos filtros anteriores, exceto usuários que
        foram redirecionados pelos filtros em “Redirecionamentos Específicos”
      </p>

      <div className="mt-4 w-full">
        <Input
          placeholder="Redirecionar para"
          type="url"
          className="w-full"
          icons={[Link2]}
        />
      </div>
      <Button type="submit" className="w-full mt-4 !font-normal" size="lg">
        Avançar <ArrowRight className="w-6 h-6 ml-4" />
      </Button>
    </form>
  );
};
