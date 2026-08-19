"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function FieldExecutiveTable({
  items,
  onActivate,
  onRequestDeactivate,
  onResetPassword,
}: {
  items: DairyFieldExecutive[];
  onActivate: (fe: DairyFieldExecutive) => void;
  onRequestDeactivate: (fe: DairyFieldExecutive) => void;
  onResetPassword: (fe: DairyFieldExecutive) => void;
}) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Name
            </TableHead>
            <TableHead className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Employee ID
            </TableHead>
            <TableHead className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Mobile
            </TableHead>
            <TableHead className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Area
            </TableHead>
            <TableHead className="h-10 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Farmers
            </TableHead>
            <TableHead className="h-10 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Today&apos;s Collection
            </TableHead>
            <TableHead className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Joined Date
            </TableHead>
            <TableHead className="h-10 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((fe) => (
            <TableRow
              key={fe.id}
              className="cursor-pointer border-border"
              onClick={() => router.push(`/admin/field-executives/${fe.id}`)}
            >
              <TableCell className="py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(fe.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {fe.fullName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3 font-mono text-[13px] text-muted-foreground">
                {fe.employeeId}
              </TableCell>
              <TableCell className="py-3 text-muted-foreground tabular-nums">
                {fe.mobile}
              </TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {fe.assignedArea}
              </TableCell>
              <TableCell className="py-3 text-right text-muted-foreground tabular-nums">
                {fe.farmersCount}
              </TableCell>
              <TableCell className="py-3 text-right text-foreground tabular-nums">
                {fe.todaysCollectionLiters} L
              </TableCell>
              <TableCell className="py-3">
                <FieldExecutiveStatusBadge status={fe.status} />
              </TableCell>
              <TableCell className="py-3 text-muted-foreground tabular-nums">
                {format(new Date(fe.joinedDate), "d MMM yyyy")}
              </TableCell>
              <TableCell className="py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
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
                    <DropdownMenuItem disabled>
                      View Collection
                    </DropdownMenuItem>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
