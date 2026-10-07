"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type TherapistFiltersProps = {
  search: string;
  statusFilter: string;
  specializationFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
};

export default function TherapistFilters({
  search,
  statusFilter,
  specializationFilter,
  onSearchChange,
  onStatusChange,
  onSpecializationChange,
}: TherapistFiltersProps) {
  return (
    <div className="mb-6 rounded-2xl border border-purana-brown/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-purana-brown/40"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search therapists..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
          />
        </div>

        {/* Specialization */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={17}
            className="hidden text-purana-brown/50 sm:block"
          />

          <select
            value={specializationFilter}
            onChange={(e) =>
              onSpecializationChange(e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-purana-brown outline-none focus:border-purana-green"
          >
            <option value="All">All Specializations</option>
            <option value="Ayurvedic Massage">
              Ayurvedic Massage
            </option>
            <option value="Ayurvedic Therapy">
              Ayurvedic Therapy
            </option>
            <option value="Consultation">
              Consultation
            </option>
            <option value="Yoga & Meditation">
              Yoga & Meditation
            </option>
          </select>
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-purana-brown outline-none focus:border-purana-green"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}