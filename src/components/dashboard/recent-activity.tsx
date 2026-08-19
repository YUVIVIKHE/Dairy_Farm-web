import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-3.5 text-[13px] font-semibold tracking-tight text-foreground">
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">
            No recent activity yet
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
