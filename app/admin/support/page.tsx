import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateSupportTicketStatus } from "@/actions/support.actions";

export default async function AdminSupportPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Support tickets</h1>

      <div className="mt-8 space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">{ticket.subject}</h2>
                <p className="text-sm text-gray-500">{ticket.user.email}</p>
              </div>

              <form
                action={updateSupportTicketStatus}
                className="flex items-center gap-2"
              >
                <input type="hidden" name="ticketId" value={ticket.id} />

                <select
                  name="status"
                  defaultValue={ticket.status}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <button className="rounded-md bg-black px-3 py-2 text-sm text-white">
                  Save
                </button>
              </form>
            </div>

            <p className="mt-4 text-sm text-gray-600">{ticket.message}</p>

            <p className="mt-3 text-xs text-gray-400">
              {ticket.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}

        {tickets.length === 0 && (
          <p className="text-sm text-gray-500">No tickets yet.</p>
        )}
      </div>
    </main>
  );
}