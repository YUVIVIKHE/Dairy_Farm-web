import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  unavailable,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  unavailable?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-[13px] font-medium text-muted-foreground">
            {label}
          </p>
          {unavailable ? (
            <p className="text-[1.75rem] leading-none font-semibold tracking-tight text-muted-foreground/40">
              &mdash;
            </p>
          ) : (
            <p className="text-[1.75rem] leading-none font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
          )}
          {delta && !unavailable && (
            <p className="text-xs font-medium text-success">{delta}</p>
          )}
          {unavailable && (
            <p className="text-xs text-muted-foreground/60">Not available yet</p>
          )}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
