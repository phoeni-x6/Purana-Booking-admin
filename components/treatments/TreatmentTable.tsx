"use client";

import {
  Clock3,
  Eye,
  MoreHorizontal,
} from "lucide-react";

export type Treatment = {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  status: "Active" | "Inactive";
  availability: string;
  therapists: number;
  bookings: number;
};

type TreatmentTableProps = {
  treatments: Treatment[];
  onViewDetails: (treatment: Treatment) => void;
};

export default function TreatmentTable({
  treatments,
  onViewDetails,
}: TreatmentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-purana-soft/50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Treatment
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Duration
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Price
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/50">
                Therapists
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
            {treatments.map((treatment) => (
              <tr
                key={treatment.id}
                className="border-b border-gray-100 last:border-0 hover:bg-purana-soft/30"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-purana-brown">
                      {treatment.name}
                    </p>

                    <p className="mt-1 text-xs text-purana-brown/45">
                      {treatment.id}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-purana-cream px-3 py-1 text-xs font-medium text-purana-brown">
                    {treatment.category}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-purana-brown/70">
                    <Clock3 size={15} />
                    {treatment.duration}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold text-purana-green">
                    {treatment.price}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-purana-brown/70">
                  {treatment.therapists}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      treatment.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {treatment.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(treatment)}
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

      {/* Mobile Cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-purana-brown">
                  {treatment.name}
                </h3>

                <p className="mt-1 text-xs text-purana-brown/45">
                  {treatment.id}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  treatment.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {treatment.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-purana-brown/45">
                  Category
                </p>
                <p className="mt-1 font-medium text-purana-brown">
                  {treatment.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-purana-brown/45">
                  Duration
                </p>
                <p className="mt-1 font-medium text-purana-brown">
                  {treatment.duration}
                </p>
              </div>

              <div>
                <p className="text-xs text-purana-brown/45">
                  Price
                </p>
                <p className="mt-1 font-semibold text-purana-green">
                  {treatment.price}
                </p>
              </div>

              <div>
                <p className="text-xs text-purana-brown/45">
                  Therapists
                </p>
                <p className="mt-1 font-medium text-purana-brown">
                  {treatment.therapists}
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewDetails(treatment)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-purana-green/20 py-2.5 text-sm font-medium text-purana-green transition hover:bg-purana-green/5"
            >
              <Eye size={16} />
              View Details
            </button>
          </div>
        ))}

        {treatments.length === 0 && (
          <div className="p-8 text-center text-sm text-purana-brown/50">
            No treatments found.
          </div>
        )}
      </div>
    </div>
  );
}