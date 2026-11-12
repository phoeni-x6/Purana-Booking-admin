"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Sparkles, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type GuestRow = { id: string; first_name: string; last_name: string; email: string | null; guest_type: string };
type TherapistRow = { id: string; first_name: string; last_name: string };
type TreatmentRow = { id: string; name: string; duration_minutes: number; price: number | string; currency: string };
type AssignmentRow = { therapist_id: string; treatment_id: string };
type Props = { onClose: () => void; onCreated?: () => void };
const inputClass = "w-full rounded-xl border border-purana-brown/10 bg-white px-4 py-3 text-sm text-purana-brown outline-none focus:border-purana-green/40 focus:ring-2 focus:ring-purana-green/10";

export default function NewBooking({ onClose, onCreated }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [therapists, setTherapists] = useState<TherapistRow[]>([]);
  const [treatments, setTreatments] = useState<TreatmentRow[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      supabase.from("guests").select("id, first_name, last_name, email, guest_type").order("first_name"),
      supabase.from("therapists").select("id, first_name, last_name").eq("active", true).order("first_name"),
      supabase.from("treatments").select("id, name, duration_minutes, price, currency").eq("active", true).eq("available_for_booking", true).order("name"),
      supabase.from("therapist_treatments").select("therapist_id, treatment_id"),
    ]).then(([guestResult, therapistResult, treatmentResult, assignmentResult]) => {
      const failure = guestResult.error ?? therapistResult.error ?? treatmentResult.error ?? assignmentResult.error;
      if (cancelled) return;
      if (failure) setError(failure.message);
      else {
        setGuests((guestResult.data ?? []) as GuestRow[]);
        setTherapists((therapistResult.data ?? []) as TherapistRow[]);
        setTreatments((treatmentResult.data ?? []) as TreatmentRow[]);
        setAssignments((assignmentResult.data ?? []) as AssignmentRow[]);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [supabase]);

  async function createBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const guestId = String(data.get("guest_id") ?? "");
    const treatment = treatments.find((item) => item.id === selectedTreatment);
    const therapistId = String(data.get("therapist_id") ?? "") || null;
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    const startAt = new Date(`${date}T${time}`);
    const endAt = new Date(startAt.getTime() + (treatment?.duration_minutes ?? 0) * 60_000);
    if (!guestId || !treatment || !date || !time || Number.isNaN(startAt.getTime())) {
      setError("Complete the guest, treatment, date and time fields."); setSaving(false); return;
    }

    if (therapistId) {
      const weekday = startAt.getDay();
      const startClock = `${String(startAt.getHours()).padStart(2, "0")}:${String(startAt.getMinutes()).padStart(2, "0")}:00`;
      const endClock = `${String(endAt.getHours()).padStart(2, "0")}:${String(endAt.getMinutes()).padStart(2, "0")}:00`;
      const [hoursResult, bookingConflict, blockConflict] = await Promise.all([
        supabase.from("therapist_working_hours").select("start_time, end_time").eq("therapist_id", therapistId).eq("day_of_week", weekday),
        supabase.from("bookings").select("id").eq("therapist_id", therapistId).in("status", ["pending", "confirmed"]).lt("start_at", endAt.toISOString()).gt("end_at", startAt.toISOString()).limit(1),
        supabase.from("therapist_blocked_times").select("id").eq("therapist_id", therapistId).lt("start_at", endAt.toISOString()).gt("end_at", startAt.toISOString()).limit(1),
      ]);
      const conflictError = hoursResult.error ?? bookingConflict.error ?? blockConflict.error;
      if (conflictError) { setError(conflictError.message); setSaving(false); return; }
      const withinHours = (hoursResult.data ?? []).some((hours) => hours.start_time <= startClock && hours.end_time >= endClock);
      if (!withinHours) { setError("The therapist is not scheduled for the full selected time."); setSaving(false); return; }
      if (bookingConflict.data?.length || blockConflict.data?.length) { setError("The therapist already has a booking or blocked time during this slot."); setSaving(false); return; }
    }

    const { data: booking, error: bookingError } = await supabase.from("bookings").insert({
      guest_id: guestId,
      therapist_id: therapistId,
      status: "pending",
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      guest_notes: String(data.get("guest_notes") ?? "").trim() || null,
      payment_method: String(data.get("payment_method") ?? "").trim() || null,
    }).select("id").single();
    if (bookingError || !booking) { setError(bookingError?.message ?? "Unable to create booking."); setSaving(false); return; }
    const { error: itemError } = await supabase.from("booking_items").insert({
      booking_id: booking.id,
      treatment_id: treatment.id,
      service_name: treatment.name,
      duration_minutes: treatment.duration_minutes,
      unit_price: treatment.price,
      currency: treatment.currency,
    });
    if (itemError) {
      await supabase.from("bookings").delete().eq("id", booking.id);
      setError(itemError.message); setSaving(false); return;
    }
    onCreated?.();
    onClose();
  }

  const selected = treatments.find((item) => item.id === selectedTreatment);
  const assignedTherapistIds = new Set(assignments.filter((assignment) => assignment.treatment_id === selectedTreatment).map((assignment) => assignment.therapist_id));
  const eligibleTherapists = therapists.filter((therapist) => assignedTherapistIds.has(therapist.id));
  return <div className="fixed inset-0 z-50 flex"><button type="button" aria-label="Close new booking" onClick={onClose} className="absolute inset-0 cursor-default bg-purana-brown/30 backdrop-blur-[2px]" />
    <form onSubmit={createBooking} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-purana-brown/10 px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-purana-green/60">Bookings</p><h2 className="mt-1 font-serif text-2xl font-semibold text-purana-green">New Booking</h2><p className="mt-1 text-sm text-purana-brown/50">Create an appointment using existing guest, treatment and therapist records.</p></div><button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-xl text-purana-brown/50 hover:bg-purana-soft"><X size={20} /></button></div>
      <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
        {loading ? <p className="text-sm text-purana-brown/60">Loading booking options…</p> : <>
          <section><div className="mb-3 flex items-center gap-3"><User size={18} className="text-purana-green" /><h3 className="text-sm font-semibold">Guest</h3></div><select required name="guest_id" className={inputClass}><option value="">Choose guest</option>{guests.map((guest) => <option key={guest.id} value={guest.id}>{guest.first_name} {guest.last_name}{guest.email ? ` · ${guest.email}` : ""}</option>)}</select>{guests.length === 0 && <p className="mt-2 text-xs text-purana-brown/50">Add a guest before creating a booking.</p>}</section>
          <section><div className="mb-3 flex items-center gap-3"><Sparkles size={18} className="text-purana-green" /><h3 className="text-sm font-semibold">Treatment</h3></div><select required value={selectedTreatment} onChange={(event) => setSelectedTreatment(event.target.value)} className={inputClass}><option value="">Choose treatment</option>{treatments.map((treatment) => <option key={treatment.id} value={treatment.id}>{treatment.name} · {treatment.duration_minutes} min · {new Intl.NumberFormat("en-IE", { style: "currency", currency: treatment.currency }).format(Number(treatment.price))}</option>)}</select>{selected && <p className="mt-2 text-xs text-purana-brown/50">Booking end time will be calculated from the treatment duration ({selected.duration_minutes} minutes).</p>}</section>
          <section><div className="mb-3 flex items-center gap-3"><CalendarDays size={18} className="text-purana-green" /><h3 className="text-sm font-semibold">Appointment</h3></div><label className="mb-3 block text-sm">Therapist (optional)<select name="therapist_id" className={`${inputClass} mt-1`}><option value="">Assign later</option>{eligibleTherapists.map((therapist) => <option key={therapist.id} value={therapist.id}>{therapist.first_name} {therapist.last_name}</option>)}</select></label>{selectedTreatment && eligibleTherapists.length === 0 && <p className="mb-3 text-xs text-amber-700">No therapist is assigned to this treatment yet. You can leave the booking unassigned and assign later.</p>}<div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Date<input required type="date" name="date" min={new Date().toISOString().slice(0, 10)} className={`${inputClass} mt-1`} /></label><label className="text-sm">Start time<input required type="time" name="time" step={1800} className={`${inputClass} mt-1`} /></label></div></section>
          <section><h3 className="mb-3 text-sm font-semibold">Booking notes and payment method</h3><label className="block text-sm">Guest notes<textarea name="guest_notes" rows={3} className={`${inputClass} mt-1`} /></label><label className="mt-3 block text-sm">Payment method<input name="payment_method" className={`${inputClass} mt-1`} /></label></section>
        </>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
      <div className="border-t border-purana-brown/10 bg-white px-6 py-4"><div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-purana-brown/10 px-5 py-2.5 text-sm font-semibold">Cancel</button><button disabled={loading || saving || !guests.length || !treatments.length} className="rounded-xl bg-purana-green px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Creating…" : "Create Booking"}</button></div></div>
    </form>
  </div>;
}
