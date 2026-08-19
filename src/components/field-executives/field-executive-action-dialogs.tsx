"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DairyFieldExecutive } from "@/types/field-executive";

export function DeactivateFieldExecutiveDialog({
  fieldExecutive,
  open,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: {
  fieldExecutive: DairyFieldExecutive | null;
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate field executive?</DialogTitle>
          <DialogDescription>
            {fieldExecutive?.fullName ?? "This field executive"} will lose
            access to their account and won&apos;t be able to record new
            collections. Existing historical records remain intact and are
            not affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ResetPasswordDialog({
  fieldExecutive,
  password,
  open,
  onOpenChange,
}: {
  fieldExecutive: DairyFieldExecutive | null;
  password: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password reset</DialogTitle>
          <DialogDescription>
            A new temporary password was generated for{" "}
            {fieldExecutive?.fullName ?? "this field executive"}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
          <code className="font-mono text-sm font-medium tracking-wide">
            {visible ? password : "•".repeat(password?.length ?? 10)}
          </code>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        <Alert className="border-warning/30 bg-warning/10">
          <AlertDescription className="text-warning-foreground">
            Share this password securely with the field executive.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Password"}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
