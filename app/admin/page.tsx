import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR") {
    redirect("/dashboard");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p className="mt-2 text-gray-500">
        Operator workspace for parcels, shipments, users, and payments.
      </p>
    </main>
  );
}