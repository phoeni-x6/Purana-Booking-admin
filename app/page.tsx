import {
  CalendarDays,
  Users,
  CreditCard,
  Clock3,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Today's Bookings",
    value: "12",
    change: "+8.2%",
    icon: CalendarDays,
  },
  {
    title: "Total Guests",
    value: "86",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Monthly Revenue",
    value: "€12,450",
    change: "+6.4%",
    icon: CreditCard,
  },
  {
    title: "Pending Bookings",
    value: "08",
    change: "Needs attention",
    icon: Clock3,
  },
];

const bookings = [
  {
    guest: "Anna Müller",
    treatment: "Ayurvedic Full Body Massage",
    time: "09:00",
    status: "Confirmed",
  },
  {
    guest: "Mark Weber",
    treatment: "Ayurveda Consultation",
    time: "10:30",
    status: "Confirmed",
  },
  {
    guest: "Sarah Klein",
    treatment: "Shirodhara",
    time: "13:00",
    status: "Pending",
  },
  {
    guest: "Thomas Fischer",
    treatment: "Panchakarma Consultation",
    time: "15:30",
    status: "Confirmed",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-purana-cream p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-purana-green">
            Thursday, October 2, 2026
          </p>

          <h1 className="text-3xl font-semibold text-purana-brown">
            Good morning, Admin
          </h1>

          <p className="mt-2 text-sm text-purana-brown/60">
            Here's what's happening at Purana Ayurveda today.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-xl bg-purana-green px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-purana-green/90">
          <CalendarDays size={18} />
          View Calendar
        </button>
      </div>

      {/* Stats */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purana-green/10 text-purana-green">
                  <Icon size={21} />
                </div>

                <span className="flex items-center gap-1 text-xs font-medium text-purana-green">
                  <ArrowUpRight size={14} />
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-purana-brown/60">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-purana-brown">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Main content */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Booking Overview */}
        <div className="rounded-2xl border border-purana-brown/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-purana-brown">
                Booking Overview
              </h2>

              <p className="mt-1 text-sm text-purana-brown/50">
                Your booking activity this month
              </p>
            </div>

            <select className="rounded-lg border border-purana-brown/10 bg-purana-soft px-3 py-2 text-sm text-purana-brown outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>

          {/* Chart placeholder */}
          <div className="mt-8 flex h-64 items-end gap-3 border-b border-purana-brown/10 px-2">
            {[45, 65, 50, 80, 60, 90, 72, 95, 68, 82, 75, 88].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-purana-green/80 transition group-hover:bg-purana-green"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            )}
          </div>

          <div className="mt-3 flex justify-between px-2 text-xs text-purana-brown/40">
            <span>Sep 21</span>
            <span>Sep 24</span>
            <span>Sep 27</span>
            <span>Sep 30</span>
            <span>Oct 2</span>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="rounded-2xl border border-purana-brown/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-purana-brown">
                Today's Schedule
              </h2>

              <p className="mt-1 text-sm text-purana-brown/50">
                October 2, 2026
              </p>
            </div>

            <Clock3 size={20} className="text-purana-green" />
          </div>

          <div className="mt-6 space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.time}
                className="flex gap-4 rounded-xl bg-purana-soft p-4"
              >
                <div className="min-w-[48px]">
                  <p className="text-sm font-semibold text-purana-brown">
                    {booking.time}
                  </p>
                </div>

                <div className="border-l border-purana-brown/10 pl-4">
                  <p className="text-sm font-medium text-purana-brown">
                    {booking.guest}
                  </p>

                  <p className="mt-1 text-xs text-purana-brown/50">
                    {booking.treatment}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full rounded-xl border border-purana-green/20 py-3 text-sm font-medium text-purana-green transition hover:bg-purana-green hover:text-white">
            View Full Schedule
          </button>
        </div>
      </section>

      {/* Recent bookings */}
      <section className="mt-6 rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-purana-brown/10 p-6">
          <div>
            <h2 className="text-lg font-semibold text-purana-brown">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-purana-brown/50">
              Latest reservations from your guests
            </p>
          </div>

          <button className="text-sm font-medium text-purana-green hover:underline">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-purana-brown/10 bg-purana-soft/50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-purana-brown/50">
                  Guest
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-purana-brown/50">
                  Treatment
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-purana-brown/50">
                  Time
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-purana-brown/50">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.guest}
                  className="border-b border-purana-brown/5 last:border-0 hover:bg-purana-soft/30"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-purana-brown">
                      {booking.guest}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-purana-brown/70">
                      {booking.treatment}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-purana-brown/70">
                      {booking.time}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {booking.status === "Confirmed" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purana-green/10 px-3 py-1.5 text-xs font-medium text-purana-green">
                        <CheckCircle2 size={13} />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purana-gold/20 px-3 py-1.5 text-xs font-medium text-purana-brown">
                        <Clock size={13} />
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}