"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Treatment } from "./TreatmentTable";

type AddTreatmentProps = { onClose: () => void; onSaved: () => void; treatment?: Treatment; categories: string[] };
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10";

export default function AddTreatment({ onClose, onSaved, treatment, categories }: AddTreatmentProps) {
  const supabase = useMemo(() => createClient(), []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      category: String(form.get("category") ?? "").trim(),
      duration_minutes: Number(form.get("duration_minutes")),
      price: Number(form.get("price")),
      currency: String(form.get("currency") ?? "EUR").trim().toUpperCase(),
      active: form.get("active") === "true",
      available_for_booking: form.get("available_for_booking") === "true",
      description: String(form.get("description") ?? "").trim() || null,
      notes: String(form.get("notes") ?? "").trim() || null,
    };
    const result = treatment
      ? await supabase.from("treatments").update(values).eq("id", treatment.id)
      : await supabase.from("treatments").insert(values);
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved();
  }

  const numericPrice = treatment?.price.replace(/[^0-9.,-]/g, "").replace(/,(?=\d{3}(\D|$))/g, "").replace(",", ".") ?? "";
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={save} className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5"><div><h2 className="text-xl font-semibold text-purana-brown">{treatment ? "Edit Treatment" : "Add Treatment"}</h2><p className="mt-1 text-sm text-gray-500">Treatment details and booking availability.</p></div><button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-purana-soft"><X size={20} /></button></div>
    <div className="space-y-4 p-6">
      <label className="block text-sm font-medium text-gray-700">Name<input required name="name" defaultValue={treatment?.name} className={`${inputClass} mt-2`} /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-gray-700">
        Category
        <select
            required
            name="category"
            defaultValue={treatment?.category ?? ""}
            className={`${inputClass} mt-2`}
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Abhyanga Massages">Abhyanga Massages</option>
          <option value="Special Therapies">Special Therapies</option>
          <option value="Aroma Rituals">Aroma Rituals</option>
          <option value="Facial Treatments">Facial Treatments</option>
          <option value="Day Packages">Day Packages</option>
        </select>
      </label><label className="block text-sm font-medium text-gray-700">Duration (minutes)<input required min="1" step="1" type="number" name="duration_minutes" defaultValue={Number.parseInt(treatment?.duration ?? "", 10) || ""} className={`${inputClass} mt-2`} /></label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-gray-700">Price<input required min="0" step="0.01" type="number" name="price" defaultValue={numericPrice} className={`${inputClass} mt-2`} /></label><label className="block text-sm font-medium text-gray-700">Currency<input required minLength={3} maxLength={3} name="currency" defaultValue={treatment?.currency ?? "EUR"} className={`${inputClass} mt-2 uppercase`} /></label></div>
      <label className="block text-sm font-medium text-gray-700">Description<textarea name="description" rows={4} defaultValue={treatment?.description === "—" ? "" : treatment?.description} className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm font-medium text-gray-700">Internal notes<textarea name="notes" rows={3} defaultValue={treatment?.notes} className={`${inputClass} mt-2`} /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-gray-700">Status<select name="active" defaultValue={treatment?.status === "Inactive" ? "false" : "true"} className={`${inputClass} mt-2`}><option value="true">Active</option><option value="false">Inactive</option></select></label><label className="block text-sm font-medium text-gray-700">Booking availability<select name="available_for_booking" defaultValue={treatment?.availability === "Temporarily unavailable" ? "false" : "true"} className={`${inputClass} mt-2`}><option value="true">Available for booking</option><option value="false">Temporarily unavailable</option></select></label></div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to save treatment: {error}</p>}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-3 text-sm">Cancel</button><button disabled={saving} className="rounded-xl bg-purana-green px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving…" : treatment ? "Save Changes" : "Add Treatment"}</button></div>
    </div>
  </form></div>;
}
