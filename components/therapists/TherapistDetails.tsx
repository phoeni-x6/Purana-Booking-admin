"use client";

import {
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import type { Therapist } from "./TherapistTable";

type TherapistDetailsProps = {
  therapist: Therapist;
  onClose: () => void;
};

export default function TherapistDetails({
  therapist,
  onClose,
}: TherapistDetailsProps) {
  const initials = therapist.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-purana-green">
              Therapist
            </p>

            <h2 className="mt-1 text-xl font-semibold text-purana-brown">
              {therapist.name}
            </h2>

            <p className="mt-1 text-xs text-purana-brown/45">
              {therapist.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-purana-soft hover:text-purana-brown"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Profile */}
          <div className="flex items-center gap-4 rounded-2xl bg-purana-soft p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purana-green text-lg font-semibold text-white">
              {initials}
            </div>

            <div>
              <h3 className="font-semibold text-purana-brown">
                {therapist.name}
              </h3>

              <p className="mt-1 text-sm text-purana-brown/60">
                {therapist.specialization}
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
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
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Contact Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                <Mail
                  size={18}
                  className="text-purana-green"
                />

                <div>
                  <p className="text-xs text-purana-brown/45">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-purana-brown">
                    {therapist.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                <Phone
                  size={18}
                  className="text-purana-green"
                />

                <div>
                  <p className="text-xs text-purana-brown/45">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-purana-brown">
                    {therapist.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Professional Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 p-4">
                <UserRound
                  size={18}
                  className="text-purana-green"
                />

                <p className="mt-3 text-xs text-purana-brown/45">
                  Experience
                </p>

                <p className="mt-1 font-semibold text-purana-brown">
                  {therapist.experience}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <CalendarDays
                  size={18}
                  className="text-purana-green"
                />

                <p className="mt-3 text-xs text-purana-brown/45">
                  Total Bookings
                </p>

                <p className="mt-1 font-semibold text-purana-brown">
                  {therapist.bookings}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <Clock3
                  size={18}
                  className="text-purana-green"
                />

                <p className="mt-3 text-xs text-purana-brown/45">
                  Working Hours
                </p>

                <p className="mt-1 font-semibold text-purana-brown">
                  {therapist.workingHours}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <UserRound
                  size={18}
                  className="text-purana-green"
                />

                <p className="mt-3 text-xs text-purana-brown/45">
                  Treatments
                </p>

                <p className="mt-1 font-semibold text-purana-brown">
                  {therapist.treatments}
                </p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Availability
            </h3>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-purana-brown/45">
                Current availability
              </p>

              <p className="mt-1 text-sm font-medium text-purana-brown">
                {therapist.availability}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Notes
            </h3>

            <div className="rounded-xl bg-purana-soft p-4">
              <p className="text-sm leading-6 text-purana-brown/65">
                {therapist.notes}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              className="flex-1 rounded-xl border border-purana-green px-4 py-3 text-sm font-medium text-purana-green transition hover:bg-purana-green/5"
            >
              Edit Therapist
            </button>

            <button
              type="button"
              className="flex-1 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"
            >
              Manage Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}