import { registerUser } from "@/actions/auth.actions";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        action={registerUser}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-sm text-gray-500">
            Start managing your China shipments.
          </p>
        </div>

        <input
          name="name"
          placeholder="Name"
          className="w-full rounded-md border px-3 py-2"
        />

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
          Register
        </button>
      </form>
    </main>
  );
}