"use client";

import { X } from "lucide-react";

type AddTherapistProps = {
  onClose: () => void;
};

export default function AddTherapist({
  onClose,
}: AddTherapistProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-purana-brown">
              Add Therapist
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new therapist profile
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
          {/* Personal Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  placeholder="Sanduni"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Perera"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="therapist@purana-ayurveda.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+49 170 1234567"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Professional Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Specialization
                </label>

                <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green">
                  <option value="">
                    Select specialization
                  </option>
                  <option>Ayurvedic Massage</option>
                  <option>Ayurvedic Therapy</option>
                  <option>Consultation</option>
                  <option>Yoga & Meditation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Experience
                  </label>

                  <input
                    type="text"
                    placeholder="5 years"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Assigned Treatments
                </label>

                <select
                  multiple
                  className="h-32 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green"
                >
                  <option>Ayurvedic Full Body Massage</option>
                  <option>Abhyanga Massage</option>
                  <option>Shirodhara</option>
                  <option>Ayurveda Consultation</option>
                  <option>Pinda Sweda</option>
                  <option>Head & Shoulder Massage</option>
                  <option>Foot Reflexology</option>
                </select>

                <p className="mt-1 text-xs text-gray-400">
                  Hold Ctrl/Cmd to select multiple treatments.
                </p>
              </div>
            </div>
          </div>

          {/* Working Schedule */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Working Schedule
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Time
                </label>

                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Time
                </label>

                <input
                  type="time"
                  defaultValue="17:00"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Working Days
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-purana-brown"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={day !== "Sunday"}
                      className="accent-purana-green"
                    />
                    {day.slice(0, 3)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Notes
            </h3>

            <textarea
              rows={4}
              placeholder="Internal notes about the therapist..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded-xl bg-purana-green px-5 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"
            >
              Add Therapist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}