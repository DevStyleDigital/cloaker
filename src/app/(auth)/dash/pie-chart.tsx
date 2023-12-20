'use client';
import { useEffect, useState } from 'react';
import { PieChart as RePieChart, Pie, Tooltip, Cell } from 'recharts';
import { formatNumber } from 'utils/format-number';

export const PieChart = ({ data }: { data: any[] }) => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return <div className="grow min-h-[400px] bg-accent rounded-xl animate-pulse" />;
  }

  const amount = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-full flex flex-col items-center p-7 bg-background rounded-xl">
      <h1 className="font-bold w-full text-lg">Trafico por Região</h1>
      <div className="w-full h-full flex flex-col justify-center items-center mt-4">
        {!data.length && (
          <span className="text-muted-foreground italic text-center">
            Aguardando dados...
          </span>
        )}
        {!!data.length && (
          <RePieChart width={300} height={250}>
            <Pie
              dataKey="value"
              data={data}
              cx={150}
              cy={100}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              minAngle={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={''} />
              ))}
            </Pie>
            <Tooltip formatter={(label) => <>{label} requisições</>} />
          </RePieChart>
        )}
        <ul className="flex flex-wrap gap-6">
          {data.map((entry, index) => (
            <li
              key={index}
              className="rounded-lg flex-col justify-center items-center inline-flex"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 relative rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
              <div className="rounded-lg flex-col justify-center items-start flex ml-4">
                <span className="self-stretch text-muted-foreground">
                  {formatNumber((entry.value / amount) * 100, 3).replace('+', '')}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
