import Link from "next/link";

const steps = [
  {
    title: "Create your account",
    description:
      "Register with Northern Fox Logistic and access your personal customer dashboard.",
  },
  {
    title: "Get your warehouse address",
    description:
      "Use your assigned warehouse address in China when ordering from Taobao, 1688, Alibaba, WeChat sellers, or other suppliers.",
  },
  {
    title: "Add tracking numbers",
    description:
      "Enter parcel tracking numbers in your dashboard so we can expect incoming deliveries.",
  },
  {
    title: "Warehouse inspection",
    description:
      "Our warehouse receives, checks, weighs, and measures your parcels before marking them ready.",
  },
  {
    title: "Create shipment",
    description:
      "Select one or multiple ready parcels, choose destination address, and choose shipping method.",
  },
  {
    title: "Payment",
    description:
      "Receive final shipping cost, upload payment proof, and wait for confirmation.",
  },
  {
    title: "Shipment dispatch",
    description:
      "Once confirmed, we dispatch your shipment and provide international tracking.",
  },
  {
    title: "Delivery",
    description:
      "Track your shipment until it reaches your destination country and final delivery.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-white text-black">
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Northern Fox Logistic
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            How it works
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-gray-600">
            Simple China parcel forwarding from purchase to delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="grid gap-4 rounded-3xl border p-6 md:grid-cols-[120px_1fr]"
            >
              <div>
                <p className="text-sm text-gray-500">
                  Step {index + 1}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">{step.title}</h2>
                <p className="mt-3 text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="rounded-3xl bg-black p-8 text-white md:p-12">
          <h2 className="text-3xl font-semibold">
            Ready to start shipping?
          </h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Create your account and start managing parcels today.
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