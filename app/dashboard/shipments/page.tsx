import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ShipmentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const shipments = await prisma.shipment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My shipments</h1>
          <p className="text-gray-500">Your shipment requests.</p>
        </div>

        <Link
          href="/dashboard/create-shipment"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Create shipment
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4">Shipment</th>
              <th className="p-4">Parcels</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="border-b">
                <td className="p-4">
                  <Link
                    href={`/dashboard/shipments/${shipment.id}`}
                    className="font-medium underline"
                  >
                    {shipment.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="p-4">{shipment.items.length}</td>
                <td className="p-4">{shipment.status}</td>
                <td className="p-4">
                  {shipment.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}

            {shipments.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  No shipments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}