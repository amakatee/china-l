import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/address.actions";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Addresses</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Recipient addresses
        </h1>

        <p className="mt-2 text-gray-600">
          Save delivery addresses for future shipments.
        </p>
        
      </section>

      <form
        action={createAddress}
        className="mt-6 grid gap-4 rounded-3xl border bg-white p-6 md:grid-cols-2"
      >
        <input
          name="fullName"
          placeholder="Full name"
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="country"
          placeholder="Country"
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="city"
          placeholder="City"
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="postalCode"
          placeholder="Postal code"
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="addressLine1"
          placeholder="Address line"
          required
          className="rounded-xl border px-4 py-3"
        />

        <button className="rounded-xl bg-black px-5 py-3 text-white md:col-span-2">
          Save address
        </button>
      </form>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-3xl border bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-black">
                  {address.fullName}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {address.phone || "—"}
                </p>
              </div>

              {address.isDefault && (
                <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                  Default
                </span>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                {address.addressLine1}
              </p>

              <p>
                {address.city}, {address.country}
              </p>

              <p>{address.postalCode || "—"}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {!address.isDefault && (
                <form action={setDefaultAddress}>
                  <input
                    type="hidden"
                    name="addressId"
                    value={address.id}
                  />

                  <button className="rounded-xl border px-4 py-2 text-sm font-medium">
                    Set default
                  </button>
                </form>
              )}

              <form action={deleteAddress}>
                <input
                  type="hidden"
                  name="addressId"
                  value={address.id}
                />

                <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600">
                  Delete
                </button>
                <a
  href={`/dashboard/addresses/${address.id}/edit`}
  className="rounded-xl border px-4 py-2 text-sm font-medium"
>
  Edit
</a>
              </form>
            </div>
          </div>
        ))}
        

        {addresses.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No addresses yet
            </h2>

            <p className="mt-2 text-gray-600">
              Save your first delivery address.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}