import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateSupportTicketStatus } from "@/actions/support.actions";

type Props = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

function getStatusClass(status: string) {
  if (status === "OPEN") return "bg-blue-50 text-blue-700";
  if (status === "IN_PROGRESS") return "bg-yellow-50 text-yellow-700";
  if (status === "CLOSED") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
}

function getTabHref(status: string, q: string) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (q) {
    params.set("q", q);
  }

  const query = params.toString();

  return query ? `/admin/support?${query}` : "/admin/support";
}

export default async function AdminSupportPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const { status, q } = await searchParams;
  const activeStatus = status ?? "all";
  const searchQuery = q?.trim() ?? "";

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: true,
      messages: true,
    },
    where: {
      ...(searchQuery
        ? {
            OR: [
              {
                subject: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                message: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                user: {
                  email: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                user: {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredTickets = tickets.filter((ticket) => {
    if (activeStatus === "all") return true;
    return ticket.status === activeStatus;
  });

  const tabs = [
    { label: "All", value: "all", count: tickets.length },
    {
      label: "Open",
      value: "OPEN",
      count: tickets.filter((t) => t.status === "OPEN").length,
    },
    {
      label: "In progress",
      value: "IN_PROGRESS",
      count: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    },
    {
      label: "Closed",
      value: "CLOSED",
      count: tickets.filter((t) => t.status === "CLOSED").length,
    },
  ];

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Admin</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Support inbox
        </h1>

        <p className="mt-2 text-gray-600">
          Search and manage customer support tickets.
        </p>
      </section>

      <form className="mt-6 rounded-3xl border bg-white p-5">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery}
          placeholder="Search subject, message, customer email, name..."
          className="w-full rounded-xl border px-4 py-3"
        />
      </form>

      <section className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={getTabHref(tab.value, searchQuery)}
            className={`rounded-full border px-4 py-2 text-sm ${
              activeStatus === tab.value
                ? "border-black bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="rounded-3xl border bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <Link
                  href={`/admin/support/${ticket.id}`}
                  className="text-lg font-semibold text-black"
                >
                  {ticket.subject}
                </Link>

                <p className="mt-1 text-sm text-gray-500">
                  {ticket.user.name || ticket.user.email}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                  ticket.status
                )}`}
              >
                {ticket.status.replaceAll("_", " ")}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-600 line-clamp-2">
              {ticket.message}
            </p>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-gray-500">
                {ticket.messages.length} replies ·{" "}
                {ticket.createdAt.toLocaleDateString()}
              </div>

              <form action={updateSupportTicketStatus} className="flex gap-2">
                <input type="hidden" name="ticketId" value={ticket.id} />

                <select
                  name="status"
                  defaultValue={ticket.status}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <button className="rounded-xl bg-black px-4 py-2 text-sm text-white">
                  Save
                </button>
              </form>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            No support tickets found.
          </div>
        )}
      </section>
    </main>
  );
}