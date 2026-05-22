import Link from "next/link";
import { requestPasswordReset } from "@/actions/password-reset.actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    sent?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { sent } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8">
        <h1 className="text-3xl font-semibold text-black">
          Forgot password
        </h1>

        <p className="mt-3 text-gray-600">
          Enter your email address and we’ll send you a password reset link.
        </p>

        {sent && (
          <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
            If an account exists for that email, a reset link has been sent.
          </div>
        )}

        <form action={requestPasswordReset} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button className="w-full rounded-xl bg-black px-4 py-3 text-white">
            Send reset link
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-gray-500"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}