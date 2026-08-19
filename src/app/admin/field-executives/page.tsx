"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetPageTitle } from "@/lib/layout/admin-page-header-context";
import { FieldExecutiveFilters } from "@/components/field-executives/field-executive-filters";
import { FieldExecutiveTable } from "@/components/field-executives/field-executive-table";
import { FieldExecutiveCard } from "@/components/field-executives/field-executive-card";
import { AddFieldExecutiveDrawer } from "@/components/field-executives/add-field-executive-drawer";
import {
  DeactivateFieldExecutiveDialog,
  ResetPasswordDialog,
} from "@/components/field-executives/field-executive-action-dialogs";
import { useFieldExecutiveActions } from "@/hooks/use-field-executive-actions";
import { listAreas, listFieldExecutives } from "@/services/field-executive.service";
import type {
  DairyFieldExecutive,
  FieldExecutiveListParams,
} from "@/types/field-executive";

export default function FieldExecutivesPage() {
  useSetPageTitle("Dairy Field Executives", [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Dairy Field Executives" },
  ]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<DairyFieldExecutive[]>([]);
  const [total, setTotal] = useState(0);
  const [loadedForKey, setLoadedForKey] = useState<string | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [filterParams, setFilterParams] = useState<
    Omit<FieldExecutiveListParams, "page" | "pageSize">
  >({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasActiveFilters = Object.values(filterParams).some(Boolean);

  const autoOpenHandled = useRef(false);
  const filterKey = JSON.stringify(filterParams);
  const isLoading = loadedForKey !== filterKey;

  const refetchList = useCallback(() => {
    return listFieldExecutives({ ...filterParams, page: 1, pageSize: 50 }).then(
      (result) => {
        setItems(result.items);
        setTotal(result.total);
        setLoadedForKey(filterKey);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    void refetchList();
  }, [refetchList]);

  useEffect(() => {
    void listAreas().then(setAreas);
  }, []);

  // Reading the ?add=1 query param is a one-time sync from the URL (an
  // external source) after mount, not state mirrored from props/state.
  useEffect(() => {
    if (autoOpenHandled.current) return;
    if (searchParams.get("add") === "1") {
      autoOpenHandled.current = true;
      router.replace("/admin/field-executives");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrawerOpen(true);
    }
  }, [searchParams, router]);

  const { actionError, pendingDeactivateId, resetPasswordFor, resetPasswordValue, activate, requestDeactivate, cancelDeactivate, confirmDeactivate, resetPassword, closeResetPassword, isMutating } =
    useFieldExecutiveActions({
      onUpdated: (updated) => {
        setItems((prev) =>
          prev.map((fe) => (fe.id === updated.id ? updated : fe)),
        );
      },
    });

  const pendingDeactivate = items.find((fe) => fe.id === pendingDeactivateId) ?? null;
  const resettingFor = items.find((fe) => fe.id === resetPasswordFor) ?? null;

  function handleCreated(fe: DairyFieldExecutive) {
    setItems((prev) => [fe, ...prev]);
    setTotal((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Dairy Field Executives
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your field team, assigned areas, and farmer relationships.
          </p>
        </div>
        <Button
          type="button"
          className="gap-1.5"
          onClick={() => setDrawerOpen(true)}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Field Executive
        </Button>
      </div>

      {actionError && (
        <p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </p>
      )}

      <FieldExecutiveFilters
        areas={areas}
        resultCount={total}
        onFiltersChange={setFilterParams}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      ) : total === 0 && !hasActiveFilters ? (
        <EmptyState onAdd={() => setDrawerOpen(true)} />
      ) : total === 0 ? (
        <NoResultsState onClear={() => setFilterParams({})} />
      ) : (
        <>
          <div className="hidden lg:block">
            <FieldExecutiveTable
              items={items}
              onActivate={activate}
              onRequestDeactivate={requestDeactivate}
              onResetPassword={resetPassword}
            />
          </div>
          <div className="space-y-3 lg:hidden">
            {items.map((fe) => (
              <FieldExecutiveCard
                key={fe.id}
                fieldExecutive={fe}
                onActivate={activate}
                onRequestDeactivate={requestDeactivate}
                onResetPassword={resetPassword}
              />
            ))}
          </div>
        </>
      )}

      <AddFieldExecutiveDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onCreated={handleCreated}
      />

      <DeactivateFieldExecutiveDialog
        fieldExecutive={pendingDeactivate}
        open={pendingDeactivate !== null}
        isSubmitting={isMutating}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) cancelDeactivate();
        }}
        onConfirm={() => {
          if (pendingDeactivate) void confirmDeactivate(pendingDeactivate);
        }}
      />

      <ResetPasswordDialog
        fieldExecutive={resettingFor}
        password={resetPasswordValue}
        open={resettingFor !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeResetPassword();
        }}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <UserRoundPlus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">
          No Dairy Field Executives
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add your first field executive to start managing your dairy field
          operations.
        </p>
      </div>
      <Button type="button" className="gap-1.5" onClick={onAdd}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Field Executive
      </Button>
    </div>
  );
}

function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">
          No results match your filters
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting or clearing your filters to see more field
          executives.
        </p>
      </div>
      <Button type="button" variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
