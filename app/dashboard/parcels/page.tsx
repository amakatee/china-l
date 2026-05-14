import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ParcelsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parcels = await prisma.parcel.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My parcels</h1>
          <p className="text-gray-500">Track incoming warehouse parcels.</p>
        </div>

        <Link
          href="/dashboard/add-parcel"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Add parcel
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4">Tracking</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4">Weight</th>
              <th className="p-4">Size</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.id} className="border-b">
                <td className="p-4 font-medium">
                  <Link
                    href={`/dashboard/parcels/${parcel.id}`}
                    className="underline"
                  >
                    {parcel.trackingNumber}
                  </Link>
                </td>

                <td className="p-4">{parcel.description || "—"}</td>
                <td className="p-4">{parcel.status.replaceAll("_", " ")}</td>

                <td className="p-4">
                  {parcel.weightKg ? `${parcel.weightKg.toString()} kg` : "—"}
                </td>

                <td className="p-4">
                  {parcel.lengthCm && parcel.widthCm && parcel.heightCm
                    ? `${parcel.lengthCm.toString()} × ${parcel.widthCm.toString()} × ${parcel.heightCm.toString()} cm`
                    : "—"}
                </td>

                <td className="p-4">
                  {parcel.createdAt.toLocaleDateString()}
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