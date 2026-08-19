"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, PanelLeft, Search } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useAdminPageHeader } from "@/lib/layout/admin-page-header-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  "field-executives": "Dairy Field Executives",
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "A";
}

function useBreadcrumbSegments(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = SEGMENT_LABELS[segment] ?? segment;
    return { href, label };
  });
}

export function AdminHeader({
  onToggleSidebar,
  onOpenMobileSidebar,
}: {
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { title, breadcrumbs: pageBreadcrumbs } = useAdminPageHeader();
  const fallbackSegments = useBreadcrumbSegments(pathname);

  const breadcrumbs =
    pageBreadcrumbs.length > 0
      ? pageBreadcrumbs
      : fallbackSegments.map((segment) => ({
          label: segment.label,
          href: segment.href,
        }));

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMobileSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="hidden text-muted-foreground lg:inline-flex"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      <div className="min-w-0 flex-1 pl-1">
        {breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList className="text-[13px]">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={`${crumb.label}-${index}`} className="contents">
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage className="font-medium text-foreground">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <p className="truncate text-sm font-medium text-foreground">
            {title ?? "Admin"}
          </p>
        )}
      </div>

      <div className="hidden items-center sm:flex">
        <button
          type="button"
          disabled
          className="flex h-8 w-56 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 text-sm text-muted-foreground disabled:cursor-default disabled:opacity-100"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Search...</span>
        </button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative text-muted-foreground"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <p className="text-sm text-muted-foreground">No new notifications</p>
        </PopoverContent>
      </Popover>

      {user && (
        <>
          <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 pl-1.5"
              >
                <Avatar size="sm">
                  <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                </Avatar>
                <ChevronDown
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5 py-1.5">
                <span className="text-sm font-medium text-foreground">
                  {user.fullName}
                </span>
                <span className="text-xs text-muted-foreground">
                  Administrator
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Profile</DropdownMenuItem>
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </header>
  );
}
