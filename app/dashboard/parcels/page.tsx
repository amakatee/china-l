import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ParcelPickerList } from "@/components/parcels/parcel-picker-list";

type ParcelsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function getTabHref(status: string) {
  if (status === "all") return "/dashboard/parcels";
  return `/dashboard/parcels?status=${status}`;
}

export default async function ParcelsPage({ searchParams }: ParcelsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { status } = await searchParams;
  const activeStatus = status ?? "all";

  const parcels = await prisma.parcel.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredParcels = parcels.filter((parcel) => {
    if (activeStatus === "all") return true;
    if (activeStatus === "expected") return parcel.status === "EXPECTED";
    if (activeStatus === "warehouse") {
      return ["ARRIVED_AT_WAREHOUSE", "CHECKING"].includes(parcel.status);
    }
    if (activeStatus === "ready") return parcel.status === "READY_TO_SHIP";

    return true;
  });

  const expectedCount = parcels.filter((p) => p.status === "EXPECTED").length;
  const warehouseCount = parcels.filter((p) =>
    ["ARRIVED_AT_WAREHOUSE", "CHECKING"].includes(p.status)
  ).length;
  const readyCount = parcels.filter((p) => p.status === "READY_TO_SHIP").length;

  const tabs = [
    { label: "All", value: "all", count: parcels.length },
    { label: "Expected", value: "expected", count: expectedCount },
    { label: "Warehouse", value: "warehouse", count: warehouseCount },
    { label: "Ready", value: "ready", count: readyCount },
  ];

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Parcels</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">
              My parcels
            </h1>
            <p className="mt-2 text-gray-600">
              Select parcels and proceed to packing.
            </p>
          </div>

          <Link
            href="/dashboard/add-parcel"
            className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Add parcel
          </Link>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={getTabHref(tab.value)}
            className={`rounded-2xl border p-4 ${
              activeStatus === tab.value
                ? "border-black bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            <p
              className={`text-sm ${
                activeStatus === tab.value ? "text-gray-200" : "text-gray-500"
              }`}
            >
              {tab.label}
            </p>
            <p className="mt-1 text-2xl font-semibold">{tab.count}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={getTabHref(tab.value)}
              className={`rounded-full border px-4 py-2 text-sm ${
                activeStatus === tab.value
                  ? "border-black bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      {filteredParcels.length > 0 ? (
        <ParcelPickerList
          parcels={filteredParcels.map((parcel) => ({
            id: parcel.id,
            trackingNumber: parcel.trackingNumber,
            description: parcel.description,
            status: parcel.status,
            weightKg: parcel.weightKg?.toString() ?? null,
            lengthCm: parcel.lengthCm?.toString() ?? null,
            widthCm: parcel.widthCm?.toString() ?? null,
            heightCm: parcel.heightCm?.toString() ?? null,
            createdAt: parcel.createdAt.toISOString(),
          }))}
        />
      ) : (
        <section className="mt-6">
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No parcels in this category
            </h2>
            <p className="mt-2 text-gray-600">
              Try another filter or add a new tracking number.
            </p>

            <Link
              href="/dashboard/add-parcel"
              className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Add parcel
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}