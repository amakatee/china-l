import { signIn } from "@/auth";
import Link from "next/link";
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        action={async (formData) => {
          "use server";

          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
          });
        }}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-gray-500">
            Access your shipping dashboard.
          </p>
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white"
        >
          Login
        </button>
      </form>
      <Link
  href="/forgot-password"
  className="text-sm text-gray-500"
>
  Forgot password?
</Link>
    </main>
  );
}