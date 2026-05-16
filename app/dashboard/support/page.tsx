import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSupportTicket } from "@/actions/support.actions";

function getStatusClass(status: string) {
  if (status === "OPEN") return "bg-blue-50 text-blue-700";
  if (status === "IN_PROGRESS") return "bg-yellow-50 text-yellow-700";
  if (status === "CLOSED") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
}

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function SupportPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tickets = await prisma.supportTicket.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      messages: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const progressCount = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;
  const closedCount = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Support</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Support center
        </h1>

        <p className="mt-2 text-gray-600">
          Contact our team about parcels, shipments, payments, or customs.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Open</p>
          <p className="mt-1 text-2xl font-semibold text-black">{openCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">In progress</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {progressCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Closed</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {closedCount}
          </p>
        </div>
      </section>

      <form
        action={createSupportTicket}
        className="mt-6 space-y-4 rounded-3xl border bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-black">Create ticket</h2>

        <input
          name="subject"
          placeholder="Subject"
          required
          className="w-full rounded-xl border px-4 py-3"
        />

        <textarea
          name="message"
          placeholder="Describe your issue"
          required
          className="min-h-32 w-full rounded-xl border px-4 py-3"
        />

        <button className="rounded-xl bg-black px-5 py-3 text-white">
          Send message
        </button>
      </form>

      <section className="mt-6 grid gap-4">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/dashboard/support/${ticket.id}`}
            className="rounded-3xl border bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Ticket</p>
                <h2 className="mt-1 text-lg font-semibold text-black">
                  {ticket.subject}
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                  ticket.status
                )}`}
              >
                {getStatusLabel(ticket.status)}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-600 line-clamp-2">
              {ticket.message}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
              <span>{ticket.messages.length} replies</span>
              <span>{ticket.createdAt.toLocaleDateString()}</span>
            </div>
          </Link>
        ))}

        {tickets.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No support tickets yet
            </h2>

            <p className="mt-2 text-gray-600">
              Create a ticket and our team will reply here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}