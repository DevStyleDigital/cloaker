'use client';
import { useEffect, useState } from 'react';
import { PieChart as RePieChart, Pie, Tooltip, Cell } from 'recharts';
import { formatNumber } from 'utils/format-number';

export const PieChart = ({ data }: { data: any[] }) => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  const amount = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-full flex flex-col items-center p-7 bg-background rounded-xl">
      <h1 className="font-bold w-full text-lg">Trafego por Região</h1>
      <div className="w-full h-full flex flex-col justify-center items-center mt-4">
        {!data.length && (
          <span className="text-muted-foreground italic text-center">
            Aguardando dados...
          </span>
        )}
        {client
          ? !!data.length && (
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
            )
          : !!data.length && (
              <div className="grow w-[300px] h-[250px] rounded-full animate-pulse flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="sv"
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                >
                  <path
                    id="0"
                    fill="currentColor"
                    className="fill-accent"
                    d="M100, 0 A100,100 0 1 1 99.98254670756873,0.0000015230870928917284 L99.98952802454124,40.000000913852254 A60,60 0 1 0 100,40 Z"
                  />
                </svg>
              </div>
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
