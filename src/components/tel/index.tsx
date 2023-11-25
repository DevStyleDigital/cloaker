import { Input } from 'components/ui/input';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useEffect, useState } from 'react';

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
      placeholder="Telefone"
      render={
        <MuiTelInput
          value={telValue}
          onChange={(v) => {
            setTelValue(v);
            setInvalidTel(!matchIsValidTel(telValue));
          }}
          name="tel"
          required
          defaultCountry="BR"
          className="peer w-full [&_fieldset]:input-border [&_.Mui-focused_fieldset]:!ring-4 [&_.Mui-focused_fieldset]:!ring-ring/20 [&_.Mui-focused_fieldset]:!border [&_.Mui-focused_fieldset]:!border-ring"
          error={!!error || telInvalid}
          disabled={loading}
        />
      }
    />
  );
};
