"use client";

import { useMemo, useState } from "react";
import { createShipment } from "@/actions/shipment.actions";

type Parcel = {
  id: string;
  trackingNumber: string;
  description: string | null;
  status: string;
  weightKg: { toString(): string } | string | number | null;
};

type Address = {
  id: string;
  fullName: string;
  city: string;
  country: string;
};

type ShippingMethod = {
  id: string;
  name: string;
};

type CreateShipmentFormProps = {
  parcels: Parcel[];
  addresses: Address[];
  shippingMethods: ShippingMethod[];
  preselectedParcelIds: string[];
};

export function CreateShipmentForm({
  parcels,
  addresses,
  shippingMethods,
  preselectedParcelIds,
}: CreateShipmentFormProps) {
  const [selectedParcelIds, setSelectedParcelIds] =
    useState<string[]>(preselectedParcelIds);

  const selectedParcels = useMemo(() => {
    return parcels.filter((parcel) => selectedParcelIds.includes(parcel.id));
  }, [parcels, selectedParcelIds]);

  const totalWeight = selectedParcels.reduce((sum, parcel) => {
    return sum + Number(parcel.weightKg ?? 0);
  }, 0);

  function toggleParcel(parcelId: string) {
    setSelectedParcelIds((current) =>
      current.includes(parcelId)
        ? current.filter((id) => id !== parcelId)
        : [...current, parcelId]
    );
  }

  return (
    <form action={createShipment} className="space-y-6 pb-28">
      <section className="rounded-3xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-black">Selected parcels</h2>
        <p className="mt-1 text-sm text-gray-500">
          Confirm the parcels you want to combine into one shipment.
        </p>

        <div className="mt-5 space-y-3">
          {parcels.map((parcel) => {
            const selected = selectedParcelIds.includes(parcel.id);

            return (
              <label
                key={parcel.id}
                className={`block cursor-pointer rounded-2xl border p-4 transition ${
                  selected ? "border-black bg-gray-50" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  name="parcelIds"
                  value={parcel.id}
                  checked={selected}
                  onChange={() => toggleParcel(parcel.id)}
                  className="sr-only"
                />

                <div className="flex items-start gap-4">
                  <span
                    className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border ${
                      selected
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Tracking number</p>
                    <p className="mt-1 font-semibold text-black">
                      {parcel.trackingNumber}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      {parcel.description || "No description"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {parcel.status.replaceAll("_", " ")}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {parcel.weightKg
                          ? `${parcel.weightKg.toString()} kg`
                          : "Weight pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}

          {parcels.length === 0 && (
            <div className="rounded-2xl border p-5 text-sm text-gray-500">
              No eligible parcels available.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-black">Recipient address</h2>

        <select
          name="addressId"
          required
          className="mt-4 w-full rounded-xl border px-4 py-3"
        >
          <option value="">Select address</option>

          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.fullName} — {address.city}, {address.country}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-3xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-black">Shipping method</h2>

        <select
          name="shippingMethodId"
          required
          className="mt-4 w-full rounded-xl border px-4 py-3"
        >
          <option value="">Select shipping method</option>

          {shippingMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-3xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-black">Notes</h2>

        <textarea
          name="customerNotes"
          placeholder="Special instructions"
          className="mt-4 min-h-28 w-full rounded-xl border px-4 py-3"
        />
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 md:static md:rounded-3xl md:border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Selected</p>
            <p className="font-semibold text-black">
              {selectedParcelIds.length} parcel
              {selectedParcelIds.length === 1 ? "" : "s"} ·{" "}
              {totalWeight > 0
                ? `${totalWeight.toFixed(2)} kg`
                : "weight pending"}
            </p>
          </div>

          <button
            disabled={selectedParcelIds.length === 0}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white disabled:bg-gray-200 disabled:text-gray-500"
          >
            Create shipment
          </button>
        </div>
      </div>
    </form>
  );
}