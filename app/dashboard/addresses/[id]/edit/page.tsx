import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateAddress } from "@/actions/address.actions";

type EditAddressPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAddressPage({
  params,
}: EditAddressPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const address = await prisma.address.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!address) {
    notFound();
  }

  return (
    <main className="p-4 md:p-8">
      <section className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-gray-500">Addresses</p>
        <h1 className="mt-2 text-3xl font-semibold text-black">
          Edit address
        </h1>
      </section>

      <form
        action={updateAddress}
        className="mt-6 grid gap-4 rounded-3xl border bg-white p-6 md:grid-cols-2"
      >
        <input type="hidden" name="addressId" value={address.id} />

        <input
          name="fullName"
          defaultValue={address.fullName}
          placeholder="Full name"
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="phone"
          defaultValue={address.phone ?? ""}
          placeholder="Phone"
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="country"
          defaultValue={address.country}
          placeholder="Country"
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="city"
          defaultValue={address.city}
          placeholder="City"
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="postalCode"
          defaultValue={address.postalCode ?? ""}
          placeholder="Postal code"
          className="rounded-xl border px-4 py-3"
        />

        <input
          name="addressLine1"
          defaultValue={address.addressLine1}
          placeholder="Address line"
          required
          className="rounded-xl border px-4 py-3"
        />

        <button className="rounded-xl bg-black px-5 py-3 text-white md:col-span-2">
          Save changes
        </button>
      </form>
    </main>
  );
}