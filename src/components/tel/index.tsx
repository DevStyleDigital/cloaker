import { Input } from 'components/ui/input';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useEffect, useState } from 'react';
import { cn } from 'utils/cn';

export const Tel = ({
  error,
  loading,
  defaultValue,
}: {
  error: boolean;
  loading: boolean;
  defaultValue?: string;
}) => {
  const [telValue, setTelValue] = useState<string>(defaultValue || '');
  const [telInvalid, setInvalidTel] = useState(false);

  useEffect(() => {
    setTelValue(defaultValue || '');
  }, [defaultValue]);

  return (
    <Input
      placeholder="Telefone*"
      render={
        <MuiTelInput
          value={telValue}
          onChange={(v) => {
            setTelValue(v);
            setInvalidTel(v.length < 17 || !matchIsValidTel(v, 'BR'));
          }}
          name="tel"
          required
          defaultCountry="BR"
          className={cn(
            'peer w-full [&_fieldset]:input-border [&_fieldset]:!border-input [&_input]:text-foreground [&_.Mui-focused_fieldset]:!ring-4 [&_.Mui-focused_fieldset]:!ring-ring/20 [&_.Mui-focused_fieldset]:!border [&_.Mui-focused_fieldset]:!border-ring',
            { 'opacity-60': loading },
          )}
          error={!!error || telInvalid}
          disabled={loading}
        />
      }
    />
  );
};
