import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAddress } from "@/actions/address.actions";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">Recipient addresses</h1>
      <p className="mt-2 text-gray-500">
        Save delivery addresses for your future shipments.
      </p>

      <form
        action={createAddress}
        className="mt-8 grid gap-4 rounded-xl border p-6 md:grid-cols-2"
      >
        <input
          name="fullName"
          placeholder="Full name"
          required
          className="rounded-md border px-3 py-2"
        />

        <input
          name="phone"
          placeholder="Phone"
          className="rounded-md border px-3 py-2"
        />

        <input
          name="country"
          placeholder="Country"
          required
          className="rounded-md border px-3 py-2"
        />

        <input
          name="city"
          placeholder="City"
          required
          className="rounded-md border px-3 py-2"
        />

        <input
          name="postalCode"
          placeholder="Postal code"
          className="rounded-md border px-3 py-2"
        />

        <input
          name="addressLine1"
          placeholder="Address line"
          required
          className="rounded-md border px-3 py-2"
        />

        <button className="rounded-md bg-black px-4 py-2 text-white md:col-span-2">
          Save address
        </button>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-xl border p-5">
            <p className="font-medium">{address.fullName}</p>
            <p className="mt-1 text-sm text-gray-500">{address.phone || "—"}</p>
            <p className="mt-3 text-sm">
              {address.addressLine1}, {address.city}, {address.country}
            </p>
            <p className="text-sm text-gray-500">
              {address.postalCode || ""}
            </p>
          </div>
        ))}

        {addresses.length === 0 && (
          <p className="text-sm text-gray-500">No addresses yet.</p>
        )}
      </div>
    </main>
  );
}