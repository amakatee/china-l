import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSupportMessage } from "@/actions/support-message.actions";
import { updateSupportTicketStatus } from "@/actions/support.actions";

type AdminSupportTicketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminSupportTicketPage({
  params,
}: AdminSupportTicketPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div>
        <p className="text-sm text-gray-500">Admin support ticket</p>
        <h1 className="text-2xl font-semibold">{ticket.subject}</h1>
        <p className="mt-1 text-sm text-gray-500">{ticket.user.email}</p>
      </div>

      <form
        action={updateSupportTicketStatus}
        className="mt-6 flex gap-3 rounded-xl border p-5"
      >
        <input type="hidden" name="ticketId" value={ticket.id} />

        <select
          name="status"
          defaultValue={ticket.status}
          className="rounded-md border px-3 py-2"
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button className="rounded-md bg-black px-4 py-2 text-white">
          Update status
        </button>
      </form>

      <div className="mt-6 rounded-xl border p-5">
        <p className="text-sm text-gray-700">{ticket.message}</p>
      </div>

      <div className="mt-6 space-y-4">
        {ticket.messages.map((message) => (
          <div key={message.id} className="rounded-xl border p-5">
            <p className="text-sm text-gray-500">
              {message.user.email} · {message.createdAt.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-gray-700">{message.message}</p>
          </div>
        ))}
      </div>

      <form
        action={createSupportMessage}
        className="mt-6 space-y-4 rounded-xl border p-5"
      >
        <input type="hidden" name="ticketId" value={ticket.id} />

        <textarea
          name="message"
          required
          placeholder="Write an operator reply..."
          className="min-h-28 w-full rounded-md border px-3 py-2"
        />

        <button className="rounded-md bg-black px-4 py-2 text-white">
          Send reply
        </button>
      </form>
    </main>
  );
}