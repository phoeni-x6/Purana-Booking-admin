"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import TreatmentStats from "@/components/treatments/TreatmentStats";
import TreatmentFilters from "@/components/treatments/TreatmentFilters";
import TreatmentTable, {
  type Treatment,
} from "@/components/treatments/TreatmentTable";
import TreatmentDetails from "@/components/treatments/TreatmentDetails";
import AddTreatment from "@/components/treatments/AddTreatment";

const treatments: Treatment[] = [
  {
    id: "TRT-1001",
    name: "Ayurvedic Full Body Massage",
    category: "Massage",
    duration: "60 min",
    price: "€85",
    description:
      "A traditional Ayurvedic full-body massage using warm herbal oils to promote relaxation, circulation and overall wellbeing.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 3,
    bookings: 42,
  },
  {
    id: "TRT-1002",
    name: "Abhyanga Massage",
    category: "Massage",
    duration: "75 min",
    price: "€65",
    description:
      "A deeply relaxing Ayurvedic oil massage designed to support circulation, relaxation and balance.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 3,
    bookings: 36,
  },
  {
    id: "TRT-1003",
    name: "Shirodhara",
    category: "Shirodhara",
    duration: "60 min",
    price: "€70",
    description:
      "A traditional Ayurvedic treatment where warm herbal oil is gently poured over the forehead to encourage deep relaxation.",
    status: "Active",
    availability: "Available Monday – Friday",
    therapists: 2,
    bookings: 29,
  },
  {
    id: "TRT-1004",
    name: "Ayurveda Consultation",
    category: "Consultation",
    duration: "45 min",
    price: "€60",
    description:
      "A personalised consultation with an Ayurvedic practitioner to discuss wellbeing, lifestyle and treatment recommendations.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 2,
    bookings: 21,
  },
  {
    id: "TRT-1005",
    name: "Pinda Sweda",
    category: "Therapy",
    duration: "60 min",
    price: "€90",
    description:
      "A traditional herbal bolus treatment combining therapeutic herbs and warm oils for a restorative experience.",
    status: "Active",
    availability: "Available Tuesday – Saturday",
    therapists: 2,
    bookings: 18,
  },
  {
    id: "TRT-1006",
    name: "Head & Shoulder Massage",
    category: "Massage",
    duration: "30 min",
    price: "€45",
    description:
      "A focused massage targeting the head, neck and shoulders to reduce tension and encourage relaxation.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 3,
    bookings: 31,
  },
  {
    id: "TRT-1007",
    name: "Foot Reflexology",
    category: "Wellness",
    duration: "45 min",
    price: "€55",
    description:
      "A relaxing foot treatment using targeted pressure techniques to support relaxation and wellbeing.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 2,
    bookings: 24,
  },
  {
    id: "TRT-1008",
    name: "Yoga Session",
    category: "Yoga",
    duration: "60 min",
    price: "€40",
    description:
      "A guided yoga session adapted to the guest's experience level, focusing on movement, breathing and relaxation.",
    status: "Active",
    availability: "Available Monday – Friday",
    therapists: 2,
    bookings: 17,
  },
  {
    id: "TRT-1009",
    name: "Meditation & Breathwork",
    category: "Wellness",
    duration: "30 min",
    price: "€35",
    description:
      "A guided session combining meditation and breathing techniques to support calmness and mental relaxation.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 2,
    bookings: 15,
  },
  {
    id: "TRT-1010",
    name: "Herbal Steam Bath",
    category: "Therapy",
    duration: "45 min",
    price: "€50",
    description:
      "A traditional herbal steam experience designed to promote relaxation and complement Ayurvedic treatments.",
    status: "Inactive",
    availability: "Currently unavailable",
    therapists: 1,
    bookings: 9,
  },
  {
    id: "TRT-1011",
    name: "Ayurvedic Facial",
    category: "Wellness",
    duration: "60 min",
    price: "€65",
    description:
      "A gentle Ayurvedic facial using natural products to cleanse, nourish and refresh the skin.",
    status: "Active",
    availability: "Available Monday – Saturday",
    therapists: 2,
    bookings: 13,
  },
];

export default function TreatmentsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedTreatment, setSelectedTreatment] =
    useState<Treatment | null>(null);

  const [isAddTreatmentOpen, setIsAddTreatmentOpen] =
    useState(false);

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        treatment.name.toLowerCase().includes(searchValue) ||
        treatment.category.toLowerCase().includes(searchValue) ||
        treatment.id.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        treatment.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        treatment.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [search, categoryFilter, statusFilter]);

  const totalTreatments = treatments.length;

  const activeTreatments = treatments.filter(
    (treatment) => treatment.status === "Active"
  ).length;

  const categories = new Set(
    treatments.map((treatment) => treatment.category)
  ).size;

  const averagePrice =
    treatments.reduce((total, treatment) => {
      return (
        total +
        Number(treatment.price.replace("€", ""))
      );
    }, 0) / treatments.length;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-purana-cream p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-purana-green sm:text-3xl">
            Treatments
          </h1>

          <p className="mt-1 text-sm text-purana-brown/60">
            Manage Ayurveda treatments, pricing, availability and therapists.
          </p>
        </div>

        <button
          onClick={() => setIsAddTreatmentOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purana-green px-4 py-3 text-sm font-medium text-white transition hover:bg-purana-green/90"
        >
          <Plus size={18} />
          Add Treatment
        </button>
      </div>

      {/* Statistics */}
      <TreatmentStats
        totalTreatments={totalTreatments}
        activeTreatments={activeTreatments}
        categories={categories}
        averagePrice={`€${averagePrice.toFixed(0)}`}
      />

      {/* Filters */}
      <TreatmentFilters
        search={search}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Table */}
      <TreatmentTable
        treatments={filteredTreatments}
        onViewDetails={setSelectedTreatment}
      />

      {/* Results */}
      <div className="mt-4 text-xs text-purana-brown/50">
        Showing {filteredTreatments.length} of{" "}
        {treatments.length} treatments
      </div>

      {/* Treatment Details */}
      {selectedTreatment && (
        <TreatmentDetails
          treatment={selectedTreatment}
          onClose={() => setSelectedTreatment(null)}
        />
      )}

      {/* Add Treatment */}
      {isAddTreatmentOpen && (
        <AddTreatment
          onClose={() => setIsAddTreatmentOpen(false)}
        />
      )}
    </div>
  );
}