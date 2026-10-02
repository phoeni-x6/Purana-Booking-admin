"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Sparkles,
  Stethoscope,
  Users,
  UserRound,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navigation = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: Home,
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: CalendarDays,
      },
      {
        label: "Bookings",
        href: "/bookings",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Guests",
        href: "/guests",
        icon: Users,
      },
      {
        label: "Treatments",
        href: "/treatments",
        icon: Stethoscope,
      },
      {
        label: "Packages",
        href: "/packages",
        icon: Package,
      },
      {
        label: "Therapists",
        href: "/therapists",
        icon: UserRound,
      },
      {
        label: "Memberships",
        href: "/memberships",
        icon: Sparkles,
      },
      {
        label: "Treatment Packs",
        href: "/treatment-packs",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "FINANCE",
    items: [
      {
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      {
        label: "Forms",
        href: "/forms",
        icon: FileText,
      },
      {
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col
          border-r border-purana-brown/10 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-[76px] items-center justify-between border-b border-purana-brown/10 px-6">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purana-green text-white shadow-sm">
              <span className="font-serif text-xl">P</span>
            </div>

            <div>
              <h1 className="font-serif text-lg font-semibold tracking-wide text-purana-green">
                PURANA
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-purana-brown/60">
                Ayurveda
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-purana-brown/50 hover:bg-purana-soft hover:text-purana-brown lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-6">
            {navigation.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-purana-brown/40">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`
                          group flex items-center gap-3 rounded-xl px-3 py-2.5
                          text-sm font-medium transition-all
                          ${
                            active
                              ? "bg-purana-green text-white shadow-sm"
                              : "text-purana-brown/70 hover:bg-purana-soft hover:text-purana-green"
                          }
                        `}
                      >
                        <Icon
                          size={18}
                          strokeWidth={active ? 2.2 : 1.8}
                          className={
                            active
                              ? "text-white"
                              : "text-purana-brown/50 group-hover:text-purana-green"
                          }
                        />

                        <span>{item.label}</span>

                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purana-gold" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom user area */}
        <div className="border-t border-purana-brown/10 p-4">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-purana-soft p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purana-green text-sm font-semibold text-white">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-purana-brown">
                Admin User
              </p>

              <p className="truncate text-xs text-purana-brown/50">
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-purana-brown/60 transition hover:bg-red-50 hover:text-purana-red"
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}