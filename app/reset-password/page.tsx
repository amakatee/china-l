import { resetPassword } from "@/actions/password-reset.actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-3xl border bg-white p-8">
          <h1 className="text-2xl font-semibold text-black">
            Invalid reset link
          </h1>

          <p className="mt-4 text-gray-600">
            This password reset link is missing or invalid.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8">
        <h1 className="text-3xl font-semibold text-black">
          Reset password
        </h1>

        <p className="mt-3 text-gray-600">
          Enter your new password below.
        </p>

        <form action={resetPassword} className="mt-6 space-y-4">
          <input type="hidden" name="token" value={token} />

          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="New password"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button className="w-full rounded-xl bg-black px-4 py-3 text-white">
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}