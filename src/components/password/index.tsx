import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from 'utils/cn';

const PasswordRules: BTypes.FC<{ rulePass: any }> = ({
  children,
  rulePass,
  ...props
}) => (
  <span
    className={cn(
      'text-muted-foreground text-xs w-full',
      { 'text-green-600': rulePass },
      { 'text-destructive': rulePass === false },
    )}
  >
    {children}
  </span>
);

export const Password = ({
  error,
  loading,
  handleInvalidState,
  placeholder,
}: {
  error: boolean;
  loading: boolean;
  placeholder?: string;
  handleInvalidState: (i: boolean) => void;
}) => {
  const [passwordRulesPass, setPasswordRulesPass] = useState({
    minLength: undefined as boolean | undefined,
    hasUpperCase: undefined as boolean | undefined,
    hasNumber: undefined as boolean | undefined,
    hasSymbol: undefined as boolean | undefined,
  });

  return (
    <>
      <div>
        <Label className="sr-only" htmlFor="password">
          Senha
        </Label>
        <Input
          id="password"
          placeholder={placeholder || 'Senha'}
          type="password"
          name="password"
          required
          icons={[Lock]}
          className={cn({
            'border-destructive':
              error ||
              Object.values(passwordRulesPass).some(
                (rule) => rule !== undefined && !rule,
              ),
          })}
          disabled={loading}
          onChange={({ target: { value } }) => {
            const SymbolRegex = /[^a-zA-Z 0-9]+/g;
            const NumberRegex = /\d/g;
            const UppercaseRegex = /[A-Z]/;

            const rulesPass = {
              minLength: value.length >= 6,
              hasSymbol: SymbolRegex.test(value),
              hasNumber: NumberRegex.test(value),
              hasUpperCase: UppercaseRegex.test(value),
            };

            setPasswordRulesPass(rulesPass);
            handleInvalidState(
              !rulesPass.hasNumber ||
                !rulesPass.hasSymbol ||
                !rulesPass.hasUpperCase ||
                !rulesPass.minLength,
            );
          }}
        />
      </div>
      <div className="flex justify-between mt-5 pb-5 gap-2 max-sm:flex-col">
        <div className="flex flex-col gap-2">
          <PasswordRules rulePass={passwordRulesPass.minLength}>
            Senha precisa ter um mínimo de 6 characters.
          </PasswordRules>
          <PasswordRules rulePass={passwordRulesPass.hasUpperCase}>
            Senha precisa ter pelo menos um caractere maiúsculo.
          </PasswordRules>
        </div>
        <div className="flex flex-col gap-2">
          <PasswordRules rulePass={passwordRulesPass.hasNumber}>
            Senha precisa ter pelo menos um número.
          </PasswordRules>
          <PasswordRules rulePass={passwordRulesPass.hasSymbol}>
            Senha precisa ter pelo menos um caractere especial (# @ ! % * & .)
          </PasswordRules>
        </div>
      </div>
    </>
  );
};
