"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Inbox,
  LayoutDashboard,
  LogOut,
  Milk,
  Package,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/auth/brand-mark";

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Dairy Field Executives",
    href: "/admin/field-executives",
    icon: Users,
    matchPrefix: "/admin/field-executives",
  },
  { label: "Farmers", icon: Wheat },
  { label: "Milk Collection", icon: Milk },
  { label: "Payroll & Payments", icon: Wallet },
  { label: "Products", icon: Package },
  { label: "Farmer Requests", icon: Inbox },
  { label: "Reports", icon: BarChart3 },
];

const MANAGEMENT_NAV: NavItem[] = [
  { label: "Users & Access", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "A";
}

function NavLink({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const isActive = item.matchPrefix
    ? pathname === item.matchPrefix || pathname.startsWith(`${item.matchPrefix}/`)
    : item.href === pathname;

  if (!item.href) {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/35",
          collapsed && "justify-center px-0",
        )}
        aria-disabled="true"
      >
        <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
        {!collapsed && (
          <span className="flex flex-1 items-center justify-between gap-2 truncate">
            {item.label}
            <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-sidebar-foreground/45">
              Soon
            </span>
          </span>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/[0.06] hover:text-sidebar-foreground",
        isActive &&
          "bg-sidebar-primary/15 text-sidebar-foreground hover:bg-sidebar-primary/15",
        collapsed && "justify-center px-0",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "h-[17px] w-[17px] shrink-0",
          isActive && "text-sidebar-primary",
        )}
        aria-hidden="true"
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function AdminSidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex h-14 items-center gap-2.5 px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <BrandMark className="h-8 w-8 shrink-0 bg-sidebar-primary text-sidebar-primary-foreground shadow-none" />
        {!collapsed && (
          <p className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
            Dairy Farm CRM
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-0.5">
          {!collapsed && (
            <p className="px-2.5 pt-3 pb-1.5 text-[11px] font-semibold tracking-wider text-sidebar-foreground/35 uppercase">
              Main
            </p>
          )}
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="space-y-0.5">
          {!collapsed && (
            <p className="px-2.5 pt-4 pb-1.5 text-[11px] font-semibold tracking-wider text-sidebar-foreground/35 uppercase">
              Management
            </p>
          )}
          {MANAGEMENT_NAV.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {user && (
        <div className="border-t border-sidebar-border p-2.5">
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-md p-1.5",
              collapsed && "justify-center",
            )}
          >
            <Avatar size="sm" className="shrink-0">
              <AvatarFallback className="bg-white/[0.08] text-sidebar-foreground">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium leading-tight text-sidebar-foreground">
                  {user.fullName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/50">
                  Administrator
                </p>
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="shrink-0 text-sidebar-foreground/60 hover:bg-white/[0.08] hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
