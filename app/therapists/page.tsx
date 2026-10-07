"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import TherapistStats from "@/components/therapists/TherapistStats";
import TherapistFilters from "@/components/therapists/TherapistFilters";
import TherapistTable, {
  type Therapist,
} from "@/components/therapists/TherapistTable";
import TherapistDetails from "@/components/therapists/TherapistDetails";
import AddTherapist from "@/components/therapists/AddTherapist";

const therapists: Therapist[] = [
  {
    id: "THR-1001",
    name: "Sanduni Perera",
    email: "sanduni@purana-ayurveda.com",
    phone: "+49 170 1234567",
    specialization: "Ayurvedic Massage",
    experience: "8 years",
    status: "Active",
    availability: "Available today",
    workingHours: "09:00 – 17:00",
    bookings: 48,
    treatments: 7,
    joined: "12 Jan 2025",
    notes:
      "Specialises in traditional Ayurvedic massage and relaxation treatments.",
  },
  {
    id: "THR-1002",
    name: "Priya Fernando",
    email: "priya@purana-ayurveda.com",
    phone: "+49 171 9876543",
    specialization: "Ayurvedic Therapy",
    experience: "10 years",
    status: "Active",
    availability: "Available today",
    workingHours: "09:00 – 18:00",
    bookings: 56,
    treatments: 8,
    joined: "05 Nov 2024",
    notes:
      "Experienced in Ayurvedic therapies, Shirodhara and traditional treatments.",
  },
  {
    id: "THR-1003",
    name: "Anjali Silva",
    email: "anjali@purana-ayurveda.com",
    phone: "+49 172 5551234",
    specialization: "Consultation",
    experience: "12 years",
    status: "Active",
    availability: "Available today",
    workingHours: "10:00 – 18:00",
    bookings: 39,
    treatments: 5,
    joined: "18 Aug 2024",
    notes:
      "Ayurvedic practitioner specialising in consultations and personalised wellness plans.",
  },
  {
    id: "THR-1004",
    name: "Nimali Jayasuriya",
    email: "nimali@purana-ayurveda.com",
    phone: "+49 173 3332211",
    specialization: "Yoga & Meditation",
    experience: "6 years",
    status: "Active",
    availability: "Available today",
    workingHours: "08:00 – 16:00",
    bookings: 31,
    treatments: 4,
    joined: "21 Feb 2025",
    notes:
      "Leads yoga, meditation and breathwork sessions for guests.",
  },
  {
    id: "THR-1005",
    name: "Kavindi Perera",
    email: "kavindi@purana-ayurveda.com",
    phone: "+49 174 4445566",
    specialization: "Ayurvedic Massage",
    experience: "5 years",
    status: "On Leave",
    availability: "On leave",
    workingHours: "09:00 – 17:00",
    bookings: 27,
    treatments: 6,
    joined: "10 May 2025",
    notes:
      "Currently on scheduled leave. Specialises in massage and wellness treatments.",
  },
];

export default function TherapistsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [specializationFilter, setSpecializationFilter] =
    useState("All");

  const [selectedTherapist, setSelectedTherapist] =
    useState<Therapist | null>(null);

  const [isAddTherapistOpen, setIsAddTherapistOpen] =
    useState(false);

  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        therapist.name.toLowerCase().includes(searchValue) ||
        therapist.email.toLowerCase().includes(searchValue) ||
        therapist.phone.toLowerCase().includes(searchValue) ||
        therapist.id.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        therapist.status === statusFilter;

      const matchesSpecialization =
        specializationFilter === "All" ||
        therapist.specialization === specializationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSpecialization
      );
    });
  }, [search, statusFilter, specializationFilter]);

  const totalTherapists = therapists.length;

  const activeTherapists = therapists.filter(
    (therapist) => therapist.status === "Active"
  ).length;

  const availableToday = therapists.filter(
    (therapist) =>
      therapist.status === "Active" &&
      therapist.availability === "Available today"
  ).length;

  const totalBookings = therapists.reduce(
    (total, therapist) => total + therapist.bookings,
    0
  );

  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">
            Therapists
          </h1>

          <p className="mt-1 text-sm text-purana-brown/60">
            Manage therapists, specializations, schedules and treatment assignments.
          </p>
        </div>

        <button
          onClick={() => setIsAddTherapistOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"
        >
          <Plus size={18} />
          Add Therapist
        </button>
      </div>

      {/* Statistics */}
      <TherapistStats
        totalTherapists={totalTherapists}
        activeTherapists={activeTherapists}
        availableToday={availableToday}
        totalBookings={totalBookings}
      />

      {/* Filters */}
      <TherapistFilters
        search={search}
        statusFilter={statusFilter}
        specializationFilter={specializationFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onSpecializationChange={setSpecializationFilter}
      />

      {/* Table */}
      <TherapistTable
        therapists={filteredTherapists}
        onViewDetails={setSelectedTherapist}
      />

      {/* Results */}
      <div className="mt-4 text-xs text-purana-brown/50">
        Showing {filteredTherapists.length} of{" "}
        {therapists.length} therapists
      </div>

      {/* Details Drawer */}
      {selectedTherapist && (
        <TherapistDetails
          therapist={selectedTherapist}
          onClose={() => setSelectedTherapist(null)}
        />
      )}

      {/* Add Therapist Drawer */}
      {isAddTherapistOpen && (
        <AddTherapist
          onClose={() => setIsAddTherapistOpen(false)}
        />
      )}
    </div>
  );
}