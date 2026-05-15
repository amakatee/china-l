import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const shipmentSteps = [
  {
    status: "REQUESTED",
    label: "Packing",
  },
  {
    status: "AWAITING_PAYMENT",
    label: "Payment",
  },
  {
    status: "SHIPPED",
    label: "Shipped",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
  },
];

type ShipmentDetailPageProps = {
  params: Promise<{
    id: string;
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

export default async function ShipmentDetailPage({
  params,
}: ShipmentDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const shipment = await prisma.shipment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      address: true,
      shippingMethod: true,
      items: {
        include: {
          parcel: true,
        },
      },
    },
  });

  if (!shipment) {
    notFound();
  }

  const currentStepIndex = shipmentSteps.findIndex(
    (step) => step.status === shipment.status
  );

  const totalWeight = shipment.items.reduce((sum, item) => {
    return sum + Number(item.parcel.weightKg ?? 0);
  }, 0);

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Shipment</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">
              {shipment.id.slice(0, 8)}
            </h1>
            <p className="mt-2 text-gray-600">
              Track packing, payment, shipping and delivery.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
              shipment.status
            )}`}
          >
            {getStatusLabel(shipment.status)}
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Shipment progress</h2>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {shipmentSteps.map((step, index) => {
            const completed =
              currentStepIndex >= 0 && index <= currentStepIndex;

            return (
              <div
                key={step.status}
                className={`rounded-2xl border p-4 text-center text-sm font-medium ${
                  completed
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Parcels</p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {shipment.items.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total weight</p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {totalWeight > 0 ? `${totalWeight.toFixed(2)} kg` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Shipping</p>
          <p className="mt-2 text-lg font-semibold text-black">
            {shipment.shippingMethod?.name || "—"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Price</p>
          <p className="mt-2 text-lg font-semibold text-black">
            {shipment.finalPrice
              ? `${shipment.finalPrice.toString()} ${shipment.currency}`
              : "Pending"}
          </p>
        </div>
      </section>

      {shipment.status === "AWAITING_PAYMENT" && shipment.finalPrice && (
        <section className="mt-6 rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Payment required</h2>
          <p className="mt-2 text-gray-600">
            Your shipment has been priced. Please continue to payment.
          </p>

          <Link
            href={`/dashboard/payment/${shipment.id}`}
            className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Go to payment
          </Link>
        </section>
      )}

      {shipment.paymentProofUrl && (
        <section className="mt-6 rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Payment proof</h2>

          <a
            href={shipment.paymentProofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm underline"
          >
            View uploaded payment proof
          </a>
        </section>
      )}

{shipment.status === "SHIPPED" && (
  <section className="mt-6 rounded-3xl border bg-white p-6">
    <h2 className="text-lg font-semibold text-black">Tracking</h2>

    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
      <div>
        <p className="text-gray-500">Carrier</p>
        <p className="mt-1 font-medium text-black">
          {shipment.carrier || "—"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Tracking number</p>
        <p className="mt-1 font-medium text-black">
          {shipment.internationalTrackingNumber || "—"}
        </p>
      </div>
    </div>

    {!shipment.internationalTrackingNumber && (
      <p className="mt-4 text-sm text-gray-500">
        Tracking information will be available within 24 hours after dispatch.
      </p>
    )}
  </section>
)}

      {shipment.address && (
        <section className="mt-6 rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-black">
            Recipient address
          </h2>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium text-black">{shipment.address.fullName}</p>
            <p>{shipment.address.phone || "—"}</p>
            <p>
              {shipment.address.addressLine1}, {shipment.address.city},{" "}
              {shipment.address.country}
            </p>
            <p>{shipment.address.postalCode || ""}</p>
          </div>
        </section>
      )}

      {shipment.operatorNotes && (
        <section className="mt-6 rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Operator notes</h2>
          <p className="mt-3 text-gray-600">{shipment.operatorNotes}</p>
        </section>
      )}

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-black">
          Parcels in this shipment
        </h2>

        <div className="mt-5 grid gap-4">
          {shipment.items.map((item) => (
            <div key={item.id} className="rounded-2xl border p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tracking number</p>
                  <p className="mt-1 font-semibold text-black">
                    {item.parcel.trackingNumber}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                  {item.parcel.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="mt-1 font-medium text-black">
                    {item.parcel.description || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Weight</p>
                  <p className="mt-1 font-medium text-black">
                    {item.parcel.weightKg
                      ? `${item.parcel.weightKg.toString()} kg`
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="mt-1 font-medium text-black">
                    {item.parcel.lengthCm &&
                    item.parcel.widthCm &&
                    item.parcel.heightCm
                      ? `${item.parcel.lengthCm.toString()} × ${item.parcel.widthCm.toString()} × ${item.parcel.heightCm.toString()} cm`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {shipment.customerNotes && (
        <section className="mt-6 rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Your notes</h2>
          <p className="mt-3 text-gray-600">{shipment.customerNotes}</p>
        </section>
      )}
    </main>
  );
}