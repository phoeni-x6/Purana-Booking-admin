import {
  Users,
  Home,
  UserRound,
  UserCheck,
} from "lucide-react";

type GuestStatsProps = {
  totalGuests: number;
  chaletGuests: number;
  externalGuests: number;
  activeGuests: number;
};

export default function GuestStats({
  totalGuests,
  chaletGuests,
  externalGuests,
  activeGuests,
}: GuestStatsProps) {
  const stats = [
    {
      label: "Total Guests",
      value: totalGuests,
      icon: Users,
      iconClass: "bg-purana-green/10 text-purana-green",
      valueClass: "text-purana-green",
    },
    {
      label: "Chalet Guests",
      value: chaletGuests,
      icon: Home,
      iconClass: "bg-purana-green/10 text-purana-green",
      valueClass: "text-purana-green",
    },
    {
      label: "External Guests",
      value: externalGuests,
      icon: UserRound,
      iconClass: "bg-purana-gold/15 text-purana-brown",
      valueClass: "text-purana-brown",
    },
    {
      label: "Active Guests",
      value: activeGuests,
      icon: UserCheck,
      iconClass: "bg-green-50 text-green-600",
      valueClass: "text-green-700",
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
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purana-brown/60">
                  {stat.label}
                </p>

                <p
                  className={`mt-2 text-2xl font-semibold ${stat.valueClass}`}
                >
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon size={19} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}