import Link from "next/link";
import { Inbox, Milk, UserPlus, Wheat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Add Field Executive",
    icon: UserPlus,
    href: "/admin/field-executives?add=1",
  },
  { label: "Add Farmer", icon: Wheat },
  { label: "Record Milk Collection", icon: Milk },
  { label: "View Requests", icon: Inbox },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-3.5 text-[13px] font-semibold tracking-tight text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-start gap-2 rounded-md border border-border p-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <action.icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                {action.label}
              </Link>
            ) : (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    disabled
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-md border border-border/60 p-3 text-left text-sm font-medium text-muted-foreground/50",
                      "cursor-not-allowed",
                    )}
                  >
                    <action.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    {action.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}
