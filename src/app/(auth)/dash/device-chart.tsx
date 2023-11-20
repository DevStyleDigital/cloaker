'use client';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  {
    name: 'Linux',
    users: 4200,
  },
  {
    name: 'Mac',
    users: 3000,
  },
  {
    name: 'iOS',
    users: 2000,
  },
  {
    name: 'Windows',
    users: 2780,
  },
  {
    name: 'Android',
    users: 1890,
  },
  {
    name: 'Outros',
    users: 2390,
  },
];

const COLORS = ['#95A4FC', '#B1E3FF', '#BAEDBD', '#8A1A35'];
export const DeviceChart = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return <div className="w-full min-h-[500px] bg-accent rounded-xl animate-pulse" />;
  }
  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-7 bg-accent rounded-xl col-span-3">
      <h1 className="font-bold w-full text-lg max-sm:ml-8">Trafico por dispositivo</h1>
      <ResponsiveContainer className="mt-10" width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="name"
            scale="point"
            stroke="#88888892"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            padding={{ left: 40, right: 40 }}
          />
          <YAxis stroke="#88888892" fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="1 1" />
          {/* {data.map((entry, index) => (
                          <Bar dataKey="total" key={`cell-${index}`} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
                ))} */}
          <Bar dataKey="users" radius={[4, 4, 0, 0]} label={{ position: 'top' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
