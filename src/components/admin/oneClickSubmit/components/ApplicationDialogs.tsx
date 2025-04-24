
import React, { Suspense, lazy } from 'react';
import { ApplicationDialog } from '../ApplicationDialog';

const DeclineRemoveDialog = lazy(() => import('../DeclineRemoveDialog'));
const ApplicationFlow = lazy(() => import('../ApplicationFlow'));

interface ApplicationDialogsProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  appFlowOpen: boolean;
  selectedApplication: any;
  handleCloseApplicationFlow: () => void;
  declineRemoveDialog: {
    open: boolean;
    action: null | "declined" | "removed";
  };
  setDeclineRemoveDialog: (dialog: { open: boolean; action: null | "declined" | "removed" }) => void;
  processDeclineRemove: (reason: string) => Promise<void>;
}

export const ApplicationDialogs: React.FC<ApplicationDialogsProps> = ({
  dialogOpen,
  setDialogOpen,
  appFlowOpen,
  selectedApplication,
  handleCloseApplicationFlow,
  declineRemoveDialog,
  setDeclineRemoveDialog,
  processDeclineRemove,
}) => {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading details...</div>}>
      {dialogOpen && (
        <ApplicationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          application={selectedApplication}
        />
      )}
      {appFlowOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="container mx-auto py-8 px-4">
            <ApplicationFlow 
              merchantApplication={selectedApplication}
              onClose={handleCloseApplicationFlow}
            />
          </div>
        </div>
      )}
      {declineRemoveDialog.open && (
        <DeclineRemoveDialog
          open={declineRemoveDialog.open}
          onOpenChange={(open) => 
            setDeclineRemoveDialog({ open, action: open ? declineRemoveDialog.action : null })
          }
          action={declineRemoveDialog.action || "declined"}
          onSubmit={processDeclineRemove}
        />
      )}
    </Suspense>
  );
};
