"use client";

import { useState } from "react";
import { X, User, Sparkles, CalendarDays, CreditCard } from "lucide-react";

type NewBookingProps = {
  onClose: () => void;
};

export default function NewBooking({ onClose }: NewBookingProps) {
  const [guestType, setGuestType] = useState("External Guest");

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close new booking"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-purana-brown/30 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purana-brown/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purana-green/60">
              Bookings
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-purana-green">
              New Booking
            </h2>

            <p className="mt-1 text-sm text-purana-brown/50">
              Create a new appointment for a guest.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-purana-brown/50 transition hover:bg-purana-soft hover:text-purana-brown"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Guest Section */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purana-green/10 text-purana-green">
                  <User size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-purana-brown">
                    Guest Information
                  </h3>

                  <p className="text-xs text-purana-brown/50">
                    Select or create the guest for this booking.
                  </p>
                </div>
              </div>

              {/* Guest Type */}
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-purana-soft p-1">
                <button
                  type="button"
                  onClick={() => setGuestType("Chalet Guest")}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    guestType === "Chalet Guest"
                      ? "bg-white text-purana-green shadow-sm"
                      : "text-purana-brown/50 hover:text-purana-brown"
                  }`}
                >
                  Chalet Guest
                </button>

                <button
                  type="button"
                  onClick={() => setGuestType("External Guest")}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    guestType === "External Guest"
                      ? "bg-white text-purana-green shadow-sm"
                      : "text-purana-brown/50 hover:text-purana-brown"
                  }`}
                >
                  External Guest
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Guest
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option value="">Select guest</option>
                    <option>Anna Müller</option>
                    <option>Thomas Weber</option>
                    <option>Sophie Keller</option>
                    <option>Michael Braun</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                      First Name
                    </label>

                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/30 focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                      Last Name
                    </label>

                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/30 focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="guest@email.com"
                      className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/30 focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                      Phone
                    </label>

                    <input
                      type="tel"
                      placeholder="+49 ..."
                      className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/30 focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Treatment Section */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purana-green/10 text-purana-green">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-purana-brown">
                    Treatment
                  </h3>

                  <p className="text-xs text-purana-brown/50">
                    Select the treatment or package.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Booking Type
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option>Treatment</option>
                    <option>Package</option>
                    <option>Consultation</option>
                    <option>Treatment Pack</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Treatment
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option value="">Select treatment</option>
                    <option>Ayurvedic Full Body Massage</option>
                    <option>Abhyanga Massage</option>
                    <option>Shirodhara</option>
                    <option>Ayurvedic Consultation</option>
                    <option>Yoga</option>
                    <option>Meditation & Breathwork</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Appointment Section */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purana-green/10 text-purana-green">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-purana-brown">
                    Appointment
                  </h3>

                  <p className="text-xs text-purana-brown/50">
                    Choose therapist, date and available time.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Therapist
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option value="">Select therapist</option>
                    <option>Sanduni</option>
                    <option>Priya</option>
                    <option>Anjali</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Location
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option>Purana Ayurveda, Steinberg am See</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Date
                  </label>

                  <input
                    type="date"
                    className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Time
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option value="">Select time</option>
                    <option>09:00</option>
                    <option>09:30</option>
                    <option>10:00</option>
                    <option>10:30</option>
                    <option>11:00</option>
                    <option>11:30</option>
                    <option>12:00</option>
                    <option>14:00</option>
                    <option>14:30</option>
                    <option>15:00</option>
                    <option>15:30</option>
                    <option>16:00</option>
                    <option>16:30</option>
                    <option>17:00</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purana-green/10 text-purana-green">
                  <CreditCard size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-purana-brown">
                    Payment
                  </h3>

                  <p className="text-xs text-purana-brown/50">
                    Set the booking amount and payment status.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-purana-brown/50">
                      €
                    </span>

                    <input
                      type="number"
                      placeholder="85"
                      className="w-full rounded-xl border border-purana-brown/10 bg-white py-3 pl-9 pr-4 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/30 focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                    Payment Status
                  </label>

                  <select className="w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Partially Paid</option>
                    <option>Refunded</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <label className="mb-1.5 block text-xs font-semibold text-purana-brown">
                Notes
              </label>

              <textarea
                rows={4}
                placeholder="Add any notes about this booking..."
                className="w-full resize-none rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/30 focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10"
              />
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-purana-brown/10 bg-white px-6 py-4">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-purana-brown/10 px-5 py-2.5 text-sm font-semibold text-purana-brown transition hover:bg-purana-soft"
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded-xl bg-purana-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purana-green/90"
            >
              Create Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}