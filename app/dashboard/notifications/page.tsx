import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Dashboard</p>

        <h1 className="mt-2 text-3xl font-semibold text-black">
          Notifications
        </h1>

        <p className="mt-2 text-gray-600">
          Updates about parcels, shipments, payments, tracking, and support.
        </p>
      </section>

      <section className="mt-6 grid gap-4">
        {notifications.map((notification) => {
          const content = (
            <div
              className={`rounded-3xl border bg-white p-5 ${
                notification.isRead ? "" : "border-black"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    {notification.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>

                {!notification.isRead && (
                  <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                    New
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                {notification.createdAt.toLocaleString()}
              </p>
            </div>
          );

          if (notification.href) {
            return (
              <Link key={notification.id} href={notification.href}>
                {content}
              </Link>
            );
          }

          return <div key={notification.id}>{content}</div>;
        })}

        {notifications.length === 0 && (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-black">
              No notifications yet
            </h2>

            <p className="mt-2 text-gray-600">
              Important updates will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}