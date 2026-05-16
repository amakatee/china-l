import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LanguageSwitcher } from "@/components/common/language-switcher";

// export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const unreadNotifications = await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[260px_1fr]">
        <aside className="border-r bg-white p-6 text-black">
          <Link href="/" className="text-xl font-semibold">
            Northern Fox Logistic
          </Link>

          <p className="mt-2 text-sm text-gray-500">{session.user.email}</p>

          <nav className="mt-8 space-y-2">
            <Link
              href="/dashboard"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/parcels"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              My Parcels
            </Link>

            <Link
              href="/dashboard/shipments"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              My Shipments
            </Link>

            <Link
              href="/dashboard/add-parcel"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Add Parcel
            </Link>

            <Link
              href="/dashboard/create-shipment"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Create Shipment
            </Link>

            <Link
              href="/dashboard/addresses"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Addresses
            </Link>

            <Link
              href="/dashboard/warehouse"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Warehouse
            </Link>

            <Link
              href="/dashboard/notifications"
              className="flex items-center justify-between rounded-md px-4 py-3 hover:bg-gray-100"
            >
              <span>Notifications</span>

              {unreadNotifications > 0 && (
                <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            <Link
              href="/dashboard/support"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Support
            </Link>

            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}