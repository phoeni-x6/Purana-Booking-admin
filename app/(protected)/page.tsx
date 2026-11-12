import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import {
  CalendarDays,
  Users,
  CreditCard,
  Clock3,
  CheckCircle2,
  Clock,
} from "lucide-react";

type BookingRow = {
  id: string;
  guest_id: string;
  status: string;
  start_at: string;
  guest?: { first_name: string; last_name: string } | null;
  booking_items: {
    service_name: string;
    unit_price: number | string;
    currency: string;
  }[];
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});
const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency });

function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function getGuestName(booking: BookingRow) {
  if (!booking.guest) return "Guest";
  return `${booking.guest.first_name} ${booking.guest.last_name}`;
}

function getServiceNames(booking: BookingRow) {
  return booking.booking_items.map((item) => item.service_name).join(", ") || "—";
}

function formatBookingValue(booking: BookingRow) {
  const totals = new Map<string, number>();
  for (const item of booking.booking_items) {
    totals.set(item.currency, (totals.get(item.currency) ?? 0) + Number(item.unit_price));
  }
  if (totals.size === 0) return "—";
  return [...totals]
    .map(([currency, total]) => currencyFormatter(currency).format(total))
    .join(" + ");
}

export default async function Dashboard() {
  const [{ profile }, supabase] = await Promise.all([requireProfile(), createClient()]);
  if (profile.role === "therapist") redirect("/calendar");

  const now = new Date();
  const todayRange = getDayRange(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(todayRange.start);
  weekStart.setDate(weekStart.getDate() - 6);
  const bookingSelection =
    "id, guest_id, status, start_at, booking_items(service_name, unit_price, currency)";

  const [
    { count: guestCount, error: guestsError },
    { count: todayCount, error: todayError },
    { count: pendingCount, error: pendingError },
    { data: todayBookings, error: todayBookingsError },
    { data: recentBookings, error: recentError },
    { data: monthBookings, error: monthError },
    { data: weekBookings, error: weekError },
  ] = await Promise.all([
    supabase.from("guests").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("start_at", todayRange.start.toISOString())
      .lt("start_at", todayRange.end.toISOString()),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("bookings")
      .select(bookingSelection)
      .gte("start_at", todayRange.start.toISOString())
      .lt("start_at", todayRange.end.toISOString())
      .order("start_at"),
    supabase.from("bookings").select(bookingSelection).order("created_at", { ascending: false }).limit(5),
    supabase
      .from("bookings")
      .select("status, booking_items(unit_price)")
      .gte("start_at", monthStart.toISOString())
      .lt("start_at", new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString())
      .neq("status", "cancelled"),
    supabase
      .from("bookings")
      .select("start_at")
      .gte("start_at", weekStart.toISOString())
      .lt("start_at", todayRange.end.toISOString()),
  ]);

  const queryError = guestsError ?? todayError ?? pendingError ?? todayBookingsError ?? recentError ?? monthError ?? weekError;
  if (queryError) throw new Error(`Unable to load dashboard data: ${queryError.message}`);

  const todayRows = (todayBookings ?? []) as unknown as BookingRow[];
  const recentRows = (recentBookings ?? []) as unknown as BookingRow[];
  const guestIds = [...new Set([...todayRows, ...recentRows].map((booking) => booking.guest_id))];
  const { data: guests, error: guestLookupError } = guestIds.length
    ? await supabase.from("guests").select("id, first_name, last_name").in("id", guestIds)
    : { data: [], error: null };
  if (guestLookupError) throw new Error(`Unable to load booking guests: ${guestLookupError.message}`);
  const guestById = new Map((guests ?? []).map((guest) => [guest.id, guest]));
  const typedTodayBookings = todayRows.map((booking) => ({ ...booking, guest: guestById.get(booking.guest_id) ?? null }));
  const typedRecentBookings = recentRows.map((booking) => ({ ...booking, guest: guestById.get(booking.guest_id) ?? null }));
  const monthValues = new Map<string, number>();
  for (const booking of (monthBookings ?? []) as {
    booking_items: { unit_price: number | string; currency: string }[];
  }[]) {
    for (const item of booking.booking_items) {
      monthValues.set(item.currency, (monthValues.get(item.currency) ?? 0) + Number(item.unit_price));
    }
  }
  const formattedMonthValue = monthValues.size
    ? [...monthValues].map(([currency, value]) => currencyFormatter(currency).format(value)).join(" + ")
    : currencyFormatter("EUR").format(0);
  const chartDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const { start, end } = getDayRange(date);
    const count = (weekBookings ?? []).filter((booking) => {
      const bookingDate = new Date(booking.start_at);
      return bookingDate >= start && bookingDate < end;
    }).length;
    return { date, count };
  });
  const maxDayCount = Math.max(1, ...chartDays.map((day) => day.count));
  const stats = [
    { title: "Today's Bookings", value: String(todayCount ?? 0), icon: CalendarDays },
    { title: "Total Guests", value: String(guestCount ?? 0), icon: Users },
    {
      title: "Monthly Booking Value",
      value: formattedMonthValue,
      icon: CreditCard,
    },
    { title: "Pending Bookings", value: String(pendingCount ?? 0), icon: Clock3 },
  ];

  return (
    <main className="min-h-screen bg-purana-cream p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-purana-green">{dateFormatter.format(now)}</p>
          <h1 className="text-3xl font-semibold text-purana-brown">
            Good {now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening"}, {profile.full_name ?? "Admin"}
          </h1>
          <p className="mt-2 text-sm text-purana-brown/60">Here&apos;s what&apos;s happening at Purana Ayurveda today.</p>
        </div>
        <Link href="/calendar" className="flex w-fit items-center gap-2 rounded-xl bg-purana-green px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-purana-green/90">
          <CalendarDays size={18} /> View Calendar
        </Link>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purana-green/10 text-purana-green"><Icon size={21} /></div>
            <p className="mt-5 text-sm text-purana-brown/60">{title}</p>
            <h2 className="mt-1 text-2xl font-semibold text-purana-brown">{value}</h2>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-purana-brown/10 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-purana-brown">Booking Overview</h2>
            <p className="mt-1 text-sm text-purana-brown/50">Bookings over the last 7 days</p>
          </div>
          <div className="mt-8 flex h-64 items-end gap-3 border-b border-purana-brown/10 px-2">
            {chartDays.map(({ date, count }) => (
              <div key={date.toISOString()} className="group flex h-full flex-1 flex-col items-center justify-end">
                <span className="mb-1 text-xs text-purana-brown/50">{count}</span>
                <div className="w-full max-w-10 rounded-t-lg bg-purana-green/80 transition group-hover:bg-purana-green" style={{ height: `${Math.max(5, (count / maxDayCount) * 85)}%` }} />
                <span className="mt-2 text-xs text-purana-brown/50">{new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-purana-brown/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-semibold text-purana-brown">Today&apos;s Schedule</h2><p className="mt-1 text-sm text-purana-brown/50">{dateFormatter.format(now)}</p></div>
            <Clock3 size={20} className="text-purana-green" />
          </div>
          <div className="mt-6 space-y-4">
            {typedTodayBookings.length ? typedTodayBookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="flex gap-4 rounded-xl bg-purana-soft p-4">
                <div className="min-w-[48px]"><p className="text-sm font-semibold text-purana-brown">{timeFormatter.format(new Date(booking.start_at))}</p></div>
                <div className="border-l border-purana-brown/10 pl-4"><p className="text-sm font-medium text-purana-brown">{getGuestName(booking)}</p><p className="mt-1 text-xs capitalize text-purana-brown/50">{getServiceNames(booking)} · {booking.status}</p></div>
              </div>
            )) : <p className="py-8 text-center text-sm text-purana-brown/50">No bookings scheduled today.</p>}
          </div>
          <Link href="/calendar" className="mt-5 block w-full rounded-xl border border-purana-green/20 py-3 text-center text-sm font-medium text-purana-green transition hover:bg-purana-green hover:text-white">View Full Schedule</Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-purana-brown/10 p-6">
          <div><h2 className="text-lg font-semibold text-purana-brown">Recent Bookings</h2><p className="mt-1 text-sm text-purana-brown/50">Latest reservations from your guests</p></div>
          <Link href="/bookings" className="text-sm font-medium text-purana-green hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead><tr className="border-b border-purana-brown/10 bg-purana-soft/50 text-left">
              {['Guest', 'Treatment', 'Date & Time', 'Status'].map((label) => <th key={label} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-purana-brown/50">{label}</th>)}
            </tr></thead>
            <tbody>
              {typedRecentBookings.length ? typedRecentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-purana-brown/5 last:border-0 hover:bg-purana-soft/30">
                  <td className="px-6 py-4"><p className="text-sm font-medium text-purana-brown">{getGuestName(booking)}</p></td>
                  <td className="px-6 py-4"><p className="text-sm text-purana-brown/70">{getServiceNames(booking)}</p></td>
                  <td className="px-6 py-4"><p className="text-sm text-purana-brown/70">{dateFormatter.format(new Date(booking.start_at))} · {timeFormatter.format(new Date(booking.start_at))}</p></td>
                  <td className="px-6 py-4">{booking.status === "confirmed" ? <span className="inline-flex items-center gap-1.5 rounded-full bg-purana-green/10 px-3 py-1.5 text-xs font-medium capitalize text-purana-green"><CheckCircle2 size={13} />{booking.status}</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-purana-gold/20 px-3 py-1.5 text-xs font-medium capitalize text-purana-brown"><Clock size={13} />{booking.status}</span>}</td>
                </tr>
              )) : <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-purana-brown/50">No bookings yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="px-6 pb-4 text-xs text-purana-brown/50">Monthly booking value uses non-cancelled booking item prices; payment records are not stored on bookings.</p>
      </section>
    </main>
  );
}
