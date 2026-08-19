"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { AdminShell } from "@/components/layout/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-dvh flex-col gap-4 bg-background p-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-1 gap-4">
          <Skeleton className="hidden h-full w-64 lg:block" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}
