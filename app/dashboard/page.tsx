import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard");

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [parcelCount, shipmentCount, supportCount] = await Promise.all([
    prisma.parcel.count({
      where: { userId: session.user.id },
    }),
    prisma.shipment.count({
      where: { userId: session.user.id },
    }),
    prisma.supportTicket.count({
      where: {
        userId: session.user.id,
        status: { not: "CLOSED" },
      },
    }),
  ]);

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6 md:p-8">
        <p className="text-sm text-gray-500">{t("label")}</p>

        <h1 className="mt-3 text-3xl font-bold text-black md:text-5xl">
          {t("welcome")}
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">{t("description")}</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">{t("parcels")}</p>
          <p className="mt-2 text-3xl font-semibold text-black">
            {parcelCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">{t("shipments")}</p>
          <p className="mt-2 text-3xl font-semibold text-black">
            {shipmentCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">{t("openSupport")}</p>
          <p className="mt-2 text-3xl font-semibold text-black">
            {supportCount}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/parcels"
          className="rounded-3xl border bg-white p-8 transition hover:shadow-md"
        >
          <h2 className="text-2xl font-semibold text-black">
            {t("myParcels")}
          </h2>

          <p className="mt-3 text-gray-600">
            {t("myParcelsDescription")}
          </p>
        </Link>

        <Link
          href="/dashboard/create-shipment"
          className="rounded-3xl border bg-white p-8 transition hover:shadow-md"
        >
          <h2 className="text-2xl font-semibold text-black">
            {t("createShipment")}
          </h2>

          <p className="mt-3 text-gray-600">
            {t("createShipmentDescription")}
          </p>
        </Link>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Link
          href="/dashboard/warehouse"
          className="rounded-2xl border bg-white p-5 text-center transition hover:shadow-md"
        >
          <p className="text-2xl">🏠</p>
          <p className="mt-2 text-sm font-medium text-black">
            {t("warehouse")}
          </p>
        </Link>

        <Link
          href="/pricing"
          className="rounded-2xl border bg-white p-5 text-center transition hover:shadow-md"
        >
          <p className="text-2xl">🧮</p>
          <p className="mt-2 text-sm font-medium text-black">
            {t("pricing")}
          </p>
        </Link>

        <Link
          href="/dashboard/addresses"
          className="rounded-2xl border bg-white p-5 text-center transition hover:shadow-md"
        >
          <p className="text-2xl">📍</p>
          <p className="mt-2 text-sm font-medium text-black">
            {t("addresses")}
          </p>
        </Link>

        <Link
          href="/dashboard/support"
          className="rounded-2xl border bg-white p-5 text-center transition hover:shadow-md"
        >
          <p className="text-2xl">💬</p>
          <p className="mt-2 text-sm font-medium text-black">
            {t("support")}
          </p>
        </Link>
      </section>
    </main>
  );
}