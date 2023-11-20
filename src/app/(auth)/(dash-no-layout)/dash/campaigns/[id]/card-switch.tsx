import { Switch, SwitchProps } from 'components/ui/switch';
import React from 'react';

export const CardSwitch = ({
  desc,
  icon: Icon,
  id,
  title,
  ...props
}: {
  id: string;
  icon: React.FC<{ className?: string }>;
  title: string;
  desc: string;
} & SwitchProps) => (
  <label
    htmlFor={id}
    className="bg-accent rounded-lg w-64 p-8 flex flex-col items-center justify-between text-center space-y-4 cursor-pointer"
  >
    <div className="flex flex-col items-center">
      <Icon className="stroke-2 w-16 h-16" />
      <h2 className="bold text-lg font-bold">{title}</h2>
      <p className="text-muted-foreground">{desc}</p>
    </div>
    <Switch id={id} {...props} />
  </label>
);
