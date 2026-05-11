import { createParcel } from "@/actions/parcel.actions";

export default function AddParcelPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Add parcel</h1>
      <p className="mt-2 text-gray-500">
        Add the tracking number after ordering from Taobao, 1688, Weidian,
        Alibaba, or another seller.
      </p>

      <form action={createParcel} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Tracking number</label>
          <input
            name="trackingNumber"
            required
            placeholder="e.g. SF123456789CN"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Item description</label>
          <input
            name="description"
            placeholder="e.g. shoes, coat, bag"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            name="customerNotes"
            placeholder="Optional notes for our operator"
            className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Save parcel
        </button>
      </form>
    </main>
  );
}