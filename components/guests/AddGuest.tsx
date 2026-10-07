"use client";

import { X } from "lucide-react";

type AddGuestProps = {
  onClose: () => void;
};

export default function AddGuest({ onClose }: AddGuestProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-purana-brown">
              Add Guest
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new guest profile
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-purana-soft hover:text-purana-brown"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6 p-6">
          {/* Guest Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-purana-brown">
              Guest Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-xl border-2 border-purana-green bg-purana-green/5 px-4 py-3 text-left"
              >
                <p className="text-sm font-semibold text-purana-green">
                  Chalet Guest
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Guest staying at a Purana chalet
                </p>
              </button>

              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-purana-green"
              >
                <p className="text-sm font-semibold text-purana-brown">
                  External Guest
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Guest visiting for treatments only
                </p>
              </button>
            </div>
          </div>

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
                  placeholder="Anna"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Müller"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="anna@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+49 170 1234567"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>
            </div>
          </div>

          {/* Chalet Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Chalet Information
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Chalet
              </label>

              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10">
                <option value="">Select chalet</option>
                <option>Chalet See</option>
                <option>Chalet Relax</option>
                <option>Chalet Strand</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Additional Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Country
                </label>

                <input
                  type="text"
                  placeholder="Germany"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes
                </label>

                <textarea
                  rows={4}
                  placeholder="Add any notes about this guest..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
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
              Add Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}