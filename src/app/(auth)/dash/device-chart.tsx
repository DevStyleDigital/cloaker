'use client';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';

const MAP = {
  'apple-os': 'iOS & macOS',
  android: 'Android',
  windows: 'Windows',
  linux: 'Linux',
  other: 'Outro',
};

export const DeviceChart = ({ data }: { data: Record<string, number> }) => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return <div className="w-full min-h-[500px] bg-accent rounded-xl animate-pulse" />;
  }
  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-7 bg-background rounded-xl 2xl:col-span-2">
      <h1 className="font-bold w-full text-lg max-sm:ml-8">Trafico por dispositivo</h1>
      {!Object.entries(data).length && (
        <span className="text-muted-foreground flex items-center h-full italic text-center">
          Aguardando dados...
        </span>
      )}
      {!!Object.entries(data).length && (
        <ResponsiveContainer className="mt-4 -translate-x-5" width="100%" height={350}>
          <BarChart
            data={Object.entries(data).map(([name, value]) => ({
              name: MAP[name as keyof typeof MAP],
              value,
            }))}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
            barGap={20}
            barSize={20}
            startAngle={10}
          >
            <XAxis
              dataKey="name"
              scale="point"
              stroke="#2b2b2b"
              fontSize={12}
              axisLine={false}
              allowDataOverflow
              allowReorder="yes"
              padding={{ left: 40, right: 40 }}
            />
            <YAxis stroke="#2b2b2b" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="11" />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top' }}
              minPointSize={10}
            >
              {Object.entries(data).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  className="[&_tspan]:!fill-muted-foreground"
                  fill={`hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`}
                />
              ))}
            </Bar>
            <Tooltip
              separator=""
              wrapperClassName="[&_.recharts-tooltip-item-name]:hidden"
              formatter={(label) => <>{label} requisições</>}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
