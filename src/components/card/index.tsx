import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from 'utils/cn';

export const Card = (card: {
  id: string;
  title: string;
  label: string;
  progress_percent?: string;
  index: number;
  icon?: React.FC<{ className?: string }>;
}) => {
  return (
    <div className="flex flex-col px-8 gap-4 w-full border-l border-foreground/20">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold">{card.title}</h3>
        {card.icon && <card.icon className="w-6 h-6" />}
      </div>
      <div className="flex items-center">
        <p className="text-4xl font-bold mr-4">{card.label.replace('+', '')}</p>{' '}
        <div
          className={cn('flex items-center gap-2', {
            'text-lime-500': !!card.progress_percent,
            'text-destructive': !card.progress_percent,
          })}
        >
          {card.progress_percent && card.progress_percent !== '+0' ? (
            <>
              <span className="text-sm">{card.progress_percent}%</span>
              {card.progress_percent.includes('+') ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
