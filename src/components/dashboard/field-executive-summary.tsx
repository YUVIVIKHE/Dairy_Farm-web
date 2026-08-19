"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FieldExecutiveStatusBadge } from "@/components/field-executives/field-executive-status-badge";
import { listFieldExecutives } from "@/services/field-executive.service";
import type { DairyFieldExecutive } from "@/types/field-executive";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function FieldExecutiveSummary() {
  const [items, setItems] = useState<DairyFieldExecutive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void listFieldExecutives({ page: 1, pageSize: 5 }).then((result) => {
      if (!active) return;
      setItems(result.items);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
            Field Executive Summary
          </h2>
          <Link
            href="/admin/field-executives"
            className="text-[13px] font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No field executives yet
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((fe) => (
              <li key={fe.id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                <Avatar size="sm">
                  <AvatarFallback>{getInitials(fe.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {fe.fullName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {fe.assignedArea} · {fe.todaysCollectionLiters} L today
                  </p>
                </div>
                <FieldExecutiveStatusBadge status={fe.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
