import { Google } from 'assets/svgs/logos/google';
import { Apple } from 'assets/svgs/logos/apple';
import { Button } from 'components/ui/button';
import { cn } from 'utils/cn';

const pulseAnimation = 'animate-pulse pointer-events-none opacity-80';

export const ThirdPatty = ({ loading }: { loading: boolean }) => {
  return (
    <div className="w-full">
      <div className="relative w-full mt-10 mb-8">
        <hr className=" border-border" />
        <span className="text-sm whitespace-nowrap text-muted-foreground bg-background px-2 absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          Ou continuar com
        </span>
      </div>
      <div className="flex xs:space-x-4 max-xs:space-y-4 max-xs:flex-col">
        <Button
          variant="secondary"
          className={cn('w-full', { [pulseAnimation]: loading })}
          aria-disabled={loading}
        >
          <Google className="w-6 h-6 mr-4" />
          Google
        </Button>
        <Button
          variant="secondary"
          className={cn('w-full', { [pulseAnimation]: loading })}
          aria-disabled={loading}
        >
          <Apple className="w-6 h-6 mr-4" />
          Apple
        </Button>
      </div>
    </div>
  );
};
