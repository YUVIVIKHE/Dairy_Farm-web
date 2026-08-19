import type { Metadata } from "next";
import { Droplets, ShieldCheck, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BrandMark } from "@/components/auth/brand-mark";
import { LoginForm } from "@/components/auth/login-form";
import { LoginIllustration } from "@/components/auth/login-illustration";

export const metadata: Metadata = {
  title: "Sign in | Dairy Farm CRM",
  description: "Sign in to the Dairy Farm Management & Farmer CRM.",
};

const highlights = [
  {
    icon: Droplets,
    title: "Milk collection, tracked daily",
    description:
      "Every collection, every route, recorded accurately from farm to dairy.",
  },
  {
    icon: Sprout,
    title: "Built for farmers and staff",
    description:
      "A single platform connecting admins, collection officers, and farmers.",
  },
  {
    icon: ShieldCheck,
    title: "Secure, role-based access",
    description:
      "Every account sees only what's relevant to their role in the farm.",
  },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 flex-col overflow-hidden bg-primary px-12 py-10 text-primary-foreground xl:px-16 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full opacity-40"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle, var(--sidebar-primary) 0%, transparent 68%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <BrandMark className="bg-primary-foreground/10 text-primary-foreground" />
          <div>
            <p className="text-sm font-medium leading-none text-primary-foreground/70">
              Dairy Farm CRM
            </p>
            <p className="text-lg font-semibold leading-tight">
              Farm Management Platform
            </p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-6">
          <LoginIllustration className="h-auto w-full max-w-[420px]" />
        </div>

        <div className="relative space-y-8">
          <div className="space-y-2.5">
            <h2 className="max-w-md text-[1.75rem] leading-tight font-semibold text-balance">
              Everything your dairy operation needs, in one place.
            </h2>
            <p className="max-w-sm text-[15px] text-primary-foreground/70">
              Manage collections, officers, and farmer records with a
              platform built for real farm operations.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 border-t border-primary-foreground/10 pt-6 sm:grid-cols-3 sm:gap-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex flex-col gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[13px] font-medium leading-snug">
                    {title}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-primary-foreground/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-10 text-xs text-primary-foreground/45">
          &copy; {new Date().getFullYear()} Dairy Farm CRM. All rights
          reserved.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <BrandMark />
          <div>
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Dairy Farm CRM
            </p>
            <p className="text-lg font-semibold leading-tight text-foreground">
              Farm Management Platform
            </p>
          </div>
        </div>

        <Card className="w-full max-w-sm border-border/60 py-0 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your username or mobile number to continue.
              </p>
            </div>

            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-6 max-w-sm text-center text-xs text-muted-foreground">
          Having trouble signing in? Contact your farm administrator for
          assistance.
        </p>
      </div>
    </div>
  );
}
