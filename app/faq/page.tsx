import Link from "next/link";

const faqs = [
  {
    question: "How do I get my warehouse address?",
    answer:
      "After creating your account, your warehouse details are available inside your customer dashboard.",
  },
  {
    question: "Which Chinese stores can I order from?",
    answer:
      "You can order from Taobao, 1688, Alibaba, WeChat sellers, independent suppliers, and most Chinese marketplaces.",
  },
  {
    question: "When do I add tracking numbers?",
    answer:
      "Add tracking numbers as soon as your seller ships your parcel so our warehouse can identify incoming deliveries.",
  },
  {
    question: "Can I combine multiple parcels into one shipment?",
    answer:
      "Yes. Once parcels are ready, you can select multiple items and create a combined shipment.",
  },
  {
    question: "How is shipping cost calculated?",
    answer:
      "Pricing depends on actual warehouse weight, dimensions, destination country, shipping method, and item type.",
  },
  {
    question: "Do you ship battery or restricted items?",
    answer:
      "Some battery and restricted goods may require special shipping methods or manual approval.",
  },
  {
    question: "When do I receive tracking?",
    answer:
      "International tracking becomes available after dispatch and appears in your dashboard and notifications.",
  },
  {
    question: "What if I need help?",
    answer:
      "Use the built-in support ticket system inside your dashboard to contact our team.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white text-black">
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Northern Fox Logistic
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            Frequently asked questions
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-gray-600">
            Common questions about parcel forwarding, shipping, payments, and support.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="grid gap-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border p-6">
              <h2 className="text-xl font-semibold">{faq.question}</h2>
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="rounded-3xl bg-black p-8 text-white md:p-12">
          <h2 className="text-3xl font-semibold">Still need help?</h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Create an account and contact our support team directly from your dashboard.
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