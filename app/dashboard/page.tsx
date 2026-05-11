import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>Email: {session.user.email}</p>
        <p>Role: {session.user.role}</p>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded-md bg-black px-4 py-2 text-white">
          Logout
        </button>
      </form>
    </main>
  );
}