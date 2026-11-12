"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Guest } from "./GuestTable";

type AddGuestProps = {
  guestTypes: string[];
  guest?: Guest;
  onClose: () => void;
  onSaved: () => void;
};

export default function AddGuest({ guestTypes, guest, onClose, onSaved }: AddGuestProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function saveGuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const values = {
      first_name: String(form.get("first_name") ?? "").trim(),
      last_name: String(form.get("last_name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim() || null,
      phone: String(form.get("phone") ?? "").trim() || null,
      guest_type: String(form.get("guest_type") ?? ""),
      preferred_language: String(form.get("preferred_language") ?? "").trim() || null,
      communication_preference: String(form.get("communication_preference") ?? "").trim() || null,
      allergies: String(form.get("allergies") ?? "").trim() || null,
      medical_notes: String(form.get("medical_notes") ?? "").trim() || null,
      notes: String(form.get("notes") ?? "").trim() || null,
    };
    const result = guest
      ? await supabase.from("guests").update(values).eq("id", guest.id)
      : await supabase.from("guests").insert(values);
    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }
    onSaved();
  }

  const inputClass = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purana-green focus:ring-2 focus:ring-purana-green/10";
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <form onSubmit={saveGuest} className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5"><div><h2 className="text-xl font-semibold text-purana-brown">{guest ? "Edit Guest" : "Add Guest"}</h2><p className="mt-1 text-sm text-gray-500">Save guest details to the guest database.</p></div><button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-purana-soft"><X size={20} /></button></div>
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">First name<input required name="first_name" defaultValue={guest?.firstName} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700">Last name<input required name="last_name" defaultValue={guest?.lastName} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700">Email<input name="email" type="email" defaultValue={guest?.email === "—" ? "" : guest?.email} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700">Phone<input name="phone" type="tel" defaultValue={guest?.phone === "—" ? "" : guest?.phone} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700">Guest type<select required name="guest_type" defaultValue={guest?.guestTypeValue ?? ""} className={`${inputClass} mt-2`}><option value="" disabled>Select type</option>{guestTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}</option>)}</select></label>
            <label className="text-sm font-medium text-gray-700">Preferred language<input name="preferred_language" defaultValue={guest?.preferredLanguage === "—" ? "" : guest?.preferredLanguage} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">Communication preference<input name="communication_preference" defaultValue={guest?.communicationPreference === "—" ? "" : guest?.communicationPreference} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">Allergies<textarea name="allergies" rows={2} defaultValue={guest?.allergies === "—" ? "" : guest?.allergies} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">Medical notes<textarea name="medical_notes" rows={3} defaultValue={guest?.medicalNotes === "—" ? "" : guest?.medicalNotes} className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">Notes<textarea name="notes" rows={3} defaultValue={guest?.notes === "—" ? "" : guest?.notes} className={`${inputClass} mt-2`} /></label>
          </div>
          {guestTypes.length === 0 && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Guest type choices are not available yet. The database needs an existing guest row so the enum values can be loaded.</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to save guest: {error}</p>}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600">Cancel</button><button disabled={saving || guestTypes.length === 0} type="submit" className="rounded-xl bg-purana-green px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving…" : guest ? "Save Changes" : "Add Guest"}</button></div>
        </div>
      </form>
    </div>
  );
}
