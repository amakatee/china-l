import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const [
    expectedParcels,
    arrivedParcels,
    checkingParcels,
    readyParcels,
    problemParcels,
    requestedShipments,
    awaitingPaymentShipments,
    shippedWithoutTracking,
    deliveredShipments,
    openTickets,
    recentParcels,
    recentShipments,
  ] = await Promise.all([
    prisma.parcel.count({ where: { status: "EXPECTED" } }),
    prisma.parcel.count({ where: { status: "ARRIVED_AT_WAREHOUSE" } }),
    prisma.parcel.count({ where: { status: "CHECKING" } }),
    prisma.parcel.count({ where: { status: "READY_TO_SHIP" } }),
    prisma.parcel.count({ where: { status: "PROBLEM" } }),

    prisma.shipment.count({ where: { status: "REQUESTED" } }),
    prisma.shipment.count({ where: { status: "AWAITING_PAYMENT" } }),
    prisma.shipment.count({
      where: {
        status: "SHIPPED",
        internationalTrackingNumber: null,
      },
    }),
    prisma.shipment.count({ where: { status: "DELIVERED" } }),

    prisma.supportTicket.count({
      where: {
        status: {
          not: "CLOSED",
        },
      },
    }),

    prisma.parcel.findMany({
      take: 5,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.shipment.findMany({
      take: 5,
      include: {
        user: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const urgentCards = [
    {
      label: "Need checking",
      value: checkingParcels,
      href: "/admin/parcels?status=CHECKING",
      description: "Parcels waiting for inspection",
    },
    {
      label: "Awaiting payment",
      value: awaitingPaymentShipments,
      href: "/admin/shipments?status=AWAITING_PAYMENT",
      description: "Priced shipments waiting for customer payment",
    },
    {
      label: "Need tracking",
      value: shippedWithoutTracking,
      href: "/admin/shipments?status=SHIPPED",
      description: "Shipped orders missing tracking numbers",
    },
    {
      label: "Open support",
      value: openTickets,
      href: "/admin/support?status=OPEN",
      description: "Customer tickets needing attention",
    },
  ];

  const warehouseCards = [
    {
      label: "Expected",
      value: expectedParcels,
      href: "/admin/parcels?status=EXPECTED",
    },
    {
      label: "Arrived",
      value: arrivedParcels,
      href: "/admin/parcels?status=ARRIVED_AT_WAREHOUSE",
    },
    {
      label: "Ready",
      value: readyParcels,
      href: "/admin/parcels?status=READY_TO_SHIP",
    },
    {
      label: "Problem",
      value: problemParcels,
      href: "/admin/parcels?status=PROBLEM",
    },
  ];

  const shipmentCards = [
    {
      label: "Packing",
      value: requestedShipments,
      href: "/admin/shipments?status=REQUESTED",
    },
    {
      label: "Payment",
      value: awaitingPaymentShipments,
      href: "/admin/shipments?status=AWAITING_PAYMENT",
    },
    {
      label: "Need tracking",
      value: shippedWithoutTracking,
      href: "/admin/shipments?status=SHIPPED",
    },
    {
      label: "Delivered",
      value: deliveredShipments,
      href: "/admin/shipments?status=DELIVERED",
    },
  ];

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Admin</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Operations dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Monitor warehouse intake, shipment pricing, payment status, tracking,
          and support.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {urgentCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-3xl border bg-white p-5 transition hover:shadow-md"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-4xl font-semibold text-black">
              {card.value}
            </p>
            <p className="mt-3 text-sm text-gray-600">{card.description}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-black">
                Warehouse flow
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Parcel intake and inspection status.
              </p>
            </div>

            <Link
              href="/admin/parcels"
              className="rounded-xl border px-4 py-2 text-sm"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {warehouseCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-2xl border p-4"
              >
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {card.value}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-black">
                Shipment flow
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Packing, payment, tracking and delivery.
              </p>
            </div>

            <Link
              href="/admin/shipments"
              className="rounded-xl border px-4 py-2 text-sm"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {shipmentCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-2xl border p-4"
              >
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {card.value}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6">
          <h2 className="text-xl font-semibold text-black">Recent parcels</h2>

          <div className="mt-5 grid gap-3">
            {recentParcels.map((parcel) => (
              <Link
                key={parcel.id}
                href={`/admin/parcels/${parcel.id}`}
                className="rounded-2xl border p-4 transition hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-black">
                      {parcel.trackingNumber}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {parcel.user.name || parcel.user.email}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">
                    {parcel.status.replaceAll("_", " ")}
                  </span>
                </div>
              </Link>
            ))}

            {recentParcels.length === 0 && (
              <p className="text-sm text-gray-500">No parcels yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <h2 className="text-xl font-semibold text-black">
            Recent shipments
          </h2>

          <div className="mt-5 grid gap-3">
            {recentShipments.map((shipment) => (
              <Link
                key={shipment.id}
                href={`/admin/shipments/${shipment.id}`}
                className="rounded-2xl border p-4 transition hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-black">
                      {shipment.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {shipment.user.name || shipment.user.email}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">
                    {shipment.items.length} parcels ·{" "}
                    {shipment.status.replaceAll("_", " ")}
                  </span>
                </div>
              </Link>
            ))}

            {recentShipments.length === 0 && (
              <p className="text-sm text-gray-500">No shipments yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/parcels"
          className="rounded-3xl border bg-white p-6 transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-black">Parcel intake</h2>
          <p className="mt-2 text-gray-600">
            Receive parcels, add measurements, and mark items ready to pack.
          </p>
        </Link>

        <Link
          href="/admin/shipments"
          className="rounded-3xl border bg-white p-6 transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-black">Shipments</h2>
          <p className="mt-2 text-gray-600">
            Price shipments, verify payment, add tracking, and update delivery.
          </p>
        </Link>

        <Link
          href="/admin/support"
          className="rounded-3xl border bg-white p-6 transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-black">Support</h2>
          <p className="mt-2 text-gray-600">
            Reply to customer questions and manage ticket statuses.
          </p>
        </Link>
      </section>
    </main>
  );
}