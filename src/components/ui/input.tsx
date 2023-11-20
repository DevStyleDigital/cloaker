import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import MaskedInput, { type Mask } from 'react-text-mask';
import { cn } from 'utils/cn';
import { Button } from './button';
import { Label } from './label-input';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  render?: React.ReactNode;
  labelClassName?: string;
  help?: string;
  icons?: [
    React.FC<{ className?: string }> | undefined | null,
    (React.FC<{ className?: string }> | null)?,
  ];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, help, value, labelClassName, render, type, error, icons, ...props },
    ref,
  ) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const handlePasswordView = () => setPasswordVisible(!passwordVisible);

    return (
      <div className="flex flex-col h-fit w-full relative group">
        {!!render ? (
          render
        ) : (
          <input
            type={passwordVisible ? 'text' : type}
            className={cn(
              error && '!border-destructive',
              'peer flex w-full px-4 py-4 input-border file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent disabled:cursor-not-allowed disabled:opacity-50',
              className,
              {
                'pl-12': !!icons?.[0],
                'pr-12': !!icons?.[1] || type === 'password',
              },
            )}
            ref={ref}
            value={value}
            {...props}
          />
        )}
        <Label
          className={cn(labelClassName, {
            '!left-12 peer-focus:!left-4 peer-content:!left-4': !!icons?.[0],
            '!top-0 px-2': !!value?.toString().length,
          })}
        >
          {props.placeholder}
        </Label>
        <p className="absolute -bottom-6 text-muted-foreground text-sm">{help}</p>

        {icons?.map(
          (Icon, i) =>
            Icon && (
              <div
                key={i}
                className={cn('absolute top-1/2 -translate-y-1/2', {
                  'left-4': i === 0,
                  'right-4': i === 1,
                })}
              >
                <Icon className="w-6 h-6 text-muted-foreground" />
              </div>
            ),
        )}
        {type === 'password' && (
          <Button
            type="button"
            variant="ghost"
            className="absolute top-1/2 -translate-y-1/2 right-4"
            onClick={handlePasswordView}
          >
            {passwordVisible ? (
              <Eye className="w-6 h-6 text-muted-foreground" />
            ) : (
              <EyeOff className="w-6 h-6 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

const InputMask = React.forwardRef<
  HTMLInputElement,
  InputProps & { mask: Mask; showMask?: boolean }
>(({ mask, error, showMask, ...props }, ref) => {
  return (
    <MaskedInput
      mask={mask}
      guide={showMask}
      ref={ref as (instance: MaskedInput | null) => void}
      {...props}
      render={(innerRef, inputProps) => (
        <Input
          ref={innerRef as (instance: HTMLInputElement | null) => void}
          error={error}
          {...inputProps}
        />
      )}
    />
  );
});
InputMask.displayName = 'InputMask';

export { Input, InputMask };
