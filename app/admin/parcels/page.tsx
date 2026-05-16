import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusClass(status: string) {
  if (status === "READY_TO_SHIP") return "bg-green-50 text-green-700";
  if (status === "ARRIVED_AT_WAREHOUSE") return "bg-blue-50 text-blue-700";
  if (status === "CHECKING") return "bg-yellow-50 text-yellow-700";
  if (status === "PROBLEM") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function getTabHref(status: string, q: string) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (q) {
    params.set("q", q);
  }

  const query = params.toString();

  return query ? `/admin/parcels?${query}` : "/admin/parcels";
}

export default async function AdminParcelsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const { status, q } = await searchParams;
  const activeStatus = status ?? "all";
  const searchQuery = q?.trim() ?? "";

  const parcels = await prisma.parcel.findMany({
    include: {
      user: true,
    },
    where: {
      ...(searchQuery
        ? {
            OR: [
              {
                trackingNumber: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                user: {
                  email: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                user: {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredParcels = parcels.filter((parcel) => {
    if (activeStatus === "all") return true;
    return parcel.status === activeStatus;
  });

  const tabs = [
    {
      label: "All",
      value: "all",
      count: parcels.length,
    },
    {
      label: "Expected",
      value: "EXPECTED",
      count: parcels.filter((p) => p.status === "EXPECTED").length,
    },
    {
      label: "Arrived",
      value: "ARRIVED_AT_WAREHOUSE",
      count: parcels.filter((p) => p.status === "ARRIVED_AT_WAREHOUSE").length,
    },
    {
      label: "Checking",
      value: "CHECKING",
      count: parcels.filter((p) => p.status === "CHECKING").length,
    },
    {
      label: "Ready",
      value: "READY_TO_SHIP",
      count: parcels.filter((p) => p.status === "READY_TO_SHIP").length,
    },
    {
      label: "Problem",
      value: "PROBLEM",
      count: parcels.filter((p) => p.status === "PROBLEM").length,
    },
  ];

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Warehouse operations</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Parcel management
        </h1>

        <p className="mt-2 text-gray-600">
          Receive parcels, check items, add warehouse measurements, and manage parcel flow.
        </p>
      </section>

      <form className="mt-6 rounded-3xl border bg-white p-5">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery}
          placeholder="Search tracking, customer email, name, description..."
          className="w-full rounded-xl border px-4 py-3"
        />
      </form>

      <section className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={getTabHref(tab.value, searchQuery)}
            className={`rounded-full border px-4 py-2 text-sm ${
              activeStatus === tab.value
                ? "border-black bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4">
        {filteredParcels.map((parcel) => (
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
                  Customer: {parcel.user.name || parcel.user.email}
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
                    ? `${parcel.lengthCm} × ${parcel.widthCm} × ${parcel.heightCm} cm`
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

        {filteredParcels.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No parcels found
            </h2>

            <p className="mt-2 text-gray-600">
              Try another search or filter.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}