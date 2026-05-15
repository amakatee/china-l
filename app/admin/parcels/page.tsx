import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusClass(status: string) {
  if (status === "READY_TO_SHIP") return "bg-green-50 text-green-700";
  if (status === "ARRIVED_AT_WAREHOUSE") return "bg-blue-50 text-blue-700";
  if (status === "CHECKING") return "bg-yellow-50 text-yellow-700";
  if (status === "IN_SHIPMENT") return "bg-purple-50 text-purple-700";
  if (status === "PROBLEM") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
}

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

  const expectedCount = parcels.filter((p) => p.status === "EXPECTED").length;
  const arrivedCount = parcels.filter(
    (p) => p.status === "ARRIVED_AT_WAREHOUSE"
  ).length;
  const checkingCount = parcels.filter((p) => p.status === "CHECKING").length;
  const readyCount = parcels.filter((p) => p.status === "READY_TO_SHIP").length;
  const problemCount = parcels.filter((p) => p.status === "PROBLEM").length;

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Warehouse operations</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Parcel management
        </h1>

        <p className="mt-2 text-gray-600">
          Receive parcels, check items, add warehouse measurements, and mark
          parcels ready for packing.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Expected</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {expectedCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Arrived</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {arrivedCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Checking</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {checkingCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Ready</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {readyCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Problem</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {problemCount}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {parcels.map((parcel) => (
          <div
            key={parcel.id}
            className="rounded-3xl border bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Tracking number</p>
                <h2 className="mt-1 text-lg font-semibold text-black">
                  {parcel.trackingNumber}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Customer: {parcel.user.email}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                  parcel.status
                )}`}
              >
                {getStatusLabel(parcel.status)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 text-sm md:grid-cols-5">
              <div>
                <p className="text-gray-500">Description</p>
                <p className="mt-1 font-medium text-black">
                  {parcel.description || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Weight</p>
                <p className="mt-1 font-medium text-black">
                  {parcel.weightKg ? `${parcel.weightKg.toString()} kg` : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Size</p>
                <p className="mt-1 font-medium text-black">
                  {parcel.lengthCm && parcel.widthCm && parcel.heightCm
                    ? `${parcel.lengthCm.toString()} × ${parcel.widthCm.toString()} × ${parcel.heightCm.toString()} cm`
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Flags</p>
                <p className="mt-1 font-medium text-black">
                  {parcel.hasBattery || parcel.isRestricted
                    ? [
                        parcel.hasBattery ? "Battery" : null,
                        parcel.isRestricted ? "Restricted" : null,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Created</p>
                <p className="mt-1 font-medium text-black">
                  {parcel.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                href={`/admin/parcels/${parcel.id}`}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Open parcel
              </Link>
            </div>
          </div>
        ))}

        {parcels.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No parcels yet
            </h2>
            <p className="mt-2 text-gray-600">
              Customer tracking numbers will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}