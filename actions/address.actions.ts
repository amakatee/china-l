"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createAddress(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();

  if (!fullName || !country || !city || !addressLine1) {
    throw new Error("Missing required address fields");
  }

  await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName,
      phone,
      country,
      city,
      postalCode,
      addressLine1,
    },
  });

  revalidatePath("/dashboard/addresses");
}