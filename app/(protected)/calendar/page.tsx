"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg, EventClickArg, EventInput, DateSelectArg } from "@fullcalendar/core";
import { createClient } from "@/lib/supabase/client";

type Therapist = { id: string; label: string };
type WorkingHour = { therapist_id: string; day_of_week: number; start_time: string; end_time: string };
type BlockRecord = { id: string; therapist_id: string; start_at: string; end_at: string; reason: string | null };

function therapistLabel(row: Record<string, unknown>) {
  const firstAndLast = [row.first_name, row.last_name].filter((part): part is string => typeof part === "string" && part.trim()).join(" ");
  const label = row.full_name ?? row.name ?? row.display_name ?? firstAndLast ?? row.first_name;
  return typeof label === "string" && label.trim() ? label : `Therapist ${String(row.id).slice(0, 8)}`;
}

function localDateTime(value: Date) {
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export default function CalendarPage() {
  const supabase = useMemo(() => createClient(), []);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState("all");
  const [blockTherapist, setBlockTherapist] = useState("");
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [range, setRange] = useState<{ start: string; end: string } | null>(null);
  const [selection, setSelection] = useState<{ start: string; end: string } | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCalendar = useCallback(async (visibleRange: { start: string; end: string }) => {
    setBusy(true);
    setError(null);
    const [therapistsResult, bookingsResult, blocksResult, hoursResult] = await Promise.all([
      supabase.from("therapists").select("*"),
      supabase.from("bookings").select("id, guest_id, therapist_id, status, start_at, end_at, booking_items(service_name)").lt("start_at", visibleRange.end).gt("end_at", visibleRange.start).order("start_at"),
      supabase.from("therapist_blocked_times").select("id, therapist_id, start_at, end_at, reason").lt("start_at", visibleRange.end).gt("end_at", visibleRange.start),
      supabase.from("therapist_working_hours").select("therapist_id, day_of_week, start_time, end_time"),
    ]);
    const failure = therapistsResult.error ?? bookingsResult.error ?? blocksResult.error ?? hoursResult.error;
    if (failure) {
      setError(failure.message);
      setBusy(false);
      return;
    }

    const therapistRows = (therapistsResult.data ?? []) as Record<string, unknown>[];
    const therapistList = therapistRows.map((row) => ({ id: String(row.id), label: therapistLabel(row) }));
    setTherapists(therapistList);
    const bookingRows = (bookingsResult.data ?? []) as {
      id: string; guest_id: string; therapist_id: string | null; status: string; start_at: string; end_at: string;
      booking_items: { service_name: string }[];
    }[];
    const guestIds = [...new Set(bookingRows.map((booking) => booking.guest_id))];
    const guestsResult = guestIds.length
      ? await supabase.from("guests").select("id, first_name, last_name").in("id", guestIds)
      : { data: [], error: null };
    if (guestsResult.error) {
      setError(guestsResult.error.message);
      setBusy(false);
      return;
    }
    const guestMap = new Map(((guestsResult.data ?? []) as { id: string; first_name: string; last_name: string }[]).map((guest) => [guest.id, `${guest.first_name} ${guest.last_name}`]));
    const therapistMap = new Map(therapistList.map((therapist) => [therapist.id, therapist.label]));
    const bookingEvents: EventInput[] = bookingRows.map((booking) => ({
      id: `booking:${booking.id}`,
      title: `${guestMap.get(booking.guest_id) ?? "Guest"} · ${booking.booking_items.map((item) => item.service_name).join(", ") || "Booking"}`,
      start: booking.start_at,
      end: booking.end_at,
      backgroundColor: booking.status === "confirmed" ? "#476b55" : booking.status === "cancelled" ? "#a64b43" : "#b98a3d",
      borderColor: booking.status === "confirmed" ? "#476b55" : booking.status === "cancelled" ? "#a64b43" : "#b98a3d",
      extendedProps: { kind: "booking", status: booking.status, therapistId: booking.therapist_id, therapist: booking.therapist_id ? therapistMap.get(booking.therapist_id) : "Unassigned" },
    }));
    const blockedEvents: EventInput[] = ((blocksResult.data ?? []) as BlockRecord[]).map((block) => ({
      id: `blocked:${block.id}`,
      title: `Blocked · ${block.reason || therapistMap.get(block.therapist_id) || "Unavailable"}`,
      start: block.start_at,
      end: block.end_at,
      backgroundColor: "#a64b43",
      borderColor: "#a64b43",
      extendedProps: { kind: "blocked", therapistId: block.therapist_id },
    }));
    setWorkingHours((hoursResult.data ?? []) as WorkingHour[]);
    setEvents([...bookingEvents, ...blockedEvents]);
    setBusy(false);
  }, [supabase]);

  function onDatesSet(arg: DatesSetArg) {
    const visibleRange = { start: arg.start.toISOString(), end: arg.end.toISOString() };
    setRange(visibleRange);
    void loadCalendar(visibleRange);
  }

  const visibleEvents = useMemo(() => selectedTherapist === "all"
    ? events
    : events.filter((event) => event.extendedProps?.therapistId === selectedTherapist), [events, selectedTherapist]);
  const businessHours = useMemo(() => {
    const rows = selectedTherapist === "all" ? workingHours : workingHours.filter((hour) => hour.therapist_id === selectedTherapist);
    const unique = new Map<string, { daysOfWeek: number[]; startTime: string; endTime: string }>();
    for (const row of rows) {
      const key = `${row.day_of_week}:${row.start_time}:${row.end_time}`;
      const entry = unique.get(key) ?? { daysOfWeek: [], startTime: row.start_time, endTime: row.end_time };
      entry.daysOfWeek.push(row.day_of_week);
      unique.set(key, entry);
    }
    return [...unique.values()];
  }, [selectedTherapist, workingHours]);

  function startBlocking(arg?: DateSelectArg) {
    const start = arg?.start ?? new Date();
    const end = arg?.end ?? new Date(start.getTime() + 60 * 60 * 1000);
    setSelection({ start: localDateTime(start), end: localDateTime(end) });
    setBlockTherapist(selectedTherapist === "all" ? "" : selectedTherapist);
    setReason("");
    setError(null);
  }

  async function saveBlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selection || !blockTherapist) {
      setError("Choose a therapist before blocking time.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase.from("therapist_blocked_times").insert({
      therapist_id: blockTherapist,
      start_at: new Date(selection.start).toISOString(),
      end_at: new Date(selection.end).toISOString(),
      reason: reason.trim() || null,
    });
    if (insertError) {
      setError(insertError.message);
      setBusy(false);
      return;
    }
    setSelection(null);
    if (range) await loadCalendar(range);
    else setBusy(false);
  }

  async function onEventClick(arg: EventClickArg) {
    if (arg.event.extendedProps.kind !== "blocked") return;
    if (!window.confirm("Remove this blocked time?")) return;
    setBusy(true);
    const id = arg.event.id.replace("blocked:", "");
    const { error: deleteError } = await supabase.from("therapist_blocked_times").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    if (range) await loadCalendar(range);
    else setBusy(false);
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">Calendar</h1><p className="mt-1 text-sm text-purana-brown/60">Appointments, therapist availability and blocked time.</p></div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Filter by therapist" value={selectedTherapist} onChange={(event) => setSelectedTherapist(event.target.value)} className="rounded-xl border border-purana-brown/10 bg-white px-4 py-2.5 text-sm text-purana-brown"><option value="all">All therapists</option>{therapists.map((therapist) => <option key={therapist.id} value={therapist.id}>{therapist.label}</option>)}</select>
          <button type="button" onClick={() => startBlocking()} className="rounded-xl bg-purana-red px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">Block Time</button>
          <Link href="/bookings" className="rounded-xl bg-purana-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purana-green/90">Bookings</Link>
        </div>
      </div>

      <p className="mb-3 text-xs text-purana-brown/60">Click “Block Time” to enter a time, or drag across the calendar to choose a range.</p>
      {error && !selection && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {busy && <p className="mb-3 text-xs text-purana-brown/50">Updating calendar…</p>}
      <div className="calendar-container overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm"><div className="p-4 sm:p-6">
        <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="timeGridWeek" headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }} buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }} height="auto" nowIndicator allDaySlot={false} slotMinTime="07:00:00" slotMaxTime="21:00:00" slotDuration="00:30:00" selectable select={startBlocking} datesSet={onDatesSet} events={visibleEvents} eventClick={onEventClick} businessHours={businessHours} eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }} />
      </div></div>

      {selection && <div className="fixed inset-0 z-50 flex items-center justify-center bg-purana-brown/30 p-4"><form onSubmit={saveBlock} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-purana-brown">Block therapist time</h2>
        <label className="mt-4 block text-sm font-medium text-purana-brown">Therapist<select required value={blockTherapist} onChange={(event) => setBlockTherapist(event.target.value)} className="mt-1 w-full rounded-lg border border-purana-brown/15 bg-white p-2.5"><option value="">Choose therapist</option>{therapists.map((therapist) => <option key={therapist.id} value={therapist.id}>{therapist.label}</option>)}</select></label>
        <label className="mt-5 block text-sm font-medium text-purana-brown">Start<input required type="datetime-local" value={selection.start} onChange={(event) => setSelection({ ...selection, start: event.target.value })} className="mt-1 w-full rounded-lg border border-purana-brown/15 p-2.5" /></label>
        <label className="mt-3 block text-sm font-medium text-purana-brown">End<input required type="datetime-local" min={selection.start} value={selection.end} onChange={(event) => setSelection({ ...selection, end: event.target.value })} className="mt-1 w-full rounded-lg border border-purana-brown/15 p-2.5" /></label>
        <label className="mt-3 block text-sm font-medium text-purana-brown">Reason (optional)<input maxLength={200} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Unavailable, break, leave…" className="mt-1 w-full rounded-lg border border-purana-brown/15 p-2.5" /></label>
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setSelection(null)} className="rounded-lg border border-purana-brown/15 px-4 py-2 text-sm">Cancel</button><button disabled={busy} type="submit" className="rounded-lg bg-purana-red px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save blocked time</button></div>
      </form></div>}
    </div>
  );
}
