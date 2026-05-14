"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Parcel = {
  id: string;
  trackingNumber: string;
  description: string | null;
  status: string;
  weightKg: string | null;
  lengthCm: string | null;
  widthCm: string | null;
  heightCm: string | null;
  createdAt: string;
};

type Props = {
  parcels: Parcel[];
};

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusClass(status: string) {
  if (status === "READY_TO_SHIP") return "bg-green-50 text-green-700";
  if (status === "ARRIVED_AT_WAREHOUSE") return "bg-blue-50 text-blue-700";
  if (status === "IN_SHIPMENT") return "bg-purple-50 text-purple-700";
  if (status === "PROBLEM") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export function ParcelPickerList({ parcels }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedParcels = useMemo(
    () => parcels.filter((parcel) => selectedIds.includes(parcel.id)),
    [parcels, selectedIds]
  );

  const totalWeight = selectedParcels.reduce((sum, parcel) => {
    return sum + Number(parcel.weightKg ?? 0);
  }, 0);

  function toggleParcel(parcelId: string) {
    setSelectedIds((current) =>
      current.includes(parcelId)
        ? current.filter((id) => id !== parcelId)
        : [...current, parcelId]
    );
  }

  const proceedHref =
    selectedIds.length > 0
      ? `/dashboard/create-shipment?parcelIds=${selectedIds.join(",")}`
      : "/dashboard/parcels";

  return (
    <>
      <section className="mt-6 grid gap-4 pb-28">
        {parcels.map((parcel) => {
          const selected = selectedIds.includes(parcel.id);

          return (
            <div
              key={parcel.id}
              className={`rounded-3xl border bg-white p-5 transition ${
                selected ? "border-black" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/dashboard/parcels/${parcel.id}`}
                  className="min-w-0 flex-1"
                >
                  <p className="text-sm text-gray-500">Tracking number</p>
                  <h2 className="mt-1 text-lg font-semibold text-black">
                    {parcel.trackingNumber}
                  </h2>
                </Link>

                <button
                  type="button"
                  onClick={() => toggleParcel(parcel.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selected ? "✓" : ""}
                </button>
              </div>

              <div className="mt-4 flex justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    parcel.status
                  )}`}
                >
                  {getStatusLabel(parcel.status)}
                </span>

                <p className="text-sm text-gray-500">
                  {parcel.weightKg ? `${parcel.weightKg} kg` : "Weight pending"}
                </p>
              </div>

              <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="mt-1 font-medium text-black">
                    {parcel.description || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="mt-1 font-medium text-black">
                    {parcel.lengthCm && parcel.widthCm && parcel.heightCm
                      ? `${parcel.lengthCm} × ${parcel.widthCm} × ${parcel.heightCm} cm`
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="mt-1 font-medium text-black">
                    {new Date(parcel.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Selected</p>
            <p className="font-semibold text-black">
              {selectedIds.length} parcel{selectedIds.length === 1 ? "" : "s"} ·{" "}
              {totalWeight > 0 ? `${totalWeight.toFixed(2)} kg` : "weight pending"}
            </p>
          </div>

          <Link
            href={proceedHref}
            className={`rounded-xl px-5 py-3 text-sm font-medium ${
              selectedIds.length > 0
                ? "bg-black text-white"
                : "pointer-events-none bg-gray-200 text-gray-500"
            }`}
          >
            Proceed to packing
          </Link>
        </div>
      </div>
    </>
  );
}