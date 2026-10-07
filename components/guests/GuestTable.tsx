import { Users } from "lucide-react";

export type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Chalet Guest" | "External Guest";
  status: "Active" | "Inactive";
  lastBooking: string;
  totalBookings: number;
  location: string;
  joined: string;
  notes: string;
};

type GuestTableProps = {
  guests: Guest[];
  onViewDetails: (guest: Guest) => void;
};

function getTypeStyle(type: Guest["type"]) {
  if (type === "Chalet Guest") {
    return "bg-purana-green/10 text-purana-green";
  }

  return "bg-purana-gold/15 text-purana-brown";
}

function getStatusStyle(status: Guest["status"]) {
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }

  return "bg-gray-100 text-gray-500";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function GuestTable({
  guests,
  onViewDetails,
}: GuestTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-purana-brown/10 bg-purana-soft">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                Guest
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                Type
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                Contact
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                Last Booking
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purana-brown/60">
                Bookings
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
            {guests.map((guest) => (
              <tr
                key={guest.id}
                className="border-b border-purana-brown/5 transition hover:bg-purana-soft/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purana-green/10 text-sm font-semibold text-purana-green">
                      {getInitials(guest.name)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-purana-brown">
                        {guest.name}
                      </p>

                      <p className="mt-1 text-xs text-purana-brown/40">
                        {guest.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyle(
                      guest.type
                    )}`}
                  >
                    {guest.type}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-purana-brown">
                    {guest.email}
                  </p>

                  <p className="mt-1 text-xs text-purana-brown/50">
                    {guest.phone}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-purana-brown">
                    {guest.lastBooking}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-purana-green">
                    {guest.totalBookings}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                      guest.status
                    )}`}
                  >
                    {guest.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(guest)}
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

      {/* Mobile */}
      <div className="divide-y divide-purana-brown/10 lg:hidden">
        {guests.map((guest) => (
          <div key={guest.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purana-green/10 text-sm font-semibold text-purana-green">
                  {getInitials(guest.name)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-purana-brown">
                    {guest.name}
                  </p>

                  <p className="mt-1 text-xs text-purana-brown/40">
                    {guest.id}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                  guest.status
                )}`}
              >
                {guest.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                  Type
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyle(
                    guest.type
                  )}`}
                >
                  {guest.type}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                  Bookings
                </p>

                <p className="mt-1 text-sm font-semibold text-purana-green">
                  {guest.totalBookings}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                  Last Booking
                </p>

                <p className="mt-1 text-sm text-purana-brown">
                  {guest.lastBooking}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-purana-brown/40">
                  Location
                </p>

                <p className="mt-1 text-sm text-purana-brown">
                  {guest.location}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails(guest)}
              className="mt-5 w-full rounded-xl border border-purana-brown/10 px-4 py-2.5 text-sm font-semibold text-purana-brown transition hover:border-purana-green/20 hover:bg-purana-green/5 hover:text-purana-green"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Empty */}
      {guests.length === 0 && (
        <div className="px-6 py-16 text-center">
          <Users
            size={32}
            className="mx-auto text-purana-brown/20"
          />

          <h3 className="mt-4 text-sm font-semibold text-purana-brown">
            No guests found
          </h3>

          <p className="mt-1 text-sm text-purana-brown/50">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}