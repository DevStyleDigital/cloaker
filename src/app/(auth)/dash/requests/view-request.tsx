import { Code } from 'components/code';
import { Dialog as RootDialog, DialogContent } from 'components/ui/dialog';
import { useState } from 'react';
import { CampaignRequest } from 'types/campaign';

export const ViewRequest = ({
  children,
  request,
}: BTypes.FCChildren & {
  request?: CampaignRequest;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <RootDialog onOpenChange={setOpen} open={open}>
      {children}
      <DialogContent className="p-4 py-10">
        <Code
          text={JSON.stringify(request || {}, null, 2)}
          language="json"
          className="!w-full overflow-x-auto"
        />
      </DialogContent>
    </RootDialog>
  );
};
