import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[260px_1fr]">
        <aside className="border-r bg-white p-6">
          <Link href="/" className="text-xl font-semibold">
            China Logistics Admin
          </Link>

          <p className="mt-2 text-sm text-gray-500">{session.user.email}</p>

          <nav className="mt-8 space-y-2">
            <Link
              href="/admin"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/parcels"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Parcels
            </Link>

            <Link
              href="/admin/shipments"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Shipments
            </Link>

            <Link
              href="/admin/support"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Support
            </Link>

            <Link
              href="/dashboard"
              className="block rounded-md px-4 py-3 hover:bg-gray-100"
            >
              Customer View
            </Link>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}