"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Therapist } from "./TherapistTable";

type TreatmentOption = { id: string; name: string };
type WorkHour = { therapist_id: string; day_of_week: number; start_time: string; end_time: string };
type Props = { onClose: () => void; onSaved: () => void; therapist?: Therapist; treatments: TreatmentOption[]; assignedTreatmentIds: string[]; workingHours: WorkHour[] };
const DAYS = [{ label: "Sunday", value: 0 }, { label: "Monday", value: 1 }, { label: "Tuesday", value: 2 }, { label: "Wednesday", value: 3 }, { label: "Thursday", value: 4 }, { label: "Friday", value: 5 }, { label: "Saturday", value: 6 }];
const inputClass = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10";

export default function AddTherapist({ onClose, onSaved, therapist, treatments, assignedTreatmentIds, workingHours }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const existingDays = workingHours.map((hour) => hour.day_of_week);
  const [days, setDays] = useState<number[]>(existingDays.length ? existingDays : [1, 2, 3, 4, 5, 6]);
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<string[]>(assignedTreatmentIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const values = {
      first_name: String(form.get("first_name") ?? "").trim(),
      last_name: String(form.get("last_name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim() || null,
      phone: String(form.get("phone") ?? "").trim() || null,
      active: form.get("active") === "true",
    };
    // Avoid requiring SELECT permission on the inserted row just to get its ID.
    // The database column has a UUID default, but supplying one lets us use the
    // same ID for related schedule and treatment rows without a RETURNING query.
    const therapistId = therapist?.id ?? crypto.randomUUID();
    const profileResult = therapist
      ? await supabase.from("therapists").update(values).eq("id", therapistId)
      : await supabase.from("therapists").insert({ ...values, id: therapistId });
    if (profileResult.error) { setError(profileResult.error.message); setSaving(false); return; }

    const [hoursDelete, assignmentsDelete] = await Promise.all([
      supabase.from("therapist_working_hours").delete().eq("therapist_id", therapistId),
      supabase.from("therapist_treatments").delete().eq("therapist_id", therapistId),
    ]);
    const relationError = hoursDelete.error ?? assignmentsDelete.error;
    if (relationError) { setError(relationError.message); setSaving(false); return; }
    const startTime = String(form.get("start_time") ?? "09:00");
    const endTime = String(form.get("end_time") ?? "17:00");
    const hours = days.map((day) => ({ therapist_id: therapistId, day_of_week: day, start_time: startTime, end_time: endTime }));
    const assignments = selectedTreatmentIds.map((treatmentId) => ({ therapist_id: therapistId, treatment_id: treatmentId }));
    const inserts = await Promise.all([
      hours.length ? supabase.from("therapist_working_hours").insert(hours) : Promise.resolve({ error: null }),
      assignments.length ? supabase.from("therapist_treatments").insert(assignments) : Promise.resolve({ error: null }),
    ]);
    const insertError = inserts[0].error ?? inserts[1].error;
    if (insertError) { setError(insertError.message); setSaving(false); return; }
    onSaved();
  }

  function toggleTreatment(id: string) {
    setSelectedTreatmentIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={save} className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5"><div><h2 className="text-xl font-semibold text-purana-brown">{therapist ? "Edit Therapist" : "Add Therapist"}</h2><p className="mt-1 text-sm text-gray-500">Therapist profile and weekly working hours.</p></div><button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-purana-soft"><X size={20} /></button></div>
    <div className="space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">First name<input required name="first_name" defaultValue={therapist?.firstName} className={`${inputClass} mt-2`} /></label><label className="text-sm font-medium text-gray-700">Last name<input required name="last_name" defaultValue={therapist?.lastName} className={`${inputClass} mt-2`} /></label><label className="text-sm font-medium text-gray-700">Email<input name="email" type="email" defaultValue={therapist?.email === "—" ? "" : therapist?.email} className={`${inputClass} mt-2`} /></label><label className="text-sm font-medium text-gray-700">Phone<input name="phone" type="tel" defaultValue={therapist?.phone === "—" ? "" : therapist?.phone} className={`${inputClass} mt-2`} /></label></div>
      <label className="block text-sm font-medium text-gray-700">Status<select name="active" defaultValue={therapist?.status === "Inactive" ? "false" : "true"} className={`${inputClass} mt-2`}><option value="true">Active</option><option value="false">Inactive</option></select></label>
      <fieldset><legend className="mb-2 text-sm font-medium text-gray-700">Assigned treatments</legend><div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-3">{treatments.length ? treatments.map((treatment) => <label key={treatment.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedTreatmentIds.includes(treatment.id)} onChange={() => toggleTreatment(treatment.id)} className="accent-purana-green" />{treatment.name}</label>) : <p className="text-sm text-gray-500">Create treatments before assigning them.</p>}</div></fieldset>
      <fieldset><legend className="mb-3 text-sm font-medium text-gray-700">Working days</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{DAYS.map((day) => <label key={day.value} className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm"><input type="checkbox" checked={days.includes(day.value)} onChange={() => setDays((current) => current.includes(day.value) ? current.filter((value) => value !== day.value) : [...current, day.value])} className="accent-purana-green" />{day.label.slice(0, 3)}</label>)}</div></fieldset>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">Start time<input required type="time" name="start_time" defaultValue={workingHours[0]?.start_time.slice(0, 5) ?? "09:00"} className={`${inputClass} mt-2`} /></label><label className="text-sm font-medium text-gray-700">End time<input required type="time" name="end_time" defaultValue={workingHours[0]?.end_time.slice(0, 5) ?? "17:00"} className={`${inputClass} mt-2`} /></label></div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to save therapist: {error}</p>}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-3 text-sm">Cancel</button><button disabled={saving} className="rounded-xl bg-purana-green px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving…" : therapist ? "Save Changes" : "Add Therapist"}</button></div>
    </div>
  </form></div>;
}
