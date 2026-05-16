import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSupportMessage } from "@/actions/support-message.actions";
import { updateSupportTicketStatus } from "@/actions/support.actions";

function getStatusClass(status: string) {
  if (status === "OPEN") return "bg-blue-50 text-blue-700";
  if (status === "IN_PROGRESS") return "bg-yellow-50 text-yellow-700";
  if (status === "CLOSED") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
}

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Admin support ticket</p>

            <h1 className="mt-2 text-3xl font-semibold text-black">
              {ticket.subject}
            </h1>

            <p className="mt-2 text-gray-600">
              Customer: {ticket.user.name || ticket.user.email}
            </p>

            <p className="text-sm text-gray-500">{ticket.user.email}</p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
              ticket.status
            )}`}
          >
            {getStatusLabel(ticket.status)}
          </span>
        </div>
      </section>

      <form
        action={updateSupportTicketStatus}
        className="mt-6 flex flex-col gap-3 rounded-3xl border bg-white p-6 md:flex-row md:items-center"
      >
        <input type="hidden" name="ticketId" value={ticket.id} />

        <select
          name="status"
          defaultValue={ticket.status}
          className="rounded-xl border px-4 py-3"
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button className="rounded-xl bg-black px-5 py-3 text-white">
          Update status
        </button>
      </form>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Original message</h2>

        <p className="mt-4 text-gray-700">{ticket.message}</p>
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Conversation</h2>

        <div className="mt-6 space-y-4">
          {ticket.messages.map((message) => {
            const isAdminMessage = ["ADMIN", "OPERATOR"].includes(
              message.user.role
            );

            return (
              <div
                key={message.id}
                className={`flex ${
                  isAdminMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl rounded-3xl px-5 py-4 ${
                    isAdminMessage
                      ? "bg-black text-white"
                      : "border bg-white text-black"
                  }`}
                >
                  <p className="text-xs opacity-70">
                    {isAdminMessage
                      ? "Support"
                      : message.user.name || message.user.email}{" "}
                    · {message.createdAt.toLocaleString()}
                  </p>

                  <p className="mt-2 text-sm">{message.message}</p>
                </div>
              </div>
            );
          })}

          {ticket.messages.length === 0 && (
            <p className="text-sm text-gray-500">No replies yet.</p>
          )}
        </div>
      </section>

      {ticket.status !== "CLOSED" && (
        <form
          action={createSupportMessage}
          className="mt-6 rounded-3xl border bg-white p-6"
        >
          <input type="hidden" name="ticketId" value={ticket.id} />

          <h2 className="text-lg font-semibold text-black">Operator reply</h2>

          <textarea
            name="message"
            required
            placeholder="Write an operator reply..."
            className="mt-4 min-h-32 w-full rounded-xl border px-4 py-3"
          />

          <button className="mt-4 rounded-xl bg-black px-5 py-3 text-white">
            Send reply
          </button>
        </form>
      )}
    </main>
  );
}