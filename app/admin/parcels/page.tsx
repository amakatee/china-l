import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminParcelsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const parcels = await prisma.parcel.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Parcel Management</h1>
      <p className="mt-2 text-gray-500">
        All customer tracking numbers and warehouse parcels.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4">Tracking</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.id} className="border-b">
                <td className="p-4 font-medium">{parcel.trackingNumber}</td>
                <td className="p-4">{parcel.user.email}</td>
                <td className="p-4">{parcel.description || "—"}</td>
                <td className="p-4">{parcel.status}</td>
                <td className="p-4">
                  {parcel.createdAt.toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/parcels/${parcel.id}`}
                    className="underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}

            {parcels.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No parcels yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}