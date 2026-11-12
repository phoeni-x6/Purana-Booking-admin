"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TreatmentStats from "@/components/treatments/TreatmentStats";
import TreatmentFilters from "@/components/treatments/TreatmentFilters";
import TreatmentTable, { type Treatment } from "@/components/treatments/TreatmentTable";
import TreatmentDetails from "@/components/treatments/TreatmentDetails";
import AddTreatment from "@/components/treatments/AddTreatment";
import { createClient } from "@/lib/supabase/client";

type TreatmentRow = { id: string; name: string; category: string; duration_minutes: number; price: number | string; currency: string; description: string | null; active: boolean; available_for_booking: boolean; notes: string | null };
type AssignmentRow = { treatment_id: string };
type BookingItemRow = { treatment_id: string | null; service_name: string };

export default function TreatmentsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [averagePrice, setAveragePrice] = useState("€0.00");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [isAddTreatmentOpen, setIsAddTreatmentOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTreatments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [treatmentsResult, assignmentResult, bookingsResult] = await Promise.all([
      supabase.from("treatments").select("id, name, category, duration_minutes, price, currency, description, active, available_for_booking, notes").order("name"),
      supabase.from("therapist_treatments").select("treatment_id"),
      supabase.from("booking_items").select("treatment_id, service_name"),
    ]);
    const failure = treatmentsResult.error ?? assignmentResult.error ?? bookingsResult.error;
    if (failure) { setError(failure.message); setTreatments([]); setLoading(false); return; }
    const treatmentRows = (treatmentsResult.data ?? []) as TreatmentRow[];
    const currencyTotals = new Map<string, { total: number; count: number }>();
    for (const row of treatmentRows) {
      const current = currencyTotals.get(row.currency) ?? { total: 0, count: 0 };
      current.total += Number(row.price);
      current.count += 1;
      currencyTotals.set(row.currency, current);
    }
    setAveragePrice([...currencyTotals].map(([currency, values]) => new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(values.total / values.count)).join(" / ") || "—");
    const assignmentCounts = new Map<string, number>();
    for (const assignment of (assignmentResult.data ?? []) as AssignmentRow[]) assignmentCounts.set(assignment.treatment_id, (assignmentCounts.get(assignment.treatment_id) ?? 0) + 1);
    const bookingCounts = new Map<string, number>();
    const treatmentsByName = new Map(treatmentRows.map((row) => [row.name.trim().toLowerCase(), row.id]));
    for (const item of (bookingsResult.data ?? []) as BookingItemRow[]) {
      const treatmentId = item.treatment_id ?? treatmentsByName.get(item.service_name.trim().toLowerCase());
      if (treatmentId) bookingCounts.set(treatmentId, (bookingCounts.get(treatmentId) ?? 0) + 1);
    }
    setCategories([...new Set(treatmentRows.map((row) => row.category))].sort());
    setTreatments(treatmentRows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      duration: `${row.duration_minutes} min`,
      price: new Intl.NumberFormat("en-IE", { style: "currency", currency: row.currency }).format(Number(row.price)),
      description: row.description ?? "—",
      status: row.active ? "Active" : "Inactive",
      availability: row.available_for_booking ? "Available for booking" : "Temporarily unavailable",
      therapists: assignmentCounts.get(row.id) ?? 0,
      bookings: bookingCounts.get(row.id) ?? 0,
      currency: row.currency,
      notes: row.notes ?? "",
    })));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void loadTreatments(); }, [loadTreatments]);
  const filteredTreatments = useMemo(() => treatments.filter((treatment) => {
    const query = search.toLowerCase().trim();
    return (!query || [treatment.name, treatment.category, treatment.id].some((value) => value.toLowerCase().includes(query))) &&
      (categoryFilter === "All" || treatment.category === categoryFilter) &&
      (statusFilter === "All" || treatment.status === statusFilter);
  }), [treatments, search, categoryFilter, statusFilter]);
  const activeTreatments = treatments.filter((treatment) => treatment.status === "Active").length;

  async function toggleAvailability(treatment: Treatment) {
    const { error: updateError } = await supabase.from("treatments").update({ available_for_booking: treatment.availability !== "Available for booking" }).eq("id", treatment.id);
    if (updateError) { setError(updateError.message); return; }
    setSelectedTreatment(null);
    await loadTreatments();
  }
  return <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">Treatments</h1><p className="mt-1 text-sm text-purana-brown/60">Treatments, pricing and therapist assignments.</p></div><button onClick={() => setIsAddTreatmentOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white"><Plus size={18} />Add Treatment</button></div>
    <TreatmentStats totalTreatments={treatments.length} activeTreatments={activeTreatments} categories={categories.length} averagePrice={averagePrice} />
    <TreatmentFilters search={search} categoryFilter={categoryFilter} statusFilter={statusFilter} categories={categories} onSearchChange={setSearch} onCategoryChange={setCategoryFilter} onStatusChange={setStatusFilter} />
    {loading ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-purana-brown/60">Loading treatments…</p> : error ? <p role="alert" className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">Unable to load treatments: {error}</p> : <TreatmentTable treatments={filteredTreatments} onViewDetails={setSelectedTreatment} />}
    <div className="mt-4 text-xs text-purana-brown/50">Showing {filteredTreatments.length} of {treatments.length} treatments</div>
    {selectedTreatment && <TreatmentDetails treatment={selectedTreatment} onClose={() => setSelectedTreatment(null)} onEdit={(treatment) => { setSelectedTreatment(null); setEditingTreatment(treatment); }} onToggleAvailability={toggleAvailability} />}
    {(isAddTreatmentOpen || editingTreatment) && <AddTreatment key={editingTreatment?.id ?? "new-treatment"} treatment={editingTreatment ?? undefined} categories={categories} onClose={() => { setIsAddTreatmentOpen(false); setEditingTreatment(null); }} onSaved={async () => { setIsAddTreatmentOpen(false); setEditingTreatment(null); await loadTreatments(); }} />}
  </div>;
}
