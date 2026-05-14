import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PaymentProofUpload } from "@/components/payment/payment-proof-upload";

type PaymentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaymentPage({ params }: PaymentPageProps) {
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
  });

  if (!shipment) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Payment</h1>

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="font-semibold">Shipment summary</h2>

        <p className="mt-4 text-gray-600">
          Shipment: {shipment.id.slice(0, 8)}
        </p>

        <p className="mt-2 text-gray-600">
          Amount:{" "}
          <span className="font-semibold">
            {shipment.finalPrice?.toString() || "Not set"} {shipment.currency}
          </span>
        </p>

        <p className="mt-2 text-gray-600">
          Status: {shipment.status.replaceAll("_", " ")}
        </p>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Payment instructions</h2>

        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <p>Bank transfer / Wise / Revolut</p>
          <p>Recipient: China Logistics Ltd</p>
          <p>Reference: {shipment.id}</p>
          <p>Upload proof of payment below after sending payment.</p>
        </div>
      </div>

      {shipment.status === "AWAITING_PAYMENT" && shipment.finalPrice && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Upload payment proof</h2>
          <p className="mt-2 text-sm text-gray-500">
            Upload a screenshot or PDF receipt. After upload, your shipment will
            be marked as paid.
          </p>

          <div className="mt-4">
            <PaymentProofUpload shipmentId={shipment.id} />
          </div>
        </div>
      )}

      {shipment.paymentProofUrl && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Uploaded proof</h2>

          <a
            href={shipment.paymentProofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm underline"
          >
            View uploaded proof
          </a>
        </div>
      )}

      {shipment.status === "PAID" && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">
            Payment marked as paid. Waiting for operator confirmation.
          </p>
        </div>
      )}
    </main>
  );
}