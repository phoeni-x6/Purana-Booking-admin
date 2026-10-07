import {
  Activity,
  CalendarCheck,
  UserCheck,
  Users,
} from "lucide-react";

type TherapistStatsProps = {
  totalTherapists: number;
  activeTherapists: number;
  availableToday: number;
  totalBookings: number;
};

export default function TherapistStats({
  totalTherapists,
  activeTherapists,
  availableToday,
  totalBookings,
}: TherapistStatsProps) {
  const stats = [
    {
      label: "Total Therapists",
      value: totalTherapists,
      icon: Users,
    },
    {
      label: "Active Therapists",
      value: activeTherapists,
      icon: UserCheck,
    },
    {
      label: "Available Today",
      value: availableToday,
      icon: Activity,
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-purana-brown/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purana-brown/60">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-purana-green">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purana-cream text-purana-green">
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}