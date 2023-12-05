'use client';

import * as React from 'react';
import { ChevronsUpDown, X } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { Command, CommandGroup, CommandItem } from 'components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from 'utils/cn';

interface MultiSelectProps {
  defaultValues?: string[];
  placeholder?: string;
  options: ({ value: string; label: string }[] | string)[];
  onValueChange: (v: string[]) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const MultiSelect = ({
  options: optionsWithDivision,
  className,
  disabled,
  required,
  placeholder,
  defaultValues,
  onValueChange,
}: MultiSelectProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const options = optionsWithDivision.reduce(
    (acc: { value: string; label: string }[], item) =>
      typeof item === 'string' ? acc : [...acc, ...item],
    [],
  );
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(defaultValues || []);
  const [inputValue, setInputValue] = React.useState('');

  const handleUnselect = React.useCallback((value: string) => {
    setSelected((prev) => {
      const newArray = [...prev];
      const index = newArray.indexOf(value);
      newArray.splice(index, 1);
      return newArray;
    });
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter((item) => !selected.includes(item.value));

  React.useEffect(() => {
    onValueChange(selected);
  }, [selected, onValueChange]);

  return (
    <Command
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      className={cn(className, 'overflow-visible bg-transparent', {
        'cursor-not-allowed opacity-50 pointer-events-none': disabled,
      })}
    >
      <div className="flex w-full px-4 py-4 input-border">
        <div className="flex w-full gap-1 flex-wrap relative">
          {selected.map((v) => {
            const option = options.find((o) => o.value === v)!;
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  disabled={disabled}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(v);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(v)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}

          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 pr-6"
            required={!selected.length ? required : false}
          />
          <ChevronsUpDown className="self-center h-4 w-4 opacity-50 pointer-events-none absolute right-0" />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-52">
              {optionsWithDivision.map((item, i) =>
                typeof item === 'string' ? (
                  <span
                    key={i}
                    className="text-muted-foreground italic text-sm px-4 pb-4 pt-8"
                  >
                    {item}
                  </span>
                ) : (
                  <React.Fragment key={i}>
                    {item
                      .filter((item) => !selected.includes(item.value))
                      .map((option) => {
                        return (
                          <CommandItem
                            key={option.value}
                            disabled={disabled}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              setInputValue('');
                              setSelected((prev) => [...prev, option.value]);
                            }}
                            className="cursor-pointer aria-selected:bg-transparent hover:!bg-accent pl-6 focus:!bg-accent"
                          >
                            {option.label}
                          </CommandItem>
                        );
                      })}
                  </React.Fragment>
                ),
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
};
