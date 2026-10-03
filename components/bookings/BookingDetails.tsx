"use client";

import {
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

export type Booking = {
  id: string;
  guest: string;
  email: string;
  phone: string;
  treatment: string;
  therapist: string;
  date: string;
  time: string;
  duration: string;
  amount: string;
  status: string;
  payment: string;
  source: string;
  location: string;
  notes: string;
  questionnaire: string;
};

type BookingDetailsProps = {
  booking: Booking;
  onClose: () => void;
};

function getStatusStyle(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-green-50 text-purana-green";

    case "Pending":
      return "bg-yellow-50 text-yellow-700";

    case "Completed":
      return "bg-blue-50 text-blue-700";

    case "Cancelled":
      return "bg-red-50 text-purana-red";

    default:
      return "bg-gray-50 text-gray-600";
  }
}

function getPaymentStyle(payment: string) {
  switch (payment) {
    case "Paid":
      return "text-purana-green";

    case "Pending":
      return "text-yellow-700";

    case "Refunded":
      return "text-purana-red";

    default:
      return "text-purana-brown/50";
  }
}

export default function BookingDetails({
  booking,
  onClose,
}: BookingDetailsProps) {
  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close booking details"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[460px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purana-brown/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purana-brown/40">
              Booking
            </p>

            <h2 className="mt-1 font-serif text-xl font-semibold text-purana-green">
              #{booking.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-purana-brown/50 transition hover:bg-purana-soft hover:text-purana-brown"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                booking.status,
              )}`}
            >
              {booking.status}
            </span>

            <span className="text-sm text-purana-brown/50">
              {booking.source}
            </span>
          </div>

          {/* Guest Information */}
          <section className="mt-7">
            <div className="mb-3 flex items-center gap-2">
              <UserRound size={17} className="text-purana-green" />

              <h3 className="text-sm font-semibold text-purana-brown">
                Guest Information
              </h3>
            </div>

            <div className="rounded-xl bg-purana-soft p-4">
              <p className="font-semibold text-purana-brown">
                {booking.guest}
              </p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-purana-brown/60">
                  <Mail size={15} />
                  {booking.email}
                </div>

                <div className="flex items-center gap-2 text-sm text-purana-brown/60">
                  <Phone size={15} />
                  {booking.phone}
                </div>
              </div>
            </div>
          </section>

          {/* Appointment */}
          <section className="mt-7">
            <h3 className="mb-3 text-sm font-semibold text-purana-brown">
              Appointment
            </h3>

            <div className="divide-y divide-purana-brown/10 rounded-xl border border-purana-brown/10">
              <div className="flex justify-between gap-4 p-4">
                <span className="text-sm text-purana-brown/50">
                  Treatment
                </span>

                <span className="text-right text-sm font-medium text-purana-brown">
                  {booking.treatment}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4">
                <span className="text-sm text-purana-brown/50">
                  Therapist
                </span>

                <span className="text-sm font-medium text-purana-brown">
                  {booking.therapist}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4">
                <span className="text-sm text-purana-brown/50">
                  Date
                </span>

                <span className="text-sm font-medium text-purana-brown">
                  {booking.date}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4">
                <span className="text-sm text-purana-brown/50">
                  Time
                </span>

                <span className="text-sm font-medium text-purana-brown">
                  {booking.time} · {booking.duration}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4">
                <span className="text-sm text-purana-brown/50">
                  Location
                </span>

                <span className="flex max-w-[220px] items-start gap-1 text-right text-sm font-medium text-purana-brown">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-purana-green"
                  />
                  {booking.location}
                </span>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-7">
            <h3 className="mb-3 text-sm font-semibold text-purana-brown">
              Payment
            </h3>

            <div className="flex items-center justify-between rounded-xl bg-purana-soft p-4">
              <div>
                <p className="text-xs text-purana-brown/50">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-semibold text-purana-brown">
                  {booking.amount}
                </p>
              </div>

              <span
                className={`text-sm font-semibold ${getPaymentStyle(
                  booking.payment,
                )}`}
              >
                {booking.payment}
              </span>
            </div>
          </section>

          {/* Questionnaire */}
          <section className="mt-7">
            <h3 className="mb-3 text-sm font-semibold text-purana-brown">
              Health Questionnaire
            </h3>

            <div className="flex items-center justify-between rounded-xl border border-purana-brown/10 p-4">
              <span className="text-sm text-purana-brown/60">
                Questionnaire
              </span>

              <span
                className={
                  booking.questionnaire === "Completed"
                    ? "text-sm font-semibold text-purana-green"
                    : "text-sm font-semibold text-yellow-700"
                }
              >
                {booking.questionnaire}
              </span>
            </div>
          </section>

          {/* Notes */}
          <section className="mt-7">
            <h3 className="mb-3 text-sm font-semibold text-purana-brown">
              Notes
            </h3>

            <div className="rounded-xl bg-purana-soft p-4 text-sm leading-6 text-purana-brown/65">
              {booking.notes}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-purana-brown/10 bg-white p-5">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl border border-purana-brown/15 px-4 py-2.5 text-sm font-semibold text-purana-brown transition hover:bg-purana-soft"
            >
              Edit Booking
            </button>

            <button
              type="button"
              className="flex-1 rounded-xl bg-purana-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purana-green/90"
            >
              Manage
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}