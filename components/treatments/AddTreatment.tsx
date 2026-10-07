"use client";

import { X } from "lucide-react";

type AddTreatmentProps = {
  onClose: () => void;
};

export default function AddTreatment({
  onClose,
}: AddTreatmentProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-purana-brown">
              Add Treatment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new Ayurveda treatment
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
          {/* Basic Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Treatment Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Ayurvedic Full Body Massage"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green">
                    <option value="">Select category</option>
                    <option>Massage</option>
                    <option>Therapy</option>
                    <option>Consultation</option>
                    <option>Shirodhara</option>
                    <option>Yoga</option>
                    <option>Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration
                  </label>

                  <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green">
                    <option value="">Select duration</option>
                    <option>30 min</option>
                    <option>45 min</option>
                    <option>60 min</option>
                    <option>75 min</option>
                    <option>90 min</option>
                    <option>120 min</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Pricing
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    €
                  </span>

                  <input
                    type="number"
                    placeholder="85"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-purana-green"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Description
            </h3>

            <textarea
              rows={5}
              placeholder="Describe the treatment, benefits and what the guest can expect..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10"
            />
          </div>

          {/* Availability */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purana-brown">
              Availability
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Availability
                </label>

                <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green">
                  <option>Available for booking</option>
                  <option>Temporarily unavailable</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes
                </label>

                <textarea
                  rows={3}
                  placeholder="Internal notes..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
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
              Add Treatment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}