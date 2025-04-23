
import { useState } from "react";

type ActionType = null | "declined" | "removed";
export function useMerchantDialogState() {
  const [declineRemoveDialog, setDeclineRemoveDialog] = useState<{ open: boolean; action: ActionType }>({
    open: false,
    action: null
  });
  const [cardActionApp, setCardActionApp] = useState<any>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  return { declineRemoveDialog, setDeclineRemoveDialog, cardActionApp, setCardActionApp, showActionMenu, setShowActionMenu };
}
