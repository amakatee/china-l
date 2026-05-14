import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ParcelDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ParcelDetailPage({
  params,
}: ParcelDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const parcel = await prisma.parcel.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      shipmentItems: {
        include: {
          shipment: true,
        },
      },
    },
  });

  if (!parcel) {
    notFound();
  }

  const shipment = parcel.shipmentItems[0]?.shipment;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div>
        <p className="text-sm text-gray-500">Parcel</p>
        <h1 className="text-2xl font-semibold">{parcel.trackingNumber}</h1>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Tracking status</h2>

        <p className="mt-3 text-gray-700">
          {parcel.status.replaceAll("_", " ")}
        </p>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Parcel details</h2>

        <div className="mt-4 grid gap-3 text-sm">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {parcel.description || "—"}
          </p>

          <p>
            <span className="font-medium">Weight:</span>{" "}
            {parcel.weightKg ? `${parcel.weightKg.toString()} kg` : "Pending"}
          </p>

          <p>
            <span className="font-medium">Dimensions:</span>{" "}
            {parcel.lengthCm && parcel.widthCm && parcel.heightCm
              ? `${parcel.lengthCm} × ${parcel.widthCm} × ${parcel.heightCm} cm`
              : "Pending"}
          </p>

          <p>
            <span className="font-medium">Battery:</span>{" "}
            {parcel.hasBattery ? "Yes" : "No"}
          </p>

          <p>
            <span className="font-medium">Restricted:</span>{" "}
            {parcel.isRestricted ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {parcel.operatorNotes && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Warehouse notes</h2>
          <p className="mt-3 text-gray-700">{parcel.operatorNotes}</p>
        </div>
      )}

      {shipment && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Shipment</h2>

          <Link
            href={`/dashboard/shipments/${shipment.id}`}
            className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-white"
          >
            Open shipment
          </Link>
        </div>
      )}
    </main>
  );
}