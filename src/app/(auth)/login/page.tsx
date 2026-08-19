import type { Metadata } from "next";
import { Droplets, ShieldCheck, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BrandMark } from "@/components/auth/brand-mark";
import { LoginForm } from "@/components/auth/login-form";

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
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary px-12 py-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
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

        <div className="relative space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold leading-tight text-balance">
              Everything your dairy operation needs, in one place.
            </h2>
            <p className="max-w-md text-primary-foreground/75">
              Manage collections, officers, and farmer records with a
              platform built for real farm operations.
            </p>
          </div>

          <ul className="space-y-5">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium leading-tight">{title}</p>
                  <p className="text-sm text-primary-foreground/70">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/60">
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

        <Card className="w-full max-w-sm border-border/60 shadow-sm">
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
