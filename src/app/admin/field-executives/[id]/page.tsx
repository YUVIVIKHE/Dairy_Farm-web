"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, KeyRound, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSetPageTitle } from "@/lib/layout/admin-page-header-context";
import { FieldExecutiveStatusBadge } from "@/components/field-executives/field-executive-status-badge";
import {
  DeactivateFieldExecutiveDialog,
  ResetPasswordDialog,
} from "@/components/field-executives/field-executive-action-dialogs";
import { useFieldExecutiveActions } from "@/hooks/use-field-executive-actions";
import { getFieldExecutive } from "@/services/field-executive.service";
import type { DairyFieldExecutive } from "@/types/field-executive";

export default function FieldExecutiveProfilePage({
  params,
}: PageProps<"/admin/field-executives/[id]">) {
  const { id } = use(params);

  const [fieldExecutive, setFieldExecutive] =
    useState<DairyFieldExecutive | null>(null);
  const [loadedForId, setLoadedForId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const isLoading = loadedForId !== id;

  useEffect(() => {
    getFieldExecutive(id)
      .then((fe) => {
        setFieldExecutive(fe);
        setNotFound(false);
        setLoadedForId(id);
      })
      .catch(() => {
        setNotFound(true);
        setLoadedForId(id);
      });
  }, [id]);

  useSetPageTitle(fieldExecutive?.fullName ?? "Field Executive", [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Dairy Field Executives", href: "/admin/field-executives" },
    { label: fieldExecutive?.fullName ?? "…" },
  ]);

  const { actionError, pendingDeactivateId, resetPasswordFor, resetPasswordValue, activate, requestDeactivate, cancelDeactivate, confirmDeactivate, resetPassword, closeResetPassword, isMutating } =
    useFieldExecutiveActions({
      onUpdated: (updated) => setFieldExecutive(updated),
    });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (notFound || !fieldExecutive) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <h1 className="text-base font-semibold text-foreground">
          Field executive not found
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This field executive may have been removed or the link is
          incorrect.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/field-executives">Back to Field Executives</Link>
        </Button>
      </div>
    );
  }

  const isPendingDeactivate = pendingDeactivateId === fieldExecutive.id;
  const isResettingPassword = resetPasswordFor === fieldExecutive.id;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 gap-1.5">
          <Link href="/admin/field-executives">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Field Executives
          </Link>
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {fieldExecutive.fullName}
              </h1>
              <FieldExecutiveStatusBadge status={fieldExecutive.status} />
            </div>
            <p className="mt-0.5 font-mono text-sm text-muted-foreground">
              {fieldExecutive.employeeId}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => resetPassword(fieldExecutive)}
              disabled={isMutating}
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Reset Password
            </Button>
            {fieldExecutive.status === "ACTIVE" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-destructive"
                onClick={() => requestDeactivate(fieldExecutive)}
                disabled={isMutating}
              >
                <PowerOff className="h-4 w-4" aria-hidden="true" />
                Deactivate
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-1.5"
                onClick={() => activate(fieldExecutive)}
                disabled={isMutating}
              >
                <Power className="h-4 w-4" aria-hidden="true" />
                Activate
              </Button>
            )}
          </div>
        </div>
      </div>

      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="farmers">Farmers</TabsTrigger>
          <TabsTrigger value="collection">Milk Collection</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <Field label="Mobile" value={fieldExecutive.mobile} mono />
              <Field label="Email" value={fieldExecutive.email ?? "—"} />
              <Field label="Assigned Area" value={fieldExecutive.assignedArea} />
              <Field
                label="Farmers"
                value={String(fieldExecutive.farmersCount)}
              />
              <Field
                label="Today's Collection"
                value={`${fieldExecutive.todaysCollectionLiters} L`}
              />
              <Field
                label="Joined Date"
                value={format(new Date(fieldExecutive.joinedDate), "d MMM yyyy")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farmers">
          <ComingSoonTab label="Farmers" />
        </TabsContent>
        <TabsContent value="collection">
          <ComingSoonTab label="Milk Collection" />
        </TabsContent>
        <TabsContent value="activity">
          <ComingSoonTab label="Activity" />
        </TabsContent>
      </Tabs>

      <DeactivateFieldExecutiveDialog
        fieldExecutive={fieldExecutive}
        open={isPendingDeactivate}
        isSubmitting={isMutating}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) cancelDeactivate();
        }}
        onConfirm={() => void confirmDeactivate(fieldExecutive)}
      />

      <ResetPasswordDialog
        fieldExecutive={fieldExecutive}
        password={resetPasswordValue}
        open={isResettingPassword}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeResetPassword();
        }}
      />
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-medium text-foreground",
          mono && "font-mono tabular-nums",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ComingSoonTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">Coming soon</p>
    </div>
  );
}
