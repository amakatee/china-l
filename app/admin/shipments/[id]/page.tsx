import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateShipmentByAdmin } from "@/actions/admin-shipment.actions";

type AdminShipmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminShipmentPage({
  params,
}: AdminShipmentPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      user: true,
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

  const totalWeight = shipment.items.reduce((sum, item) => {
    return sum + Number(item.parcel.weightKg ?? 0);
  }, 0);

  const estimatedPrice = totalWeight * 8;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div>
        <p className="text-sm text-gray-500">Admin shipment</p>
        <h1 className="text-2xl font-semibold">{shipment.id.slice(0, 8)}</h1>
        <p className="mt-1 text-gray-500">{shipment.user.email}</p>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Parcels</h2>

        <div className="mt-4 space-y-3">
          {shipment.items.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <p className="font-medium">{item.parcel.trackingNumber}</p>
              <p className="text-sm text-gray-500">
                {item.parcel.description || "No description"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Parcel status: {item.parcel.status}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Weight:{" "}
                {item.parcel.weightKg
                  ? `${item.parcel.weightKg.toString()} kg`
                  : "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
          <p>
            <span className="font-medium">Total weight:</span>{" "}
            {totalWeight > 0 ? `${totalWeight.toFixed(2)} kg` : "—"}
          </p>
          <p>
            <span className="font-medium">Estimated price:</span>{" "}
            {estimatedPrice > 0 ? `$${estimatedPrice.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>

      {shipment.paymentProofUrl && (
        <div className="mt-6 rounded-xl border p-6">
          <h2 className="font-semibold">Payment proof</h2>

          <a
            href={shipment.paymentProofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm underline"
          >
            View uploaded payment proof
          </a>
        </div>
      )}

      <form
        action={updateShipmentByAdmin}
        className="mt-6 space-y-4 rounded-xl border p-6"
      >
        <input type="hidden" name="shipmentId" value={shipment.id} />

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={shipment.status}
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="REQUESTED">REQUESTED</option>
            <option value="PRICE_PENDING">PRICE_PENDING</option>
            <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
            <option value="PAID">PAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="PROBLEM">PROBLEM</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Final price</label>
          <input
            name="finalPrice"
            defaultValue={
              shipment.finalPrice?.toString() ??
              (estimatedPrice > 0 ? estimatedPrice.toFixed(2) : "")
            }
            placeholder="e.g. 45.00"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Auto-estimate uses $8 per kg. You can override it manually.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Operator notes</label>
          <textarea
            name="operatorNotes"
            defaultValue={shipment.operatorNotes ?? ""}
            className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
          />
        </div>

        <button className="rounded-md bg-black px-4 py-2 text-white">
          Save changes
        </button>
      </form>
    </main>
  );
}