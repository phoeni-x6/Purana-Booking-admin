"use client";

import {
  CalendarDays,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import type { Guest } from "./GuestTable";

type GuestDetailsProps = {
  guest: Guest;
  onClose: () => void;
};

function getTypeStyle(type: Guest["type"]) {
  if (type === "Chalet Guest") {
    return "bg-purana-green/10 text-purana-green";
  }

  return "bg-purana-gold/15 text-purana-brown";
}

function getStatusStyle(status: Guest["status"]) {
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }

  return "bg-gray-100 text-gray-500";
}

export default function GuestDetails({
  guest,
  onClose,
}: GuestDetailsProps) {
  const initials = guest.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close guest details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-purana-brown/30 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="relative ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purana-brown/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purana-green/10 font-semibold text-purana-green">
              {initials}
            </div>

            <div>
              <h2 className="font-serif text-xl font-semibold text-purana-green">
                {guest.name}
              </h2>

              <p className="mt-1 text-xs text-purana-brown/50">
                {guest.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-purana-brown/50 transition hover:bg-purana-soft hover:text-purana-brown"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getTypeStyle(
                guest.type
              )}`}
            >
              {guest.type}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                guest.status
              )}`}
            >
              {guest.status}
            </span>
          </div>

          {/* Contact */}
          <section className="mb-7">
            <h3 className="mb-4 text-sm font-semibold text-purana-brown">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-purana-green" />

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-purana-brown/40">
                    Email
                  </p>

                  <p className="text-sm text-purana-brown">
                    {guest.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={17} className="text-purana-green" />

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-purana-brown/40">
                    Phone
                  </p>

                  <p className="text-sm text-purana-brown">
                    {guest.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={17} className="text-purana-green" />

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-purana-brown/40">
                    Location
                  </p>

                  <p className="text-sm text-purana-brown">
                    {guest.location}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="mb-7">
            <h3 className="mb-4 text-sm font-semibold text-purana-brown">
              Guest Overview
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-purana-soft p-4">
                <p className="text-xs text-purana-brown/50">
                  Total Bookings
                </p>

                <p className="mt-1 text-xl font-semibold text-purana-green">
                  {guest.totalBookings}
                </p>
              </div>

              <div className="rounded-xl bg-purana-soft p-4">
                <p className="text-xs text-purana-brown/50">
                  Joined
                </p>

                <p className="mt-1 text-sm font-semibold text-purana-brown">
                  {guest.joined}
                </p>
              </div>

              <div className="rounded-xl bg-purana-soft p-4">
                <p className="text-xs text-purana-brown/50">
                  Last Booking
                </p>

                <p className="mt-1 text-sm font-semibold text-purana-brown">
                  {guest.lastBooking}
                </p>
              </div>

              <div className="rounded-xl bg-purana-soft p-4">
                <p className="text-xs text-purana-brown/50">
                  Guest Type
                </p>

                <p className="mt-1 text-sm font-semibold text-purana-brown">
                  {guest.type}
                </p>
              </div>
            </div>
          </section>

          {/* Recent Booking */}
          <section className="mb-7">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays
                size={17}
                className="text-purana-green"
              />

              <h3 className="text-sm font-semibold text-purana-brown">
                Recent Booking
              </h3>
            </div>

            <div className="rounded-xl border border-purana-brown/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-purana-brown">
                    Ayurvedic Treatment
                  </p>

                  <p className="mt-1 text-xs text-purana-brown/50">
                    {guest.lastBooking}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  Completed
                </span>
              </div>
            </div>
          </section>

          {/* Health Questionnaire */}
          <section className="mb-7">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList
                size={17}
                className="text-purana-green"
              />

              <h3 className="text-sm font-semibold text-purana-brown">
                Health Questionnaire
              </h3>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-purana-soft p-4">
              <div>
                <p className="text-sm font-semibold text-purana-brown">
                  Questionnaire
                </p>

                <p className="mt-1 text-xs text-purana-brown/50">
                  Guest health information
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                Completed
              </span>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-purana-brown">
              Notes
            </h3>

            <div className="rounded-xl bg-purana-soft p-4">
              <p className="text-sm leading-6 text-purana-brown/70">
                {guest.notes}
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-purana-brown/10 px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl border border-purana-brown/10 px-4 py-2.5 text-sm font-semibold text-purana-brown transition hover:bg-purana-soft"
            >
              Edit Guest
            </button>

            <button
              type="button"
              className="flex-1 rounded-xl bg-purana-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purana-green/90"
            >
              View Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}