import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b px-8 py-4">
        <nav className="flex gap-6 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/parcels">Parcels</Link>
          <Link href="/dashboard/add-parcel">Add parcel</Link>
          <Link href="/dashboard/shipments">Shipments</Link>
          <Link href="/dashboard/create-shipment">Create shipment</Link>
          <Link href="/dashboard/addresses">Addresses</Link>
          <Link href="/dashboard/warehouse">Warehouse</Link>
          <Link href="/dashboard/support">Support</Link>
        </nav>
      </header>

      {children}
    </div>
  );
}