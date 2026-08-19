"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldExecutiveStatusBadge } from "@/components/field-executives/field-executive-status-badge";
import type { DairyFieldExecutive } from "@/types/field-executive";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function FieldExecutiveCard({
  fieldExecutive: fe,
  onActivate,
  onRequestDeactivate,
  onResetPassword,
}: {
  fieldExecutive: DairyFieldExecutive;
  onActivate: (fe: DairyFieldExecutive) => void;
  onRequestDeactivate: (fe: DairyFieldExecutive) => void;
  onResetPassword: (fe: DairyFieldExecutive) => void;
}) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer"
      onClick={() => router.push(`/admin/field-executives/${fe.id}`)}
    >
      <CardContent className="flex gap-3">
        <Avatar size="lg" className="mt-0.5 shrink-0">
          <AvatarFallback>{getInitials(fe.fullName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-foreground">
                {fe.fullName}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {fe.employeeId}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-mr-1.5 -mt-1.5 h-11 w-11 shrink-0"
                  onClick={(event) => event.stopPropagation()}
                  aria-label="Actions"
                >
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
              >
                <DropdownMenuItem
                  onSelect={() =>
                    router.push(`/admin/field-executives/${fe.id}`)
                  }
                >
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                <DropdownMenuItem disabled>View Farmers</DropdownMenuItem>
                <DropdownMenuItem disabled>View Collection</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onResetPassword(fe)}>
                  Reset Password
                </DropdownMenuItem>
                {fe.status === "ACTIVE" ? (
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => onRequestDeactivate(fe)}
                  >
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onSelect={() => onActivate(fe)}>
                    Activate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <FieldExecutiveStatusBadge status={fe.status} />
            <span className="text-xs text-muted-foreground">
              {fe.assignedArea}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 border-t border-border pt-1.5 text-xs text-muted-foreground tabular-nums">
            <span>{fe.mobile}</span>
            <span>{fe.farmersCount} farmers</span>
            <span>{fe.todaysCollectionLiters} L today</span>
            <span>Joined {format(new Date(fe.joinedDate), "d MMM yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
