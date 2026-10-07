"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import GuestStats from "@/components/guests/GuestStats";
import GuestFilters from "@/components/guests/GuestFilters";
import GuestTable, {
  type Guest,
} from "@/components/guests/GuestTable";
import GuestDetails from "@/components/guests/GuestDetails";
import AddGuest from "@/components/guests/AddGuest";

const guests: Guest[] = [
  {
    id: "GST-1001",
    name: "Anna Müller",
    email: "anna.mueller@email.com",
    phone: "+49 170 1234567",
    type: "Chalet Guest",
    status: "Active",
    lastBooking: "03 Oct 2026",
    totalBookings: 5,
    location: "Chalet See",
    joined: "12 May 2026",
    notes: "Prefers morning treatments and a quiet treatment room.",
  },
  {
    id: "GST-1002",
    name: "Thomas Weber",
    email: "thomas.weber@email.com",
    phone: "+49 171 9876543",
    type: "External Guest",
    status: "Active",
    lastBooking: "03 Oct 2026",
    totalBookings: 2,
    location: "External",
    joined: "18 Aug 2026",
    notes: "First-time Ayurveda consultation guest.",
  },
  {
    id: "GST-1003",
    name: "Sophie Keller",
    email: "sophie.keller@email.com",
    phone: "+49 172 5551234",
    type: "Chalet Guest",
    status: "Active",
    lastBooking: "03 Oct 2026",
    totalBookings: 8,
    location: "Chalet Relax",
    joined: "21 Mar 2026",
    notes: "Returning guest.",
  },
  {
    id: "GST-1004",
    name: "Michael Braun",
    email: "michael.braun@email.com",
    phone: "+49 173 3332211",
    type: "Chalet Guest",
    status: "Active",
    lastBooking: "04 Oct 2026",
    totalBookings: 11,
    location: "Chalet Strand",
    joined: "05 Jan 2026",
    notes: "Regular guest.",
  },
  {
    id: "GST-1005",
    name: "Julia Fischer",
    email: "julia.fischer@email.com",
    phone: "+49 174 4445566",
    type: "External Guest",
    status: "Inactive",
    lastBooking: "04 Sep 2026",
    totalBookings: 1,
    location: "External",
    joined: "04 Sep 2026",
    notes: "Previous booking was cancelled.",
  },
  {
    id: "GST-1006",
    name: "Daniel Schmidt",
    email: "daniel.schmidt@email.com",
    phone: "+49 175 7778899",
    type: "External Guest",
    status: "Active",
    lastBooking: "28 Sep 2026",
    totalBookings: 3,
    location: "External",
    joined: "15 Jun 2026",
    notes: "Interested in treatment packages.",
  },
];

export default function GuestsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Add Guest drawer state
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        guest.name.toLowerCase().includes(searchValue) ||
        guest.email.toLowerCase().includes(searchValue) ||
        guest.phone.toLowerCase().includes(searchValue) ||
        guest.id.toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All" || guest.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const totalGuests = guests.length;

  const chaletGuests = guests.filter(
    (guest) => guest.type === "Chalet Guest"
  ).length;

  const externalGuests = guests.filter(
    (guest) => guest.type === "External Guest"
  ).length;

  const activeGuests = guests.filter(
    (guest) => guest.status === "Active"
  ).length;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">
            Guests
          </h1>

          <p className="mt-1 text-sm text-purana-brown/60">
            Manage chalet guests, external guests and their booking history.
          </p>
        </div>

        <button
          onClick={() => setIsAddGuestOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"
        >
          <Plus size={18} />
          Add Guest
        </button>
      </div>

      {/* Statistics */}
      <GuestStats
        totalGuests={totalGuests}
        chaletGuests={chaletGuests}
        externalGuests={externalGuests}
        activeGuests={activeGuests}
      />

      {/* Filters */}
      <GuestFilters
        search={search}
        typeFilter={typeFilter}
        onSearchChange={setSearch}
        onTypeChange={setTypeFilter}
      />

      {/* Guest Table */}
      <GuestTable
        guests={filteredGuests}
        onViewDetails={setSelectedGuest}
      />

      {/* Results Count */}
      {filteredGuests.length > 0 && (
        <div className="mt-4 text-xs text-purana-brown/50">
          Showing {filteredGuests.length} of {guests.length} guests
        </div>
      )}

      {/* Guest Details Drawer */}
      {selectedGuest && (
        <GuestDetails
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
        />
      )}

      {/* Add Guest Drawer */}
      {isAddGuestOpen && (
        <AddGuest
          onClose={() => setIsAddGuestOpen(false)}
        />
      )}
    </div>
  );
}