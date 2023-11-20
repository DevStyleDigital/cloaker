'use client';
import { monthlyTraffic } from 'mocks/data-home';
import clsx from 'clsx';

export const TrafficGraphic = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-7 bg-accent rounded-xl">
      <h1 className="font-bold text-lg">Trafico por site</h1>
      {monthlyTraffic.map((item, index) => {
        return (
          <div
            key={index}
            className="group flex justify-between items-center cursor-default"
          >
            <div className="w-full flex gap-4 items-center">
              <span
                style={{ width: `${item.percentage}%` }}
                className="h-2 rounded-full bg-muted-foreground/20 transition-all duration-300 group-hover:bg-primary"
              />
              <span className="font-medium transition-all text-muted-foreground group-hover:text-ring">
                {item.percentage}%
              </span>
            </div>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
