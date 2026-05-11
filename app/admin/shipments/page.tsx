import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminShipmentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const shipments = await prisma.shipment.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Shipment Management</h1>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4">Shipment</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Parcels</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="border-b">
                <td className="p-4">{shipment.id.slice(0, 8)}</td>
                <td className="p-4">{shipment.user.email}</td>
                <td className="p-4">{shipment.items.length}</td>
                <td className="p-4">{shipment.status}</td>
                <td className="p-4">
                  <Link
                    href={`/admin/shipments/${shipment.id}`}
                    className="underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}