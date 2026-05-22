import Link from "next/link";

export default function WarehousePage() {
  return (
    <main className="bg-white text-black">
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Northern Fox Logistic
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            China warehouse address
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-gray-600">
            Use your assigned warehouse details when ordering from Chinese
            marketplaces and suppliers.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="rounded-3xl border p-8">
          <h2 className="text-2xl font-semibold">How to use the address</h2>

          <div className="mt-6 space-y-4 text-gray-600">
            <p>1. Create your account.</p>
            <p>2. Open your dashboard warehouse page.</p>
            <p>3. Copy your warehouse address.</p>
            <p>4. Use it as the delivery address when ordering in China.</p>
            <p>5. Add the seller tracking number in your dashboard.</p>
          </div>
        </div>

        <div className="rounded-3xl border bg-gray-50 p-8">
          <h2 className="text-2xl font-semibold">Important</h2>

          <div className="mt-6 space-y-4 text-gray-600">
            <p>
              Always include your customer name or account reference if shown in
              your dashboard.
            </p>

            <p>
              Add tracking numbers early so our warehouse can identify your
              parcels faster.
            </p>

            <p>
              Battery, liquid, branded, oversized, or restricted goods may need
              manual review.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="rounded-3xl bg-black p-8 text-white md:p-12">
          <h2 className="text-3xl font-semibold">
            Ready to receive parcels in China?
          </h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Register and get access to your dashboard, parcel tracking, shipment
            creation, payments, notifications, and support.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-black"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}