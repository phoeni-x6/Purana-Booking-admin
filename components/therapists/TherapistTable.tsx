"use client";

import {
  CalendarCheck,
  Clock3,
  Eye,
  MoreHorizontal,
} from "lucide-react";

export type Therapist = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  status: "Active" | "On Leave" | "Inactive";
  availability: string;
  workingHours: string;
  bookings: number;
  treatments: number;
  joined: string;
  notes: string;
};

type TherapistTableProps = {
  therapists: Therapist[];
  onViewDetails: (therapist: Therapist) => void;
};

export default function TherapistTable({
  therapists,
  onViewDetails,
}: TherapistTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100 bg-purana-soft/50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Therapist
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Specialization
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Experience
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Working Hours
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Bookings
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {therapists.map((therapist) => (
              <tr
                key={therapist.id}
                className="border-b border-gray-100 last:border-0 hover:bg-purana-soft/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purana-green text-sm font-semibold text-white">
                      {therapist.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="font-medium text-purana-brown">
                        {therapist.name}
                      </p>

                      <p className="mt-1 text-xs text-purana-brown/45">
                        {therapist.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-purana-cream px-3 py-1 text-xs font-medium text-purana-brown">
                    {therapist.specialization}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-purana-brown/70">
                  {therapist.experience}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-purana-brown/70">
                    <Clock3 size={15} />
                    {therapist.workingHours}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-purana-brown/70">
                    <CalendarCheck size={15} />
                    {therapist.bookings}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      therapist.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : therapist.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {therapist.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(therapist)}
                      className="rounded-lg p-2 text-purana-brown/50 transition hover:bg-purana-cream hover:text-purana-green"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="rounded-lg p-2 text-purana-brown/50 transition hover:bg-purana-cream hover:text-purana-green"
                      title="More"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-gray-100 md:hidden">
        {therapists.map((therapist) => (
          <div key={therapist.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purana-green text-sm font-semibold text-white">
                  {therapist.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <h3 className="font-semibold text-purana-brown">
                    {therapist.name}
                  </h3>

                  <p className="mt-1 text-xs text-purana-brown/45">
                    {therapist.specialization}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  therapist.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : therapist.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {therapist.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-purana-brown/45">
                  Experience
                </p>
                <p className="mt-1 text-sm font-medium text-purana-brown">
                  {therapist.experience}
                </p>
              </div>

              <div>
                <p className="text-xs text-purana-brown/45">
                  Working Hours
                </p>
                <p className="mt-1 text-sm font-medium text-purana-brown">
                  {therapist.workingHours}
                </p>
              </div>

              <div>
                <p className="text-xs text-purana-brown/45">
                  Bookings
                </p>
                <p className="mt-1 text-sm font-medium text-purana-brown">
                  {therapist.bookings}
                </p>
              </div>

              <div>
                <p className="text-xs text-purana-brown/45">
                  Availability
                </p>
                <p className="mt-1 text-sm font-medium text-purana-brown">
                  {therapist.availability}
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewDetails(therapist)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-purana-green/20 py-2.5 text-sm font-medium text-purana-green transition hover:bg-purana-green/5"
            >
              <Eye size={16} />
              View Details
            </button>
          </div>
        ))}

        {therapists.length === 0 && (
          <div className="p-8 text-center text-sm text-purana-brown/50">
            No therapists found.
          </div>
        )}
      </div>
    </div>
  );
}