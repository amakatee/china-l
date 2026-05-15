import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ShipmentsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function getStatusLabel(status: string) {
  if (status === "REQUESTED") return "Packing";
  if (status === "AWAITING_PAYMENT") return "Awaiting payment";
  if (status === "SHIPPED") return "Shipped";
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELLED") return "Cancelled";
  return status.replaceAll("_", " ");
}

function getStatusClass(status: string) {
  if (status === "REQUESTED") return "bg-gray-100 text-gray-700";
  if (status === "AWAITING_PAYMENT") return "bg-yellow-50 text-yellow-700";
  if (status === "SHIPPED") return "bg-green-50 text-green-700";
  if (status === "DELIVERED") return "bg-emerald-50 text-emerald-700";
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function getTabHref(status: string) {
  if (status === "all") return "/dashboard/shipments";
  return `/dashboard/shipments?status=${status}`;
}

export default async function ShipmentsPage({
  searchParams,
}: ShipmentsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { status } = await searchParams;
  const activeStatus = status ?? "all";

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

  const filteredShipments = shipments.filter((shipment) => {
    if (activeStatus === "all") return true;
    if (activeStatus === "packing") return shipment.status === "REQUESTED";
    if (activeStatus === "payment") {
      return shipment.status === "AWAITING_PAYMENT";
    }
    if (activeStatus === "shipped") return shipment.status === "SHIPPED";
    if (activeStatus === "delivered") return shipment.status === "DELIVERED";

    return true;
  });

  const packingCount = shipments.filter((s) => s.status === "REQUESTED").length;
  const paymentCount = shipments.filter(
    (s) => s.status === "AWAITING_PAYMENT"
  ).length;
  const shippedCount = shipments.filter((s) => s.status === "SHIPPED").length;
  const deliveredCount = shipments.filter(
    (s) => s.status === "DELIVERED"
  ).length;

  const tabs = [
    { label: "All", value: "all", count: shipments.length },
    { label: "Packing", value: "packing", count: packingCount },
    { label: "Payment", value: "payment", count: paymentCount },
    { label: "Shipped", value: "shipped", count: shippedCount },
    { label: "Delivered", value: "delivered", count: deliveredCount },
  ];

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Shipments</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">
              My shipments
            </h1>
            <p className="mt-2 text-gray-600">
              Manage packing, payment, shipping and delivery.
            </p>
          </div>

          <Link
            href="/dashboard/parcels?status=ready"
            className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Pack parcels
          </Link>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
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

      <section className="mt-6 grid gap-4">
        {filteredShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="rounded-3xl border bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Shipment</p>
                <h2 className="mt-1 text-xl font-semibold text-black">
                  {shipment.id.slice(0, 8)}
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                  shipment.status
                )}`}
              >
                {getStatusLabel(shipment.status)}
              </span>
            </div>

            <div className="mt-6 grid gap-4 text-sm md:grid-cols-4">
              <div>
                <p className="text-gray-500">Parcels</p>
                <p className="mt-1 font-medium text-black">
                  {shipment.items.length}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Price</p>
                <p className="mt-1 font-medium text-black">
                  {shipment.finalPrice
                    ? `${shipment.finalPrice.toString()} ${shipment.currency}`
                    : "Pending"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Created</p>
                <p className="mt-1 font-medium text-black">
                  {shipment.createdAt.toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <p className="mt-1 font-medium text-black">
                  {getStatusLabel(shipment.status)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {shipment.status === "AWAITING_PAYMENT" && (
                <Link
                  href={`/dashboard/payment/${shipment.id}`}
                  className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
                >
                  Pay now
                </Link>
              )}

              <Link
                href={`/dashboard/shipments/${shipment.id}`}
                className="rounded-xl border px-5 py-3 text-sm font-medium text-black"
              >
                View details
              </Link>
            </div>
          </div>
        ))}

        {filteredShipments.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No shipments in this category
            </h2>

            <p className="mt-2 text-gray-600">
              Select ready parcels and proceed to packing.
            </p>

            <Link
              href="/dashboard/parcels?status=ready"
              className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Pack parcels
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}