"use client";

import { Search } from "lucide-react";

type GuestFiltersProps = {
  search: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
};

export default function GuestFilters({
  search,
  typeFilter,
  onSearchChange,
  onTypeChange,
}: GuestFiltersProps) {
  const filters = ["All", "Chalet Guest", "External Guest"];

  return (
    <div className="mb-6 rounded-2xl border border-purana-brown/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-purana-brown/40"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search guests..."
            className="w-full rounded-xl border border-purana-brown/10 bg-purana-soft py-2.5 pl-11 pr-4 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/40 focus:border-purana-green/40 focus:bg-white focus:ring-2 focus:ring-purana-green/10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onTypeChange(filter)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                typeFilter === filter
                  ? "bg-purana-green text-white"
                  : "bg-purana-soft text-purana-brown/70 hover:bg-purana-green/10 hover:text-purana-green"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}