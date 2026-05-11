import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b px-8 py-4">
        <nav className="flex gap-6 text-sm">
        <Link href="/admin/support">Support</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/admin/parcels">Parcels</Link>
          <Link href="/admin/shipments">Shipments</Link>
        </nav>
      </header>

      {children}
    </div>
  );
}