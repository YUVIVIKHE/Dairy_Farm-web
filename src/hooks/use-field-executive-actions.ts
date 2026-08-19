"use client";

import { useState } from "react";
import {
  activateFieldExecutive,
  deactivateFieldExecutive,
  resetFieldExecutivePassword,
} from "@/services/field-executive.service";
import type { DairyFieldExecutive } from "@/types/field-executive";

interface UseFieldExecutiveActionsOptions {
  onUpdated?: (updated: DairyFieldExecutive) => void;
}

export function useFieldExecutiveActions(
  options: UseFieldExecutiveActionsOptions = {},
) {
  const [pendingDeactivateId, setPendingDeactivateId] = useState<string | null>(
    null,
  );
  const [isMutating, setIsMutating] = useState(false);
  const [resetPasswordFor, setResetPasswordFor] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  async function activate(fe: DairyFieldExecutive) {
    setIsMutating(true);
    setActionError(null);
    try {
      const updated = await activateFieldExecutive(fe.id);
      options.onUpdated?.(updated);
    } catch {
      setActionError("Unable to update status. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  function requestDeactivate(fe: DairyFieldExecutive) {
    setPendingDeactivateId(fe.id);
  }

  function cancelDeactivate() {
    setPendingDeactivateId(null);
  }

  async function confirmDeactivate(fe: DairyFieldExecutive) {
    setIsMutating(true);
    setActionError(null);
    try {
      const updated = await deactivateFieldExecutive(fe.id);
      options.onUpdated?.(updated);
      setPendingDeactivateId(null);
    } catch {
      setActionError("Unable to update status. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  async function resetPassword(fe: DairyFieldExecutive) {
    setIsMutating(true);
    setActionError(null);
    try {
      const { temporaryPassword } = await resetFieldExecutivePassword(fe.id);
      setResetPasswordFor(fe.id);
      setResetPasswordValue(temporaryPassword);
    } catch {
      setActionError("Unable to reset password. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  function closeResetPassword() {
    setResetPasswordFor(null);
    setResetPasswordValue(null);
  }

  return {
    isMutating,
    actionError,
    pendingDeactivateId,
    resetPasswordFor,
    resetPasswordValue,
    activate,
    requestDeactivate,
    cancelDeactivate,
    confirmDeactivate,
    resetPassword,
    closeResetPassword,
  };
}
