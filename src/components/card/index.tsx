import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from 'utils/cn';

export const Card = (card: {
  id: string;
  title: string;
  label: string;
  progress_percent?: number;
  index: number;
  icon?: React.FC<{ className?: string }>;
}) => {
  return (
    <div
      className={cn('flex flex-col p-8 gap-4 rounded-lg w-full', {
        'bg-card-blue': card.index % 2 === 0,
        'bg-card-purple': card.index % 2 !== 0,
      })}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{card.title}</h3>
        {card.icon && <card.icon className="w-6 h-6" />}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-4xl font-bold">{card.label}</p>{' '}
        <div className="flex items-center gap-2">
          {card.progress_percent ? (
            <>
              <span className="text-sm">
                {card.progress_percent > 0 && '+'}
                {card.progress_percent}
              </span>
              {card.progress_percent > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </>
          ) : (
            <span className="font-black">o</span>
          )}
        </div>
      </div>
    </div>
  );
};
