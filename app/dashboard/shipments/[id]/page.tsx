import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const shipmentSteps = [
  "REQUESTED",
  "PRICE_PENDING",
  "AWAITING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

type ShipmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

  const currentStepIndex = shipmentSteps.indexOf(shipment.status);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div>
        <p className="text-sm text-gray-500">Shipment</p>
        <h1 className="text-2xl font-semibold">{shipment.id.slice(0, 8)}</h1>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Shipment progress</h2>

        <div className="mt-6 grid gap-3 md:grid-cols-7">
          {shipmentSteps.map((step, index) => {
            const completed = index <= currentStepIndex;

            return (
              <div
                key={step}
                className={`rounded-lg border p-3 text-center text-xs font-medium ${
                  completed
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                {step.replaceAll("_", " ")}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Current status: {shipment.status.replaceAll("_", " ")}
        </p>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Payment</h2>

        {shipment.finalPrice ? (
          <div className="mt-2 space-y-3">
            <p className="text-gray-600">
              Final price:{" "}
              <span className="font-semibold">
                {shipment.finalPrice.toString()} {shipment.currency}
              </span>
            </p>

            {shipment.status === "AWAITING_PAYMENT" && (
              <Link
                href={`/dashboard/payment/${shipment.id}`}
                className="inline-flex rounded-md bg-black px-4 py-2 text-white"
              >
                Go to payment
              </Link>
            )}

            {shipment.paymentProofUrl && (
              <a
                href={shipment.paymentProofUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-sm underline"
              >
                View uploaded payment proof
              </a>
            )}

            {shipment.status === "PAID" && (
              <p className="text-sm text-green-700">
                Payment marked as paid. Operator will verify it.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-gray-500">
            Final price is not confirmed yet.
          </p>
        )}
      </div>

      {shipment.operatorNotes && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Operator notes</h2>
          <p className="mt-2 text-gray-600">{shipment.operatorNotes}</p>
        </div>
      )}

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Parcels in this shipment</h2>

        <div className="mt-4 space-y-3">
          {shipment.items.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <p className="font-medium">{item.parcel.trackingNumber}</p>
              <p className="text-sm text-gray-500">
                {item.parcel.description || "No description"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Status: {item.parcel.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {shipment.customerNotes && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Your notes</h2>
          <p className="mt-2 text-gray-600">{shipment.customerNotes}</p>
        </div>
      )}
    </main>
  );
}