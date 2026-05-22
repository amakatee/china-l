import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="bg-white text-black">
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Pricing estimate
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Estimate your China shipping cost.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Final pricing depends on warehouse weight, dimensions, shipping
            route, item category, customs requirements, and carrier availability.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="rounded-3xl border bg-white p-8">
          <p className="text-sm text-gray-500">Fast option</p>
          <h2 className="mt-3 text-3xl font-semibold">Air shipping</h2>

          <p className="mt-4 text-gray-600">
            Best for smaller parcels, clothes, shoes, accessories, and standard
            goods that need faster delivery.
          </p>

          <p className="mt-8 text-5xl font-semibold">$8</p>
          <p className="mt-2 text-gray-500">per kg estimate</p>
        </div>

        <div className="rounded-3xl border bg-white p-8">
          <p className="text-sm text-gray-500">Economy option</p>
          <h2 className="mt-3 text-3xl font-semibold">Sea cargo</h2>

          <p className="mt-4 text-gray-600">
            Better for heavier shipments, larger packages, and cargo where cost
            matters more than speed.
          </p>

          <p className="mt-8 text-5xl font-semibold">Quote</p>
          <p className="mt-2 text-gray-500">confirmed after warehouse check</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">What affects the price?</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Actual weight",
              "Package dimensions",
              "Shipping method",
              "Item category",
              "Destination country",
              "Customs requirements",
              "Battery or restricted goods",
              "Carrier availability",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">How final price is confirmed</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border p-5">
              <p className="text-sm text-gray-500">1</p>
              <h3 className="mt-2 font-semibold">Parcel arrives</h3>
              <p className="mt-2 text-sm text-gray-600">
                Warehouse receives and identifies your parcel.
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-gray-500">2</p>
              <h3 className="mt-2 font-semibold">Weight is checked</h3>
              <p className="mt-2 text-sm text-gray-600">
                Operator measures weight, size, and item restrictions.
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-gray-500">3</p>
              <h3 className="mt-2 font-semibold">You receive payment request</h3>
              <p className="mt-2 text-sm text-gray-600">
                Final price appears in your shipment page and email.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="rounded-3xl bg-black p-8 text-white md:p-12">
          <h2 className="text-3xl font-semibold">
            Want an exact shipment quote?
          </h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Create an account, add parcel tracking numbers, and our warehouse
            team will confirm the final shipping price after inspection.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-white px-6 py-3 text-center text-black"
            >
              Create account
            </Link>

            <Link
              href="/how-it-works"
              className="rounded-xl border border-white/30 px-6 py-3 text-center text-white"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}