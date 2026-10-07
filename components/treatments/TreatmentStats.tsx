import {
  Activity,
  Clock3,
  Euro,
  Sparkles,
} from "lucide-react";

type TreatmentStatsProps = {
  totalTreatments: number;
  activeTreatments: number;
  categories: number;
  averagePrice: string;
};

export default function TreatmentStats({
  totalTreatments,
  activeTreatments,
  categories,
  averagePrice,
}: TreatmentStatsProps) {
  const stats = [
    {
      label: "Total Treatments",
      value: totalTreatments,
      icon: Sparkles,
    },
    {
      label: "Active Treatments",
      value: activeTreatments,
      icon: Activity,
    },
    {
      label: "Categories",
      value: categories,
      icon: Clock3,
    },
    {
      label: "Average Price",
      value: averagePrice,
      icon: Euro,
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