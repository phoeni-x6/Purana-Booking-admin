"use client";

import { useMemo, useState } from "react";
import BookingDetails, {
  type Booking,
} from "@/components/bookings/BookingDetails";


import NewBooking from "@/components/bookings/NewBooking";

const bookings: Booking[] = [
  {
    id: "BK-1024",
    guest: "Anna Müller",
    email: "anna.mueller@email.com",
    phone: "+49 170 1234567",
    treatment: "Ayurvedic Full Body Massage",
    therapist: "Sanduni",
    date: "03 Oct 2026",
    time: "10:00",
    duration: "60 min",
    amount: "€85",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    location: "Purana Ayurveda, Steinberg am See",
    notes: "Guest prefers a quiet treatment room.",
    questionnaire: "Completed",
  },
  {
    id: "BK-1023",
    guest: "Thomas Weber",
    email: "thomas.weber@email.com",
    phone: "+49 171 9876543",
    treatment: "Ayurvedic Consultation",
    therapist: "Priya",
    date: "03 Oct 2026",
    time: "11:30",
    duration: "45 min",
    amount: "€60",
    status: "Pending",
    payment: "Pending",
    source: "Website",
    location: "Purana Ayurveda, Steinberg am See",
    notes: "First-time guest.",
    questionnaire: "Pending",
  },
  {
    id: "BK-1022",
    guest: "Sophie Keller",
    email: "sophie.keller@email.com",
    phone: "+49 172 5551234",
    treatment: "Shirodhara",
    therapist: "Sanduni",
    date: "03 Oct 2026",
    time: "14:00",
    duration: "60 min",
    amount: "€95",
    status: "Confirmed",
    payment: "Paid",
    source: "Admin",
    location: "Purana Ayurveda, Steinberg am See",
    notes: "Returning guest.",
    questionnaire: "Completed",
  },
  {
    id: "BK-1021",
    guest: "Michael Braun",
    email: "michael.braun@email.com",
    phone: "+49 173 3332211",
    treatment: "Abhyanga Massage",
    therapist: "Priya",
    date: "04 Oct 2026",
    time: "09:30",
    duration: "60 min",
    amount: "€80",
    status: "Completed",
    payment: "Paid",
    source: "Website",
    location: "Purana Ayurveda, Steinberg am See",
    notes: "Regular guest.",
    questionnaire: "Completed",
  },
  {
    id: "BK-1020",
    guest: "Julia Fischer",
    email: "julia.fischer@email.com",
    phone: "+49 174 4445566",
    treatment: "Ayurveda Consultation",
    therapist: "Anjali",
    date: "04 Oct 2026",
    time: "15:00",
    duration: "45 min",
    amount: "€60",
    status: "Cancelled",
    payment: "Refunded",
    source: "Phone",
    location: "Purana Ayurveda, Steinberg am See",
    notes: "Cancelled by guest.",
    questionnaire: "Not completed",
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Completed":
      return "bg-blue-100 text-blue-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getPaymentStyle(payment: string) {
  switch (payment) {
    case "Paid":
      return "text-green-700";

    case "Pending":
      return "text-yellow-700";

    case "Refunded":
      return "text-red-600";

    default:
      return "text-gray-500";
  }
}

export default function BookingsPage() {
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guest.toLowerCase().includes(search.toLowerCase()) ||
        booking.email.toLowerCase().includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase()) ||
        booking.treatment.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">
            Bookings
          </h1>

          <p className="mt-1 text-sm text-purana-brown/60">
            Manage appointments, reservations and guest bookings.
          </p>
        </div>

        <button
  type="button"
  onClick={() => setIsNewBookingOpen(true)}
  className="rounded-xl bg-purana-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purana-green/90"
>
  + New Booking
</button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-purana-brown/60">
            Total Bookings
          </p>

          <p className="mt-2 text-2xl font-semibold text-purana-green">
            {totalBookings}
          </p>
        </div>

        <div className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-purana-brown/60">
            Confirmed
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-700">
            {confirmedBookings}
          </p>
        </div>

        <div className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-purana-brown/60">
            Pending
          </p>

          <p className="mt-2 text-2xl font-semibold text-yellow-700">
            {pendingBookings}
          </p>
        </div>

        <div className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-purana-brown/60">
            Completed
          </p>

          <p className="mt-2 text-2xl font-semibold text-blue-700">
            {completedBookings}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-purana-brown/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search guest, booking ID or treatment..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-purana-brown/10 bg-purana-soft px-4 py-2.5 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/40 focus:border-purana-green/40 focus:bg-white focus:ring-2 focus:ring-purana-green/10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                    statusFilter === status
                      ? "bg-purana-green text-white"
                      : "bg-purana-soft text-purana-brown/70 hover:bg-purana-green/10 hover:text-purana-green"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Booking Table */}
      <div className="overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-purana-brown/10 bg-purana-soft">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Booking
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Guest
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Treatment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Therapist
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-purana-brown/5 transition hover:bg-purana-soft/50"
                >
                  {/* Booking */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-purana-green">
                        {booking.id}
                      </p>

                      <p className="mt-1 text-xs text-purana-brown/50">
                        {booking.source}
                      </p>
                    </div>
                  </td>

                  {/* Guest */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-purana-brown">
                        {booking.guest}
                      </p>

                      <p className="mt-1 text-xs text-purana-brown/50">
                        {booking.email}
                      </p>
                    </div>
                  </td>

                  {/* Treatment */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-purana-brown">
                      {booking.treatment}
                    </p>

                    <p className="mt-1 text-xs text-purana-brown/50">
                      {booking.duration}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-purana-brown">
                      {booking.date}
                    </p>

                    <p className="mt-1 text-xs text-purana-brown/50">
                      {booking.time}
                    </p>
                  </td>

                  {/* Therapist */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-purana-brown">
                      {booking.therapist}
                    </p>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-purana-brown">
                      {booking.amount}
                    </p>

                    <p
                      className={`mt-1 text-xs font-medium ${getPaymentStyle(
                        booking.payment
                      )}`}
                    >
                      {booking.payment}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-lg border border-purana-brown/10 px-3 py-2 text-xs font-semibold text-purana-brown transition hover:border-purana-green/20 hover:bg-purana-green/5 hover:text-purana-green"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-purana-brown/10 lg:hidden">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-purana-green">
                    {booking.id}
                  </p>

                  <p className="mt-1 text-xs text-purana-brown/50">
                    {booking.source}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-purana-brown">
                    {booking.guest}
                  </p>

                  <p className="mt-1 text-xs text-purana-brown/50">
                    {booking.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                      Treatment
                    </p>

                    <p className="mt-1 text-sm text-purana-brown">
                      {booking.treatment}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                      Therapist
                    </p>

                    <p className="mt-1 text-sm text-purana-brown">
                      {booking.therapist}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                      Date
                    </p>

                    <p className="mt-1 text-sm text-purana-brown">
                      {booking.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                      Time
                    </p>

                    <p className="mt-1 text-sm text-purana-brown">
                      {booking.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-semibold text-purana-brown">
                      {booking.amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                      Payment
                    </p>

                    <p
                      className={`mt-1 text-sm font-medium ${getPaymentStyle(
                        booking.payment
                      )}`}
                    >
                      {booking.payment}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(booking)}
                className="mt-5 w-full rounded-xl border border-purana-brown/10 px-4 py-2.5 text-sm font-semibold text-purana-brown transition hover:border-purana-green/20 hover:bg-purana-green/5 hover:text-purana-green"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purana-soft">
              <span className="text-xl">⌕</span>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-purana-brown">
              No bookings found
            </h3>

            <p className="mt-1 text-sm text-purana-brown/50">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredBookings.length > 0 && (
        <div className="mt-4 text-xs text-purana-brown/50">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>
      )}

      {/* Booking Details Drawer */}
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {isNewBookingOpen && (
  <NewBooking onClose={() => setIsNewBookingOpen(false)} />
)}
    </div>
  );
}