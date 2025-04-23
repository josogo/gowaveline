
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DeclineRemoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "declined" | "removed";
  onSubmit: (reason: string) => Promise<void>;
}

const COMMON_REASONS = [
  "Incomplete documents",
  "Duplicate submission",
  "Business not approved",
  "Fraud risk",
  "Requested by merchant",
  "Other",
];

export const DeclineRemoveDialog: React.FC<DeclineRemoveDialogProps> = ({
  open,
  onOpenChange,
  action,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonChange = (val: string) => {
    setReason(val);
    if (val !== "Other") setCustomReason("");
  };

  const handleAction = async () => {
    setIsSubmitting(true);
    await onSubmit(reason === "Other" ? customReason : reason);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "declined" ? "Decline Application" : "Remove Application"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <label className="text-sm font-medium">
            Please select a reason:
          </label>
          <Select value={reason} onValueChange={handleReasonChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_REASONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {reason === "Other" && (
            <Textarea
              placeholder="Enter custom reason"
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              disabled={isSubmitting}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleAction}
            disabled={isSubmitting || !reason || (reason === "Other" && !customReason.trim())}
          >
            {isSubmitting
              ? "Processing..."
              : action === "declined"
              ? "Decline"
              : "Remove"}
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeclineRemoveDialog;
