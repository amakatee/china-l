import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        Pricing estimate
      </p>

      <h1 className="mt-4 text-5xl font-semibold tracking-tight">
        Estimate your China shipping cost.
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        Final price depends on actual warehouse weight, dimensions, route,
        item type, and customs requirements.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">Air Shipping</h2>
          <p className="mt-4 text-gray-600">
            Faster option for regular goods.
          </p>
          <p className="mt-6 text-4xl font-semibold">$8 / kg</p>
        </div>

        <div className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">Sea Cargo</h2>
          <p className="mt-4 text-gray-600">
            Better for heavier shipments and some restricted goods.
          </p>
          <p className="mt-6 text-4xl font-semibold">Custom quote</p>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-black p-10 text-white">
        <h2 className="text-3xl font-semibold">
          Want an exact quote?
        </h2>

        <p className="mt-4 max-w-2xl text-gray-300">
          Create an account, add parcel tracking numbers, and our operators
          will confirm final weight and shipping price.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-flex rounded-md bg-white px-5 py-3 text-black"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}