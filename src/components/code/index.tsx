import React from 'react';
import { CodeBlock, CopyBlock, dracula } from 'react-code-blocks';
import { type CodeBlockProps } from 'react-code-blocks/dist/components/CodeBlock';
import { type CopyBlockProps } from 'react-code-blocks/dist/components/CopyBlock';
import { cn } from 'utils/cn';

type CodeCopyProps = Partial<
  CopyBlockProps & { className?: string; showLineNumbers?: boolean }
>;
type CodeProps = Partial<
  CodeBlockProps & { className?: string; showLineNumbers?: boolean }
>;

export const Code = ({ className, ...props }: CodeProps) => {
  return (
    <div className={cn(className, '!font-mono [&_.plain-text]:!px-0')}>
      <CodeBlock showLineNumbers theme={dracula} {...props} />
    </div>
  );
};

const CopyBlockTyped = CopyBlock as React.FC<Partial<CopyBlockProps>>;
export const CodeCopy = ({ className, ...props }: CodeCopyProps) => {
  return (
    <div className={cn(className, '!font-mono w-full')}>
      <CopyBlockTyped
        showLineNumbers
        theme={dracula}
        customStyle={{ padding: '0.6rem' }}
        {...props}
      />
    </div>
  );
};
