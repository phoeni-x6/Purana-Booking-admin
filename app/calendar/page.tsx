"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarPage() {
  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">
            Calendar
          </h1>

          <p className="mt-1 text-sm text-purana-brown/60">
            Manage appointments, therapists and availability.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-purana-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purana-green/90"
        >
          + New Booking
        </button>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden rounded-2xl border border-purana-brown/10 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
            height="auto"
            nowIndicator={true}
          />
        </div>
      </div>
    </div>
  );
}