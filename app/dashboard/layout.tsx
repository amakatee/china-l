import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LanguageSwitcher } from "@/components/common/language-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[260px_1fr]">
        <aside className="border-r text-black bg-white p-6">
          <Link href="/" className="text-xl font-semibold">
            China Logistics
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
<Link href="/dashboard/notifications">
  Notifications
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