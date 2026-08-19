"use client";

import { useEffect, useRef, useState } from "react";
import { ListFilter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  FieldExecutiveListParams,
  FieldExecutiveStatus,
} from "@/types/field-executive";

export interface FieldExecutiveFiltersValue {
  search: string;
  status: FieldExecutiveStatus | "ALL";
  area: string | "ALL";
  joinedAfter: string;
  joinedBefore: string;
}

const DEFAULT_FILTERS: FieldExecutiveFiltersValue = {
  search: "",
  status: "ALL",
  area: "ALL",
  joinedAfter: "",
  joinedBefore: "",
};

function toListParams(
  value: FieldExecutiveFiltersValue,
): Omit<FieldExecutiveListParams, "page" | "pageSize"> {
  return {
    search: value.search || undefined,
    status: value.status === "ALL" ? undefined : value.status,
    area: value.area === "ALL" ? undefined : value.area,
    joinedAfter: value.joinedAfter || undefined,
    joinedBefore: value.joinedBefore || undefined,
  };
}

function hasActiveFilters(value: FieldExecutiveFiltersValue): boolean {
  return (
    value.search.trim() !== "" ||
    value.status !== "ALL" ||
    value.area !== "ALL" ||
    value.joinedAfter !== "" ||
    value.joinedBefore !== ""
  );
}

export function FieldExecutiveFilters({
  areas,
  resultCount,
  onFiltersChange,
}: {
  areas: string[];
  resultCount: number;
  onFiltersChange: (
    params: Omit<FieldExecutiveListParams, "page" | "pageSize">,
  ) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<FieldExecutiveFiltersValue>(
    DEFAULT_FILTERS,
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      onFiltersChange(toListParams(filters));
      return;
    }
    onFiltersChange(toListParams(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const activeFiltersCount = [
    filters.status !== "ALL",
    filters.area !== "ALL",
    filters.joinedAfter !== "",
    filters.joinedBefore !== "",
  ].filter(Boolean).length;

  function clearAll() {
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, employee ID, mobile, or area"
            className="pl-8"
            aria-label="Search field executives"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="gap-1.5 text-foreground">
              <ListFilter className="h-3.5 w-3.5" aria-hidden="true" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value as FieldExecutiveFiltersValue["status"],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Area</Label>
              <Select
                value={filters.area}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, area: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Date joined</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.joinedAfter}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      joinedAfter: event.target.value,
                    }))
                  }
                  aria-label="Joined after"
                  className="text-sm"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={filters.joinedBefore}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      joinedBefore: event.target.value,
                    }))
                  }
                  aria-label="Joined before"
                  className="text-sm"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters(filters) && (
          <Button
            type="button"
            variant="ghost"
            className="gap-1.5 text-muted-foreground"
            onClick={clearAll}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>

      <p className="text-[13px] text-muted-foreground">
        <span className="font-medium text-foreground tabular-nums">
          {resultCount}
        </span>{" "}
        {resultCount === 1 ? "field executive" : "field executives"} found
      </p>
    </div>
  );
}

export { DEFAULT_FILTERS, hasActiveFilters };
