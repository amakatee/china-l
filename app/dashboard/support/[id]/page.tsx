import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSupportMessage } from "@/actions/support-message.actions";

type SupportTicketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SupportTicketPage({
  params,
}: SupportTicketPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const ticket = await prisma.supportTicket.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
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
    <main className="mx-auto max-w-3xl p-8">
      <div>
        <p className="text-sm text-gray-500">Support ticket</p>
        <h1 className="text-2xl font-semibold">{ticket.subject}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Status: {ticket.status.replaceAll("_", " ")}
        </p>
      </div>

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
          placeholder="Write a reply..."
          className="min-h-28 w-full rounded-md border px-3 py-2"
        />

        <button className="rounded-md bg-black px-4 py-2 text-white">
          Send reply
        </button>
      </form>
    </main>
  );
}