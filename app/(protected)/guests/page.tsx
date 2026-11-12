"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import GuestStats from "@/components/guests/GuestStats";
import GuestFilters from "@/components/guests/GuestFilters";
import GuestTable, { type Guest } from "@/components/guests/GuestTable";
import GuestDetails from "@/components/guests/GuestDetails";
import AddGuest from "@/components/guests/AddGuest";
import { createClient } from "@/lib/supabase/client";

type GuestRow = {
  id: string; first_name: string; last_name: string; email: string | null; phone: string | null;
  guest_type: string; preferred_language: string | null; communication_preference: string | null;
  allergies: string | null; medical_notes: string | null; notes: string | null; created_at: string;
};
type BookingRow = { id: string; guest_id: string; start_at: string; status: string; booking_items: { service_name: string }[] };

function displayGuestType(value: string) {
  if (["chalet", "chalet_guest"].includes(value.toLowerCase())) return "Chalet Guest";
  if (["external", "external_guest"].includes(value.toLowerCase())) return "External Guest";
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(value)) : "—";
}

export default function GuestsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestTypes, setGuestTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [guestResult, bookingResult] = await Promise.all([
      supabase.from("guests").select("id, first_name, last_name, email, phone, guest_type, preferred_language, communication_preference, allergies, medical_notes, notes, created_at").order("created_at", { ascending: false }),
      supabase.from("bookings").select("id, guest_id, start_at, status, booking_items(service_name)").order("start_at", { ascending: false }),
    ]);
    const failure = guestResult.error ?? bookingResult.error;
    if (failure) {
      setError(failure.message);
      setGuests([]);
      setLoading(false);
      return;
    }
    const bookingRows = (bookingResult.data ?? []) as unknown as BookingRow[];
    const bookingsByGuest = new Map<string, BookingRow[]>();
    for (const booking of bookingRows) bookingsByGuest.set(booking.guest_id, [...(bookingsByGuest.get(booking.guest_id) ?? []), booking]);
    const guestRows = (guestResult.data ?? []) as GuestRow[];
    setGuestTypes([...new Set(guestRows.map((guest) => guest.guest_type))]);
    setGuests(guestRows.map((row) => {
      const history = bookingsByGuest.get(row.id) ?? [];
      const latest = history[0];
      return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        name: `${row.first_name} ${row.last_name}`,
        email: row.email ?? "—",
        phone: row.phone ?? "—",
        type: displayGuestType(row.guest_type),
        guestTypeValue: row.guest_type,
        status: history.length ? "With bookings" : "No bookings",
        lastBooking: displayDate(latest?.start_at),
        totalBookings: history.length,
        location: "—",
        joined: displayDate(row.created_at),
        notes: row.notes ?? "—",
        allergies: row.allergies ?? "—",
        medicalNotes: row.medical_notes ?? "—",
        preferredLanguage: row.preferred_language ?? "—",
        communicationPreference: row.communication_preference ?? "—",
        recentTreatment: latest?.booking_items.map((item) => item.service_name).join(", ") || "—",
      };
    }));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void loadGuests(); }, [loadGuests]);

  const filteredGuests = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    return guests.filter((guest) => {
      const matchesSearch = [guest.name, guest.email, guest.phone, guest.id].some((value) => value.toLowerCase().includes(searchValue));
      return matchesSearch && (typeFilter === "All" || guest.type === typeFilter);
    });
  }, [guests, search, typeFilter]);
  const chaletGuests = guests.filter((guest) => guest.type.toLowerCase().includes("chalet")).length;
  const externalGuests = guests.filter((guest) => guest.type.toLowerCase().includes("external")).length;
  const guestsWithBookings = guests.filter((guest) => guest.totalBookings > 0).length;
  const guestTypeOptions = guestTypes.length ? guestTypes : ["chalet_guest", "external_guest"];

  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">Guests</h1><p className="mt-1 text-sm text-purana-brown/60">Guest profiles and booking history.</p></div><button onClick={() => setIsAddGuestOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"><Plus size={18} />Add Guest</button></div>
      <GuestStats totalGuests={guests.length} chaletGuests={chaletGuests} externalGuests={externalGuests} activeGuests={guestsWithBookings} />
      <GuestFilters search={search} typeFilter={typeFilter} onSearchChange={setSearch} onTypeChange={setTypeFilter} types={[...new Set(guests.map((guest) => guest.type))]} />
      {loading ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-purana-brown/60">Loading guests…</p> : error ? <p role="alert" className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">Unable to load guests: {error}</p> : <GuestTable guests={filteredGuests} onViewDetails={setSelectedGuest} />}
      {filteredGuests.length > 0 && <div className="mt-4 text-xs text-purana-brown/50">Showing {filteredGuests.length} of {guests.length} guests</div>}
      {selectedGuest && <GuestDetails guest={selectedGuest} onClose={() => setSelectedGuest(null)} onEdit={(guest) => { setSelectedGuest(null); setEditingGuest(guest); }} />}
      {(isAddGuestOpen || editingGuest) && <AddGuest key={editingGuest?.id ?? "new-guest"} guestTypes={guestTypeOptions} guest={editingGuest ?? undefined} onClose={() => { setIsAddGuestOpen(false); setEditingGuest(null); }} onSaved={async () => { setIsAddGuestOpen(false); setEditingGuest(null); await loadGuests(); }} />}
    </div>
  );
}
