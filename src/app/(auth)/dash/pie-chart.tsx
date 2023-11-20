'use client';
import { useEffect, useState } from 'react';
import { PieChart as RePieChart, Pie, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'Paraguai', value: 350 },
  { name: 'Outro', value: 100 },
  { name: 'Argentina', value: 300 },
  { name: 'Brasil', value: 400 },
];

const COLORS = ['#95A4FC', '#B1E3FF', '#BAEDBD', '#8A1A35'];

export const PieChart = () => {
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
      <div className="w-full flex flex-col justify-center items-center mt-4">
        <RePieChart width={300} height={250}>
          <Pie
            dataKey="value"
            data={data}
            cx={150}
            cy={100}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            // paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
        <div className="w-full flex gap-10 items-center max-sm:flex-wrap justify-center">
          <div className="flex max-sm:flex-col gap-10 max-sm:gap-6">
            <div className="w-full flex flex-col items-center gap-2">
              <span className="flex gap-2 items-center text">
                {' '}
                <span className="w-2 h-2 rounded-full bg-primary" /> Brasil
              </span>
              <span className="text-sm text-black/80">38.6%</span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <span className="flex gap-2 items-center text">
                {' '}
                <span className="w-2 h-2 rounded-full bg-[#BAEDBD]" /> Argentina
              </span>
              <span className="text-sm text-black/80">22.15%</span>
            </div>
          </div>
          <div className="flex max-sm:flex-col gap-10 max-sm:gap-6">
            <div className="w-full flex flex-col items-center gap-2">
              <span className="flex gap-2 items-center text">
                {' '}
                <span className="w-2 h-2 rounded-full bg-[#95A4FC]" /> Paraguai
              </span>
              <span className="text-sm text-black/80">30.8%</span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <span className="flex gap-2 items-center text">
                {' '}
                <span className="w-2 h-2 rounded-full bg-[#B1E3FF]" /> Outro
              </span>
              <span className="text-sm text-black/80">8.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
