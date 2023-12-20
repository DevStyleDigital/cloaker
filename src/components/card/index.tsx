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
    <div
      className={cn('flex flex-col p-8 gap-4 rounded-lg w-full', {
        'bg-blue-100': card.index % 2 === 0,
        'bg-purple-200': card.index % 2 !== 0,
      })}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{card.title}</h3>
        {card.icon && <card.icon className="w-6 h-6" />}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-4xl font-bold">{card.label.replace('+', '')}</p>{' '}
        <div className="flex items-center gap-2">
          {card.progress_percent && card.progress_percent !== '+0' ? (
            <>
              <span className="text-sm">{card.progress_percent}%</span>
              {card.progress_percent.includes('+') ? (
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
