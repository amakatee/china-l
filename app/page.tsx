import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white text-black">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
          <Link href="/" className="text-lg font-semibold">
            Northern Fox Logistic
          </Link>

          <nav className="flex items-center gap-4 text-sm md:gap-6">
            <Link href="/pricing">Pricing</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/warehouse">Warehouse</Link>
            <Link href="/login">Login</Link>

            <Link
              href="/register"
              className="rounded-xl bg-black px-4 py-2 text-white"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-28">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            China warehouse forwarding
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Buy in China. Ship worldwide with full parcel control.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Get your personal warehouse address, track incoming parcels,
            combine orders, choose shipping, upload payment proof, and follow
            delivery from one dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-black px-6 py-3 text-center text-white"
            >
              Create account
            </Link>

            <Link
              href="/how-it-works"
              className="rounded-xl border px-6 py-3 text-center"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border bg-gray-50 p-6">
          <p className="text-sm text-gray-500">Your forwarding dashboard</p>

          <div className="mt-5 space-y-3">
            {[
              ["Parcels ready", "3"],
              ["Awaiting payment", "1"],
              ["In transit", "2"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border bg-white p-4"
              >
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-2xl font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-black p-5 text-white">
            <p className="text-sm text-gray-300">Next step</p>
            <p className="mt-2 text-lg font-semibold">
              Select ready parcels and proceed to packing.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 md:grid-cols-5 md:px-8">
          {[
            "Get warehouse address",
            "Shop on Chinese platforms",
            "Add tracking numbers",
            "Combine parcels",
            "Pay and receive shipment",
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border bg-white p-5">
              <p className="text-sm text-gray-500">Step {index + 1}</p>
              <h3 className="mt-2 font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Warehouse tracking",
              text: "Follow parcel status from expected arrival to ready for shipment.",
            },
            {
              title: "Parcel consolidation",
              text: "Combine multiple orders into one shipment and reduce delivery cost.",
            },
            {
              title: "Payment and support",
              text: "Upload payment proof, receive email updates, and message support.",
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border p-6">
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-2 md:px-8">
        <div className="rounded-3xl border p-8">
          <h2 className="text-2xl font-semibold">Air shipping</h2>
          <p className="mt-4 text-gray-600">
            Faster delivery for clothes, shoes, accessories, small parcels, and
            standard goods.
          </p>
        </div>

        <div className="rounded-3xl border p-8">
          <h2 className="text-2xl font-semibold">Sea cargo</h2>
          <p className="mt-4 text-gray-600">
            Better for larger shipments, heavier cargo, and items that are more
            economical by sea.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="rounded-3xl bg-black p-8 text-white md:p-12">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Start managing your China parcels today.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Northern Fox Logistic helps you track, consolidate, pay, and ship
            your purchases with clear status updates.
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