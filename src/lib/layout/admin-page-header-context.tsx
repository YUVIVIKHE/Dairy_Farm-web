"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface PageBreadcrumb {
  label: string;
  href?: string;
}

interface AdminPageHeaderValue {
  title: string | null;
  breadcrumbs: PageBreadcrumb[];
  setPageHeader: (title: string, breadcrumbs: PageBreadcrumb[]) => void;
  clearPageHeader: () => void;
}

const AdminPageHeaderContext = createContext<AdminPageHeaderValue | undefined>(
  undefined,
);

export function AdminPageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<PageBreadcrumb[]>([]);

  const value = useMemo<AdminPageHeaderValue>(
    () => ({
      title,
      breadcrumbs,
      setPageHeader: (nextTitle, nextBreadcrumbs) => {
        setTitle(nextTitle);
        setBreadcrumbs(nextBreadcrumbs);
      },
      clearPageHeader: () => {
        setTitle(null);
        setBreadcrumbs([]);
      },
    }),
    [title, breadcrumbs],
  );

  return (
    <AdminPageHeaderContext.Provider value={value}>
      {children}
    </AdminPageHeaderContext.Provider>
  );
}

function useAdminPageHeaderContext(): AdminPageHeaderValue {
  const context = useContext(AdminPageHeaderContext);
  if (!context) {
    throw new Error(
      "useAdminPageHeaderContext must be used within AdminPageHeaderProvider",
    );
  }
  return context;
}

export function useAdminPageHeader(): {
  title: string | null;
  breadcrumbs: PageBreadcrumb[];
} {
  const { title, breadcrumbs } = useAdminPageHeaderContext();
  return { title, breadcrumbs };
}

export function useSetPageTitle(
  title: string,
  breadcrumbs: PageBreadcrumb[],
): void {
  const { setPageHeader, clearPageHeader } = useAdminPageHeaderContext();

  useEffect(() => {
    setPageHeader(title, breadcrumbs);
    return () => clearPageHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, JSON.stringify(breadcrumbs)]);
}
