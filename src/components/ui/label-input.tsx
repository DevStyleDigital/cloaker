import { cn } from 'utils/cn';

export const Label: BTypes.FC<{ peerText?: boolean }> = ({
  className,
  peerText = false,
  ...props
}) => (
  <label
    className={cn(
      className,
      'absolute pointer-events-none text-sm text-muted-foreground bg-background top-1/2 left-4 -translate-y-1/2 peer-focus:top-0 peer-focus:px-2 transition-all duration-75',
      {
        'peer-content-text:top-0 peer-content-text:px-2': peerText,
        'peer-content:top-0 peer-content:px-2': !peerText,
      },
    )}
    {...props}
  />
);
