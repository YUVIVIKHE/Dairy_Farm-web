import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 2h8l1 3.2c.4 1.2.4 2.5 0 3.7L15.6 13H8.4L7 8.9c-.4-1.2-.4-2.5 0-3.7L8 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.4 13h7.2l1.3 6.2c.2 1-.5 1.8-1.5 1.8H8.6c-1 0-1.7-.9-1.5-1.8L8.4 13Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 16.5c.9.6 1.8.9 2.5.9s1.6-.3 2.5-.9"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
