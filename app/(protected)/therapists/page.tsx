"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TherapistStats from "@/components/therapists/TherapistStats";
import TherapistFilters from "@/components/therapists/TherapistFilters";
import TherapistTable, { type Therapist } from "@/components/therapists/TherapistTable";
import TherapistDetails from "@/components/therapists/TherapistDetails";
import AddTherapist from "@/components/therapists/AddTherapist";
import { createClient } from "@/lib/supabase/client";

type TherapistRow = { id: string; first_name: string; last_name: string; email: string | null; phone: string | null; active: boolean; created_at: string };
type WorkHour = { therapist_id: string; day_of_week: number; start_time: string; end_time: string };
type Assignment = { therapist_id: string; treatment_id: string };
type TreatmentRow = { id: string; name: string; category: string };
type BookingRow = { therapist_id: string | null };
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TherapistsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [treatments, setTreatments] = useState<TreatmentRow[]>([]);
  const [hoursByTherapist, setHoursByTherapist] = useState<Map<string, WorkHour[]>>(new Map());
  const [assignmentIds, setAssignmentIds] = useState<Map<string, string[]>>(new Map());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [specializationFilter, setSpecializationFilter] = useState("All");
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [isAddTherapistOpen, setIsAddTherapistOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTherapists = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [therapistResult, hoursResult, assignmentResult, treatmentResult, bookingResult] = await Promise.all([
      supabase.from("therapists").select("id, first_name, last_name, email, phone, active, created_at").order("first_name"),
      supabase.from("therapist_working_hours").select("therapist_id, day_of_week, start_time, end_time"),
      supabase.from("therapist_treatments").select("therapist_id, treatment_id"),
      supabase.from("treatments").select("id, name, category"),
      supabase.from("bookings").select("therapist_id").not("therapist_id", "is", null),
    ]);
    const failure = therapistResult.error ?? hoursResult.error ?? assignmentResult.error ?? treatmentResult.error ?? bookingResult.error;
    if (failure) { setError(failure.message); setTherapists([]); setLoading(false); return; }
    const therapistRows = (therapistResult.data ?? []) as TherapistRow[];
    const hours = (hoursResult.data ?? []) as WorkHour[];
    const assignments = (assignmentResult.data ?? []) as Assignment[];
    const treatmentRows = (treatmentResult.data ?? []) as TreatmentRow[];
    const bookings = (bookingResult.data ?? []) as BookingRow[];
    const treatmentMap = new Map(treatmentRows.map((treatment) => [treatment.id, treatment]));
    const hoursMap = new Map<string, WorkHour[]>();
    for (const row of hours) hoursMap.set(row.therapist_id, [...(hoursMap.get(row.therapist_id) ?? []), row]);
    const assignmentMap = new Map<string, string[]>();
    for (const row of assignments) assignmentMap.set(row.therapist_id, [...(assignmentMap.get(row.therapist_id) ?? []), row.treatment_id]);
    const bookingCounts = new Map<string, number>();
    for (const booking of bookings) if (booking.therapist_id) bookingCounts.set(booking.therapist_id, (bookingCounts.get(booking.therapist_id) ?? 0) + 1);
    const today = new Date().getDay();
    const formatted = therapistRows.map((row): Therapist => {
      const therapistHours = hoursMap.get(row.id) ?? [];
      const assigned = assignmentMap.get(row.id) ?? [];
      const assignedTreatments = assigned.map((id) => treatmentMap.get(id)).filter((item): item is TreatmentRow => Boolean(item));
      const categories = [...new Set(assignedTreatments.map((item) => item.category))];
      const workTimes = [...new Set(therapistHours.map((item) => `${item.start_time.slice(0, 5)}–${item.end_time.slice(0, 5)}`))];
      const workDays = [...new Set(therapistHours.map((item) => item.day_of_week))].sort((a, b) => a - b).map((day) => dayLabels[day]);
      return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        name: `${row.first_name} ${row.last_name}`,
        email: row.email ?? "—",
        phone: row.phone ?? "—",
        specialization: categories.join(", ") || "—",
        experience: "—",
        status: row.active ? "Active" : "Inactive",
        availability: !row.active ? "Inactive" : therapistHours.some((item) => item.day_of_week === today) ? "Scheduled today" : "Not scheduled today",
        workingHours: workTimes.length ? `${workDays.join(", ")}: ${workTimes.join(", ")}` : "Not set",
        bookings: bookingCounts.get(row.id) ?? 0,
        treatments: assigned.length,
        joined: new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(row.created_at)),
        notes: "—",
      };
    });
    setTreatments(treatmentRows);
    setHoursByTherapist(hoursMap);
    setAssignmentIds(assignmentMap);
    setTherapists(formatted);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void loadTherapists(); }, [loadTherapists]);
  const specializations = [...new Set(therapists.flatMap((therapist) => therapist.specialization.split(", ").filter((value) => value !== "—")))].sort();
  const filteredTherapists = useMemo(() => therapists.filter((therapist) => {
    const query = search.toLowerCase().trim();
    return (!query || [therapist.name, therapist.email, therapist.phone, therapist.id].some((value) => value.toLowerCase().includes(query))) &&
      (statusFilter === "All" || therapist.status === statusFilter) &&
      (specializationFilter === "All" || therapist.specialization.split(", ").includes(specializationFilter));
  }), [therapists, search, statusFilter, specializationFilter]);
  const availableToday = therapists.filter((therapist) => therapist.status === "Active" && therapist.availability === "Scheduled today").length;
  const totalBookings = therapists.reduce((sum, therapist) => sum + therapist.bookings, 0);

  return <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">Therapists</h1><p className="mt-1 text-sm text-purana-brown/60">Therapist profiles, working hours and bookings.</p></div><button onClick={() => setIsAddTherapistOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white"><Plus size={18} />Add Therapist</button></div>
    <TherapistStats totalTherapists={therapists.length} activeTherapists={therapists.filter((therapist) => therapist.status === "Active").length} availableToday={availableToday} totalBookings={totalBookings} />
    <TherapistFilters search={search} statusFilter={statusFilter} specializationFilter={specializationFilter} specializations={specializations} onSearchChange={setSearch} onStatusChange={setStatusFilter} onSpecializationChange={setSpecializationFilter} />
    {loading ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-purana-brown/60">Loading therapists…</p> : error ? <p role="alert" className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">Unable to load therapists: {error}</p> : <TherapistTable therapists={filteredTherapists} onViewDetails={setSelectedTherapist} />}
    <div className="mt-4 text-xs text-purana-brown/50">Showing {filteredTherapists.length} of {therapists.length} therapists</div>
    {selectedTherapist && <TherapistDetails therapist={selectedTherapist} onClose={() => setSelectedTherapist(null)} onEdit={(therapist) => { setSelectedTherapist(null); setEditingTherapist(therapist); }} />}
    {(isAddTherapistOpen || editingTherapist) && <AddTherapist key={editingTherapist?.id ?? "new-therapist"} therapist={editingTherapist ?? undefined} treatments={treatments} assignedTreatmentIds={editingTherapist ? assignmentIds.get(editingTherapist.id) ?? [] : []} workingHours={editingTherapist ? hoursByTherapist.get(editingTherapist.id) ?? [] : []} onClose={() => { setIsAddTherapistOpen(false); setEditingTherapist(null); }} onSaved={async () => { setIsAddTherapistOpen(false); setEditingTherapist(null); await loadTherapists(); }} />}
  </div>;
}
