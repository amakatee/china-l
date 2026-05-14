import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function WarehousePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const warehouses = await prisma.warehouse.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div>
        <h1 className="text-2xl font-semibold">Warehouse addresses</h1>
        <p className="mt-2 text-gray-500">
          Use these addresses when ordering from Chinese marketplaces.
        </p>
      </div>

      <div className="mt-8 rounded-xl border bg-yellow-50 p-5">
        <p className="text-sm">
          <span className="font-semibold">Your customer code:</span>{" "}
          {session.user.email}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Include this identifier in recipient name or order notes so warehouse
          staff can match your parcels.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{warehouse.name}</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                {warehouse.type}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p>{warehouse.addressLine}</p>
              <p>
                {warehouse.city}, {warehouse.country}
              </p>
              <p>{warehouse.postalCode || "—"}</p>
              <p>{warehouse.phone || "—"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="font-semibold">Shipping guidance</h2>

        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>• AIR = faster delivery, higher price</li>
          <li>• SEA CARGO = cheaper, slower delivery</li>
          <li>• Batteries/restricted items usually require SEA CARGO</li>
          <li>• Always include your customer code</li>
        </ul>
      </div>
    </main>
  );
}