import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateParcelByAdmin } from "@/actions/admin-parcel.actions";

type AdminParcelPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminParcelPage({ params }: AdminParcelPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const parcel = await prisma.parcel.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!parcel) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div>
        <p className="text-sm text-gray-500">Admin parcel</p>
        <h1 className="text-2xl font-semibold">{parcel.trackingNumber}</h1>
        <p className="mt-1 text-gray-500">{parcel.user.email}</p>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Parcel details</h2>

        <div className="mt-4 grid gap-3 text-sm">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {parcel.description || "—"}
          </p>

          <p>
            <span className="font-medium">Status:</span> {parcel.status}
          </p>

          <p>
            <span className="font-medium">Customer notes:</span>{" "}
            {parcel.customerNotes || "—"}
          </p>
        </div>
      </div>

      <form
        action={updateParcelByAdmin}
        className="mt-6 space-y-4 rounded-xl border p-6"
      >
        <input type="hidden" name="parcelId" value={parcel.id} />

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={parcel.status}
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="EXPECTED">EXPECTED</option>
            <option value="ARRIVED_AT_WAREHOUSE">ARRIVED_AT_WAREHOUSE</option>
            <option value="CHECKING">CHECKING</option>
            <option value="READY_TO_SHIP">READY_TO_SHIP</option>
            <option value="IN_SHIPMENT">IN_SHIPMENT</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="PROBLEM">PROBLEM</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium">Weight kg</label>
            <input
              name="weightKg"
              defaultValue={parcel.weightKg?.toString() ?? ""}
              placeholder="1.2"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Length cm</label>
            <input
              name="lengthCm"
              defaultValue={parcel.lengthCm?.toString() ?? ""}
              placeholder="30"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Width cm</label>
            <input
              name="widthCm"
              defaultValue={parcel.widthCm?.toString() ?? ""}
              placeholder="20"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Height cm</label>
            <input
              name="heightCm"
              defaultValue={parcel.heightCm?.toString() ?? ""}
              placeholder="10"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
            <input
              type="checkbox"
              name="hasBattery"
              defaultChecked={parcel.hasBattery}
            />
            Has battery
          </label>

          <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
            <input
              type="checkbox"
              name="isRestricted"
              defaultChecked={parcel.isRestricted}
            />
            Restricted item
          </label>
        </div>

        <div>
          <label className="text-sm font-medium">Operator notes</label>
          <textarea
            name="operatorNotes"
            defaultValue={parcel.operatorNotes ?? ""}
            placeholder="Internal notes for warehouse/operator"
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