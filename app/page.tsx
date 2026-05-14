import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header className="border-b">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
    <Link href="/" className="text-lg font-semibold">
      China Logistics
    </Link>

    <nav className="flex items-center gap-6 text-sm">
    <Link href="/pricing">Pricing</Link>
      <Link href="/how-it-works">How it works</Link>
      <Link href="/login">Login</Link>
      <Link
        href="/register"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Register
      </Link>
    </nav>
  </div>
</header>
      <section className="mx-auto max-w-6xl px-8 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            China warehouse forwarding
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Ship your purchases from China to anywhere in the world.
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Get a China warehouse address, add your tracking numbers, combine
            parcels, choose Air or Sea Cargo, and manage everything from one
            dashboard.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/register"
              className="rounded-md bg-black px-5 py-3 text-white"
            >
              Create account
            </Link>

            <Link
              href="/login"
              className="rounded-md border px-5 py-3"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-8 py-16 md:grid-cols-5">
          {[
            "Get warehouse address",
            "Order from Taobao / 1688",
            "Add tracking number",
            "Create shipment",
            "Pay and receive parcel",
          ].map((step, index) => (
            <div key={step} className="rounded-xl border bg-white p-5">
              <p className="text-sm text-gray-500">Step {index + 1}</p>
              <h3 className="mt-2 font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-8 py-16 md:grid-cols-2">
        <div className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">Air Shipping</h2>
          <p className="mt-4 text-gray-600">
            Faster delivery for standard parcels, clothes, shoes, accessories,
            and regular goods.
          </p>
        </div>

        <div className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">Sea Cargo</h2>
          <p className="mt-4 text-gray-600">
            Better for larger shipments, heavier cargo, and items that may not
            be accepted by air transport.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="rounded-2xl bg-black p-10 text-white">
          <h2 className="text-3xl font-semibold">
            Start managing your China parcels today.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Built for customers who want transparent parcel tracking,
            consolidation, pricing, and support in one place.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-md bg-white px-5 py-3 text-black"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}