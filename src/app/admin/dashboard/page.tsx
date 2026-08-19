"use client";

import { useEffect, useState } from "react";
import { Inbox, Milk, Users, Wheat } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useSetPageTitle } from "@/lib/layout/admin-page-header-context";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { FieldExecutiveSummary } from "@/components/dashboard/field-executive-summary";
import { listFieldExecutives } from "@/services/field-executive.service";

export default function AdminDashboardPage() {
  useSetPageTitle("Dashboard", [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Dashboard" },
  ]);
  const { user } = useAuth();

  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    void listFieldExecutives({ status: "ACTIVE", page: 1, pageSize: 1 }).then(
      (result) => setActiveCount(result.total),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your dairy operations today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wheat} label="Total Farmers" value="" unavailable />
        <StatCard
          icon={Users}
          label="Active Field Executives"
          value={activeCount === null ? "" : String(activeCount)}
          unavailable={activeCount === null}
        />
        <StatCard
          icon={Milk}
          label="Today's Milk Collection"
          value=""
          unavailable
        />
        <StatCard icon={Inbox} label="Pending Requests" value="" unavailable />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <QuickActions />
          <FieldExecutiveSummary />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
