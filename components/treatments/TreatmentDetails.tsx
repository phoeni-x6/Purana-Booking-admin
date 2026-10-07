"use client";

import {
  CalendarDays,
  Clock3,
  Euro,
  Users,
  X,
} from "lucide-react";

import type { Treatment } from "./TreatmentTable";

type TreatmentDetailsProps = {
  treatment: Treatment;
  onClose: () => void;
};

export default function TreatmentDetails({
  treatment,
  onClose,
}: TreatmentDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-purana-green">
              Treatment
            </p>

            <h2 className="mt-1 text-xl font-semibold text-purana-brown">
              {treatment.name}
            </h2>

            <p className="mt-1 text-xs text-purana-brown/45">
              {treatment.id}
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
          {/* Status */}
          <div className="flex items-center justify-between rounded-2xl bg-purana-soft p-4">
            <div>
              <p className="text-xs text-purana-brown/50">
                Current Status
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  treatment.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {treatment.status}
              </span>
            </div>

            <span className="rounded-full bg-purana-cream px-3 py-1 text-xs font-medium text-purana-brown">
              {treatment.category}
            </span>
          </div>

          {/* Overview */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Overview
            </h3>

            <p className="text-sm leading-6 text-purana-brown/65">
              {treatment.description}
            </p>
          </div>

          {/* Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <Clock3
                size={18}
                className="text-purana-green"
              />
              <p className="mt-3 text-xs text-purana-brown/45">
                Duration
              </p>
              <p className="mt-1 font-semibold text-purana-brown">
                {treatment.duration}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <Euro
                size={18}
                className="text-purana-green"
              />
              <p className="mt-3 text-xs text-purana-brown/45">
                Price
              </p>
              <p className="mt-1 font-semibold text-purana-brown">
                {treatment.price}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <Users
                size={18}
                className="text-purana-green"
              />
              <p className="mt-3 text-xs text-purana-brown/45">
                Therapists
              </p>
              <p className="mt-1 font-semibold text-purana-brown">
                {treatment.therapists}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <CalendarDays
                size={18}
                className="text-purana-green"
              />
              <p className="mt-3 text-xs text-purana-brown/45">
                Bookings
              </p>
              <p className="mt-1 font-semibold text-purana-brown">
                {treatment.bookings}
              </p>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Availability
            </h3>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-purana-brown/70">
                {treatment.availability}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              className="flex-1 rounded-xl border border-purana-green px-4 py-3 text-sm font-medium text-purana-green transition hover:bg-purana-green/5"
            >
              Edit Treatment
            </button>

            <button
              type="button"
              className="flex-1 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"
            >
              Manage Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}