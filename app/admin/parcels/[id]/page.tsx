import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateParcelByAdmin } from "@/actions/admin-parcel.actions";

const parcelSteps = [
  "EXPECTED",
  "ARRIVED_AT_WAREHOUSE",
  "CHECKING",
  "READY_TO_SHIP",
];

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusClass(status: string) {
  if (status === "EXPECTED") return "bg-gray-100 text-gray-700";
  if (status === "ARRIVED_AT_WAREHOUSE") return "bg-blue-50 text-blue-700";
  if (status === "CHECKING") return "bg-yellow-50 text-yellow-700";
  if (status === "READY_TO_SHIP") return "bg-green-50 text-green-700";
  if (status === "IN_SHIPMENT") return "bg-purple-50 text-purple-700";
  if (status === "PROBLEM") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
}

type AdminParcelPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminParcelPage({
  params,
}: AdminParcelPageProps) {
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

  const currentStepIndex = parcelSteps.indexOf(parcel.status);

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Warehouse parcel</p>
            <p className="mt-2 text-gray-600">
  {parcel.user.name || parcel.user.email}
</p>

<p className="text-sm text-gray-500">
  {parcel.user.email}
</p>

            <h1 className="mt-2 text-3xl font-semibold text-black">
              {parcel.trackingNumber}
            </h1>

            <p className="mt-2 text-gray-600">{parcel.user.email}</p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
              parcel.status
            )}`}
          >
            {getStatusLabel(parcel.status)}
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Warehouse progress</h2>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {parcelSteps.map((step, index) => {
            const completed =
              currentStepIndex >= 0 && index <= currentStepIndex;

            return (
              <div
                key={step}
                className={`rounded-2xl border p-4 text-center text-sm font-medium ${
                  completed
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                {getStatusLabel(step)}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Weight</p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {parcel.weightKg ? `${parcel.weightKg.toString()} kg` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Length</p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {parcel.lengthCm ? `${parcel.lengthCm.toString()} cm` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Width</p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {parcel.widthCm ? `${parcel.widthCm.toString()} cm` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">Height</p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {parcel.heightCm ? `${parcel.heightCm.toString()} cm` : "—"}
          </p>
        </div>
      </section>

      <form
        action={updateParcelByAdmin}
        className="mt-6 space-y-6 rounded-3xl border bg-white p-6"
      >
        <input type="hidden" name="parcelId" value={parcel.id} />

        <div>
          <label className="text-sm font-medium">Status</label>

          <select
            name="status"
            defaultValue={parcel.status}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          >
            <option value="EXPECTED">EXPECTED</option>
            <option value="ARRIVED_AT_WAREHOUSE">ARRIVED_AT_WAREHOUSE</option>
            <option value="CHECKING">CHECKING</option>
            <option value="READY_TO_SHIP">READY_TO_SHIP</option>
            <option value="PROBLEM">PROBLEM</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <input
            name="weightKg"
            defaultValue={parcel.weightKg?.toString() ?? ""}
            placeholder="Weight kg"
            className="rounded-xl border px-4 py-3"
          />

          <input
            name="lengthCm"
            defaultValue={parcel.lengthCm?.toString() ?? ""}
            placeholder="Length cm"
            className="rounded-xl border px-4 py-3"
          />

          <input
            name="widthCm"
            defaultValue={parcel.widthCm?.toString() ?? ""}
            placeholder="Width cm"
            className="rounded-xl border px-4 py-3"
          />

          <input
            name="heightCm"
            defaultValue={parcel.heightCm?.toString() ?? ""}
            placeholder="Height cm"
            className="rounded-xl border px-4 py-3"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border p-4">
            <input
              type="checkbox"
              name="hasBattery"
              defaultChecked={parcel.hasBattery}
            />
            <span>Contains battery</span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border p-4">
            <input
              type="checkbox"
              name="isRestricted"
              defaultChecked={parcel.isRestricted}
            />
            <span>Restricted item</span>
          </label>
        </div>

        <div>
          <label className="text-sm font-medium">Operator notes</label>

          <textarea
            name="operatorNotes"
            defaultValue={parcel.operatorNotes ?? ""}
            className="mt-2 min-h-32 w-full rounded-xl border px-4 py-3"
          />
        </div>

        <button className="rounded-xl bg-black px-6 py-3 text-white">
          Save parcel changes
        </button>
      </form>
    </main>
  );
}