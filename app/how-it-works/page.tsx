import Link from "next/link";

const steps = [
  {
    title: "Create your account",
    description:
      "Register and access your customer dashboard to manage parcels and shipments.",
  },
  {
    title: "Get your China warehouse address",
    description:
      "Use our receiving warehouse address when ordering from Chinese marketplaces or suppliers.",
  },
  {
    title: "Add tracking numbers",
    description:
      "As your seller ships items, add each parcel tracking number into your dashboard.",
  },
  {
    title: "Warehouse intake & inspection",
    description:
      "Our operators receive parcels, record weight and dimensions, inspect items, and prepare them for shipping.",
  },
  {
    title: "Create shipment",
    description:
      "Choose the parcels you want combined, select shipping method, and submit shipment request.",
  },
  {
    title: "Pay shipping",
    description:
      "Once final pricing is confirmed, upload payment proof securely through your dashboard.",
  },
  {
    title: "Delivery",
    description:
      "Track your shipment from processing to shipped to delivered.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          How it works
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Simple China parcel forwarding from purchase to delivery.
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Buy from Chinese marketplaces, send purchases to our warehouse, and
          manage everything from your dashboard.
        </p>
      </div>

      <div className="mt-16 space-y-6">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-2xl border p-8">
            <p className="text-sm text-gray-500">Step {index + 1}</p>
            <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
            <p className="mt-3 text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-black p-10 text-white">
        <h2 className="text-3xl font-semibold">Ready to start?</h2>

        <p className="mt-4 max-w-2xl text-gray-300">
          Create your account and start managing incoming China parcels today.
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