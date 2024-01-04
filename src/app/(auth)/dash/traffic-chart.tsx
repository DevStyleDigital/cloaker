'use client';

const MAP = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
  google: 'Google',
} as Record<string, string>;

export const TrafficGraphic = ({
  data,
}: {
  data: Record<string, { amount: number; percent: number }>;
}) => {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-7 bg-background rounded-xl">
      <h1 className="font-bold text-lg">Trafego por site</h1>
      {!Object.entries(data).length && (
        <span className="text-muted-foreground italic my-auto text-center">
          Nenhum dado ainda...
        </span>
      )}
      {Object.entries(data).map((item, index) => {
        return (
          <div
            key={index}
            className="group flex justify-between items-center space-x-8 cursor-default"
          >
            <div className="w-full flex gap-4 items-center">
              <span
                style={{ width: `${item[1].percent * 100}%` }}
                className="h-2 rounded-full bg-muted-foreground/20 transition-all duration-300 group-hover:bg-primary"
              />
              <span className="font-medium transition-all text-muted-foreground group-hover:text-ring">
                {Number((item[1].percent * 100).toFixed(2))}%
              </span>
            </div>
            <span>{MAP[item[0]]}</span>
          </div>
        );
      })}
    </div>
  );
};
