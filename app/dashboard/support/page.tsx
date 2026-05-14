import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSupportTicket } from "@/actions/support.actions";

export default async function SupportPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tickets = await prisma.supportTicket.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Support</h1>
      <p className="mt-2 text-gray-500">
        Contact our team about parcels, shipments, payments, or customs.
      </p>

      <form
        action={createSupportTicket}
        className="mt-8 space-y-4 rounded-xl border p-6"
      >
        <input
          name="subject"
          placeholder="Subject"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <textarea
          name="message"
          placeholder="Describe your issue"
          required
          className="min-h-32 w-full rounded-md border px-3 py-2"
        />

        <button className="rounded-md bg-black px-4 py-2 text-white">
          Send message
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-xl border p-5">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/dashboard/support/${ticket.id}`}
                className="font-medium underline"
              >
                {ticket.subject}
              </Link>

              <span className="text-xs text-gray-500">
                {ticket.status.replaceAll("_", " ")}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">{ticket.message}</p>

            <p className="mt-3 text-xs text-gray-400">
              {ticket.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}

        {tickets.length === 0 && (
          <p className="text-sm text-gray-500">No support tickets yet.</p>
        )}
      </div>
    </main>
  );
}