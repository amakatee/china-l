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
    awaitingPaymentShipments,
    shippedWithoutTracking,
    openTickets,
  ] = await Promise.all([
    prisma.parcel.count({ where: { status: "EXPECTED" } }),
    prisma.parcel.count({ where: { status: "ARRIVED_AT_WAREHOUSE" } }),
    prisma.parcel.count({ where: { status: "CHECKING" } }),
    prisma.parcel.count({ where: { status: "READY_TO_SHIP" } }),
    prisma.shipment.count({ where: { status: "AWAITING_PAYMENT" } }),
    prisma.shipment.count({
      where: {
        status: "SHIPPED",
        internationalTrackingNumber: null,
      },
    }),
    prisma.supportTicket.count({
      where: {
        status: {
          not: "CLOSED",
        },
      },
    }),
  ]);

  const cards = [
    {
      label: "Expected parcels",
      value: expectedParcels,
      href: "/admin/parcels",
    },
    {
      label: "Arrived at warehouse",
      value: arrivedParcels,
      href: "/admin/parcels",
    },
    {
      label: "Need checking",
      value: checkingParcels,
      href: "/admin/parcels",
    },
    {
      label: "Ready to ship",
      value: readyParcels,
      href: "/admin/parcels",
    },
    {
      label: "Awaiting payment",
      value: awaitingPaymentShipments,
      href: "/admin/shipments",
    },
    {
      label: "Need tracking number",
      value: shippedWithoutTracking,
      href: "/admin/shipments",
    },
    {
      label: "Open support tickets",
      value: openTickets,
      href: "/admin/support",
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
          Monitor warehouse intake, shipments, payments, tracking, and support.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-black">
              {card.value}
            </p>
          </Link>
        ))}
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