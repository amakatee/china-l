import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateShipmentForm } from "@/components/shipment/create-shipment-form";

type CreateShipmentPageProps = {
  searchParams: Promise<{
    parcelIds?: string;
  }>;
};

export default async function CreateShipmentPage({
  searchParams,
}: CreateShipmentPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { parcelIds } = await searchParams;

  const preselectedParcelIds = parcelIds
    ? parcelIds.split(",").filter(Boolean)
    : [];

  const parcels = await prisma.parcel.findMany({
    where: {
      userId: session.user.id,
      status: {
        in: ["EXPECTED", "ARRIVED_AT_WAREHOUSE", "READY_TO_SHIP"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const shippingMethods = await prisma.shippingMethod.findMany({
    where: {
      isActive: true,
    },
  });

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Packing</p>
        <h1 className="mt-2 text-3xl font-semibold text-black">
          Create shipment
        </h1>
        <p className="mt-2 text-gray-600">
          Confirm selected parcels, choose recipient address and shipping method.
        </p>
      </section>

      <div className="mt-6">
      <CreateShipmentForm
  parcels={parcels.map((parcel) => ({
    id: parcel.id,
    trackingNumber: parcel.trackingNumber,
    description: parcel.description,
    status: parcel.status,
    weightKg: parcel.weightKg?.toString() ?? null,
  }))}
  addresses={addresses.map((address) => ({
    id: address.id,
    fullName: address.fullName,
    city: address.city,
    country: address.country,
    isDefault: address.isDefault,
  }))}
  shippingMethods={shippingMethods.map((method) => ({
    id: method.id,
    name: method.name,
  }))}
  preselectedParcelIds={preselectedParcelIds}
/>
      </div>
    </main>
  );
}