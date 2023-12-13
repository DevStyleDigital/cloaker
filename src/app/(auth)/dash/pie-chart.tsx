'use client';
import { useEffect, useState } from 'react';
import { PieChart as RePieChart, Pie, Tooltip, Cell } from 'recharts';

export const PieChart = ({ data }: { data: any[] }) => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return <div className="grow min-h-[400px] bg-accent rounded-xl animate-pulse" />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-7 bg-accent rounded-xl">
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        )}
        <ul>
          {data.map((entry, index) => (
            <li
              key={index}
              className="h-12 rounded-lg flex-col justify-center items-center gap-2 inline-flex"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 relative rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="text-muted-foreground">Brasil</span>
              </div>
              <div className="rounded-lg flex-col justify-center items-start flex">
                <span className="self-stretch text-muted-foreground">
                  {(entry.value / data.reduce((acc, item) => acc + item.value, 0)) * 100}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
