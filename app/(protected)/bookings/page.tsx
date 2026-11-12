
"use client";

import { useEffect, useMemo, useState } from "react";
import BookingDetails, { type Booking } from "@/components/bookings/BookingDetails";
import NewBooking from "@/components/bookings/NewBooking";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 50;
const STATUSES = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

type BookingRecord = {
  id: string;
  guest_id: string;
  status: string;
  start_at: string;
  end_at: string;
  guest_notes: string | null;
  internal_notes: string | null;
  payment_method: string | null;
  therapist_id: string | null;
  booking_items: {
    service_name: string;
    duration_minutes: number;
    unit_price: number | string;
    currency: string;
  }[];
};

type GuestRecord = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
};

type TherapistRecord = {
  id: string;
  first_name: string;
  last_name: string;
};

function toBooking(
    record: BookingRecord,
    guest?: GuestRecord,
    therapist?: TherapistRecord
): Booking {
  const start = new Date(record.start_at);

  const minutes = record.booking_items.reduce(
      (sum, item) => sum + item.duration_minutes,
      0
  );

  const amounts = new Map<string, number>();

  for (const item of record.booking_items) {
    amounts.set(
        item.currency,
        (amounts.get(item.currency) ?? 0) + Number(item.unit_price)
    );
  }

  return {
    // Full UUID for database operations
    id: record.id,

    // Short ID for dashboard display
    displayId: record.id.slice(0, 8).toUpperCase(),

    guest: guest
        ? `${guest.first_name} ${guest.last_name}`
        : "Guest",
    email: guest?.email ?? "—",
    phone: guest?.phone ?? "—",
    treatment:
        record.booking_items.map((item) => item.service_name).join(", ") ||
        "—",
    therapist: therapist
        ? `${therapist.first_name} ${therapist.last_name}`
        : "Unassigned",
    date: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
    }).format(start),
    time: new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(start),
    duration: minutes ? `${minutes} min` : "—",
    amount: amounts.size
        ? [...amounts]
            .map(([currency, value]) =>
                new Intl.NumberFormat("en-IE", {
                  style: "currency",
                  currency,
                }).format(value)
            )
            .join(" + ")
        : "—",
    status:
        record.status.charAt(0).toUpperCase() + record.status.slice(1),
    payment: record.payment_method ?? "Not recorded",
    source: "—",
    location: "—",
    notes: record.guest_notes ?? record.internal_notes ?? "—",
    questionnaire: "—",
  };
}

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function BookingsPage() {
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [guestFilterId, setGuestFilterId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);

  const [counts, setCounts] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] =
      useState<Booking | null>(null);

  const [confirmingBookingId, setConfirmingBookingId] =
      useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const initialGuestId = new URLSearchParams(
        window.location.search
    ).get("guest_id");

    if (initialGuestId) {
      setGuestFilterId(initialGuestId);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      setLoading(true);
      setError(null);

      const start = page * PAGE_SIZE;

      let pageQuery = supabase
          .from("bookings")
          .select(
              "id, guest_id, status, start_at, end_at, guest_notes, internal_notes, payment_method, therapist_id, booking_items(service_name, duration_minutes, unit_price, currency)",
              { count: "exact" }
          )
          .order("start_at", { ascending: false })
          .range(start, start + PAGE_SIZE - 1);

      if (statusFilter !== "All") {
        pageQuery = pageQuery.eq(
            "status",
            statusFilter.toLowerCase()
        );
      }

      if (guestFilterId) {
        pageQuery = pageQuery.eq("guest_id", guestFilterId);
      }

      let filteredCountQuery = supabase
          .from("bookings")
          .select("id", { count: "exact", head: true });

      if (statusFilter !== "All") {
        filteredCountQuery = filteredCountQuery.eq(
            "status",
            statusFilter.toLowerCase()
        );
      }

      if (guestFilterId) {
        filteredCountQuery = filteredCountQuery.eq(
            "guest_id",
            guestFilterId
        );
      }

      const [
        pageResult,
        totalResult,
        confirmedResult,
        pendingResult,
        completedResult,
        filteredCountResult,
      ] = await Promise.all([
        pageQuery,

        supabase
            .from("bookings")
            .select("id", { count: "exact", head: true }),

        supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .eq("status", "confirmed"),

        supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),

        supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .eq("status", "completed"),

        filteredCountQuery,
      ]);

      const queryError =
          pageResult.error ??
          totalResult.error ??
          confirmedResult.error ??
          pendingResult.error ??
          completedResult.error ??
          filteredCountResult.error;

      if (queryError) {
        if (!cancelled) {
          setError(queryError.message);
          setBookings([]);
          setTotal(0);
          setLoading(false);
        }
        return;
      }

      const rows = (pageResult.data ?? []) as unknown as BookingRecord[];

      const guestIds = [
        ...new Set(rows.map((booking) => booking.guest_id)),
      ];

      const therapistIds = [
        ...new Set(
            rows
                .map((booking) => booking.therapist_id)
                .filter((id): id is string => Boolean(id))
        ),
      ];

      const [guestsResult, therapistsResult] = await Promise.all([
        guestIds.length
            ? supabase
                .from("guests")
                .select("id, first_name, last_name, email, phone")
                .in("id", guestIds)
            : Promise.resolve({ data: [], error: null }),

        therapistIds.length
            ? supabase
                .from("therapists")
                .select("id, first_name, last_name")
                .in("id", therapistIds)
            : Promise.resolve({ data: [], error: null }),
      ]);

      const relatedError =
          guestsResult.error ?? therapistsResult.error;

      if (relatedError) {
        if (!cancelled) {
          setError(relatedError.message);
          setBookings([]);
          setLoading(false);
        }
        return;
      }

      const guestMap = new Map(
          ((guestsResult.data ?? []) as GuestRecord[]).map(
              (guest) => [guest.id, guest]
          )
      );

      const therapistMap = new Map(
          ((therapistsResult.data ?? []) as TherapistRecord[]).map(
              (therapist) => [therapist.id, therapist]
          )
      );

      if (!cancelled) {
        setBookings(
            rows.map((booking) =>
                toBooking(
                    booking,
                    guestMap.get(booking.guest_id),
                    booking.therapist_id
                        ? therapistMap.get(booking.therapist_id)
                        : undefined
                )
            )
        );

        setTotal(filteredCountResult.count ?? 0);

        setCounts({
          total: totalResult.count ?? 0,
          confirmed: confirmedResult.count ?? 0,
          pending: pendingResult.count ?? 0,
          completed: completedResult.count ?? 0,
        });

        setLoading(false);
      }
    }

    void loadBookings();

    return () => {
      cancelled = true;
    };
  }, [page, statusFilter, guestFilterId, supabase, reloadKey]);

  // Confirm booking using the full UUID
  async function confirmBooking(bookingId: string) {
    if (confirmingBookingId) return;

    const confirmed = window.confirm(
        "Are you sure you want to confirm this booking?"
    );

    if (!confirmed) return;

    setConfirmingBookingId(bookingId);

    const { data, error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId)
        .eq("status", "pending")
        .select("id")
        .maybeSingle();

    if (error) {
      window.alert(`Unable to confirm booking: ${error.message}`);
      setConfirmingBookingId(null);
      return;
    }

    if (!data) {
      window.alert(
          "This booking is no longer pending. Please refresh the page."
      );

      setConfirmingBookingId(null);
      setReloadKey((key) => key + 1);
      return;
    }

    setConfirmingBookingId(null);
    setReloadKey((key) => key + 1);
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bookings;

    return bookings.filter((booking) =>
        [
          booking.guest,
          booking.email,
          booking.id,
          booking.displayId,
          booking.treatment,
        ].some((value) => value.toLowerCase().includes(query))
    );
  }, [bookings, search]);

  function changeStatus(status: string) {
    setStatusFilter(status);
    setPage(0);
  }

  function clearGuestFilter() {
    setGuestFilterId("");
    setPage(0);
    window.history.replaceState(null, "", "/bookings");
  }

  return (
      <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">

        {/* Header */}
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

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total Bookings", counts.total, "text-purana-green"],
            ["Confirmed", counts.confirmed, "text-green-700"],
            ["Pending", counts.pending, "text-yellow-700"],
            ["Completed", counts.completed, "text-blue-700"],
          ].map(([label, value, color]) => (
              <div
                  key={String(label)}
                  className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-purana-brown/60">
                  {label}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${color}`}>
                  {value}
                </p>
              </div>
          ))}
        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-2xl border border-purana-brown/10 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-2 lg:max-w-md">
              {guestFilterId && (
                  <div className="flex items-center justify-between rounded-lg bg-purana-green/5 px-3 py-2 text-xs text-purana-green">
                    <span>Showing bookings for selected guest</span>
                    <button
                        type="button"
                        onClick={clearGuestFilter}
                        className="font-semibold underline"
                    >
                      Clear
                    </button>
                  </div>
              )}

              <input
                  type="search"
                  placeholder="Search this page by guest, booking ID or treatment..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-purana-brown/10 bg-purana-soft px-4 py-2.5 text-sm text-purana-brown outline-none transition placeholder:text-purana-brown/40 focus:border-purana-green/40 focus:bg-white focus:ring-2 focus:ring-purana-green/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                  <button
                      key={status}
                      type="button"
                      onClick={() => changeStatus(status)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                          statusFilter === status
                              ? "bg-purana-green text-white"
                              : "bg-purana-soft text-purana-brown/70 hover:bg-purana-green/10 hover:text-purana-green"
                      }`}
                  >
                    {status}
                  </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1000px]">
              <thead>
              <tr className="border-b border-purana-brown/10 bg-purana-soft">
                {[
                  "Booking",
                  "Guest",
                  "Treatment",
                  "Date & Time",
                  "Therapist",
                  "Amount",
                  "Status",
                  "Action",
                ].map((heading) => (
                    <th
                        key={heading}
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60"
                    >
                      {heading}
                    </th>
                ))}
              </tr>
              </thead>

              <tbody>
              {filteredBookings.map((booking) => (
                  <tr
                      key={booking.id}
                      className="border-b border-purana-brown/5 transition hover:bg-purana-soft/50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-purana-green">
                        {booking.displayId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-purana-brown">
                        {booking.guest}
                      </p>
                      <p className="mt-1 text-xs text-purana-brown/50">
                        {booking.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-purana-brown">
                        {booking.treatment}
                      </p>
                      <p className="mt-1 text-xs text-purana-brown/50">
                        {booking.duration}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-purana-brown">
                        {booking.date}
                      </p>
                      <p className="mt-1 text-xs text-purana-brown/50">
                        {booking.time}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-purana-brown">
                      {booking.therapist}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-purana-brown">
                      {booking.amount}
                    </td>

                    <td className="px-5 py-4">
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                            booking.status
                        )}`}
                    >
                      {booking.status}
                    </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status.toLowerCase() === "pending" && (
                            <button
                                type="button"
                                onClick={() => confirmBooking(booking.id)}
                                disabled={confirmingBookingId !== null}
                                className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {confirmingBookingId === booking.id
                                  ? "Confirming..."
                                  : "Confirm"}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="rounded-lg border border-purana-brown/10 px-3 py-2 text-xs font-semibold text-purana-brown transition hover:border-purana-green/20 hover:bg-purana-green/5 hover:text-purana-green"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-purana-brown/10 lg:hidden">
            {filteredBookings.map((booking) => (
                <article key={booking.id} className="p-4 sm:p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-purana-green">
                        {booking.displayId}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-purana-brown">
                        {booking.guest}
                      </p>
                      <p className="text-xs text-purana-brown/50">
                        {booking.email}
                      </p>
                    </div>

                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                            booking.status
                        )}`}
                    >
                  {booking.status}
                </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-purana-brown/40">
                        Treatment
                      </p>
                      <p>{booking.treatment}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase text-purana-brown/40">
                        Therapist
                      </p>
                      <p>{booking.therapist}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase text-purana-brown/40">
                        Date & time
                      </p>
                      <p>
                        {booking.date} · {booking.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase text-purana-brown/40">
                        Amount
                      </p>
                      <p>{booking.amount}</p>
                    </div>
                  </div>

                  {booking.status.toLowerCase() === "pending" && (
                      <button
                          type="button"
                          onClick={() => confirmBooking(booking.id)}
                          disabled={confirmingBookingId !== null}
                          className="mt-5 w-full rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {confirmingBookingId === booking.id
                            ? "Confirming..."
                            : "Confirm Booking"}
                      </button>
                  )}

                  <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="mt-2 w-full rounded-xl border border-purana-brown/10 px-4 py-2.5 text-sm font-semibold text-purana-brown transition hover:bg-purana-green/5"
                  >
                    View Details
                  </button>
                </article>
            ))}
          </div>

          {/* Loading, error and empty states */}
          {loading ? (
              <p className="px-6 py-12 text-center text-sm text-purana-brown/50">
                Loading bookings…
              </p>
          ) : error ? (
              <p
                  role="alert"
                  className="px-6 py-12 text-center text-sm text-red-700"
              >
                Unable to load bookings: {error}
              </p>
          ) : filteredBookings.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <h3 className="text-sm font-semibold text-purana-brown">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-purana-brown/50">
                  Try changing your search or status filter.
                </p>
              </div>
          ) : null}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col gap-3 text-xs text-purana-brown/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {total === 0 ? 0 : page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, total)} of {total} bookings
            {search ? " on this page matching search" : ""}
          </p>

          <div className="flex items-center gap-3">
            <button
                type="button"
                disabled={page === 0 || loading}
                onClick={() =>
                    setPage((current) => Math.max(0, current - 1))
                }
                className="rounded-lg border border-purana-brown/10 px-3 py-2 font-medium disabled:opacity-40"
            >
              Previous
            </button>

            <span>
            Page {page + 1} of {Math.max(1, Math.ceil(total / PAGE_SIZE))}
          </span>

            <button
                type="button"
                disabled={(page + 1) * PAGE_SIZE >= total || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-purana-brown/10 px-3 py-2 font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-purana-brown/50">
          Prices are calculated from booking items. Payment status, source,
          location and questionnaire data aren't available in the current
          database schema.
        </p>

        {/* Modals */}
        {selectedBooking && (
            <BookingDetails
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        )}

        {isNewBookingOpen && (
            <NewBooking
                onClose={() => setIsNewBookingOpen(false)}
                onCreated={() => {
                  setPage(0);
                  setReloadKey((key) => key + 1);
                }}
            />
        )}
      </div>
  );
}
