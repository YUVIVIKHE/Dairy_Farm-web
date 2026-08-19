import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FieldExecutiveStatus } from "@/types/field-executive";

export function FieldExecutiveStatusBadge({
  status,
  className,
}: {
  status: FieldExecutiveStatus;
  className?: string;
}) {
  if (status === "ACTIVE") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-transparent bg-success/10 font-medium text-success",
          className,
        )}
      >
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        Active
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent bg-muted font-medium text-muted-foreground",
        className,
      )}
    >
      <span
        className="mr-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/40"
        aria-hidden="true"
      />
      Inactive
    </Badge>
  );
}
