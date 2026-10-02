"use client";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  UserRound,
} from "lucide-react";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-purana-brown/10 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-purana-brown/60 transition hover:bg-purana-soft hover:text-purana-green lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-purana-brown/10 bg-purana-soft px-3 py-2 md:flex md:w-[260px]">
          <Search
            size={17}
            className="text-purana-brown/40"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-purana-brown outline-none placeholder:text-purana-brown/40"
          />

          <span className="rounded-md border border-purana-brown/10 bg-white px-1.5 py-0.5 text-[10px] text-purana-brown/40">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification */}
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-purana-brown/60 transition hover:bg-purana-soft hover:text-purana-green"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purana-red ring-2 ring-white" />
        </button>

        <div className="h-7 w-px bg-purana-brown/10" />

        {/* User */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-purana-soft"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purana-green text-sm font-semibold text-white">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-purana-brown">
              Admin
            </p>

            <p className="text-[11px] text-purana-brown/50">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-purana-brown/40 sm:block"
          />
        </button>
      </div>
    </header>
  );
}