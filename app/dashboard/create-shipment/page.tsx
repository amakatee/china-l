import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createShipment } from "@/actions/shipment.actions";

export default async function CreateShipmentPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parcels = await prisma.parcel.findMany({
    where: {
      userId: session.user.id,
      status: {
        in: ["EXPECTED", "ARRIVED_AT_WAREHOUSE", "READY_TO_SHIP"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const shippingMethods = await prisma.shippingMethod.findMany({
    where: {
      isActive: true,
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Create shipment</h1>
      <p className="mt-2 text-gray-500">
        Select parcels, recipient address, and shipping method.
      </p>

      <form action={createShipment} className="mt-8 space-y-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Select parcels</h2>

          <div className="mt-4 space-y-3">
            {parcels.map((parcel) => (
              <label
                key={parcel.id}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <input type="checkbox" name="parcelIds" value={parcel.id} />

                <div>
                  <p className="font-medium">{parcel.trackingNumber}</p>
                  <p className="text-sm text-gray-500">
                    {parcel.description || "No description"}
                  </p>
                </div>
              </label>
            ))}

            {parcels.length === 0 && (
              <p className="text-sm text-gray-500">
                No eligible parcels available.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Recipient address</h2>

          <select
            name="addressId"
            required
            className="mt-4 w-full rounded-md border px-3 py-2"
          >
            <option value="">Select address</option>

            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.fullName} — {address.city}, {address.country}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Shipping method</h2>

          <select
            name="shippingMethodId"
            required
            className="mt-4 w-full rounded-md border px-3 py-2"
          >
            <option value="">Select shipping method</option>

            {shippingMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Notes</h2>

          <textarea
            name="customerNotes"
            placeholder="Special instructions"
            className="mt-4 min-h-28 w-full rounded-md border px-3 py-2"
          />
        </div>

        <button className="rounded-md bg-black px-6 py-3 text-white">
          Create shipment
        </button>
      </form>
    </main>
  );
}