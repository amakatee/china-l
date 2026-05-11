"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createParcel(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const trackingNumber = String(formData.get("trackingNumber") ?? "")
    .trim()
    .toUpperCase();

  const description = String(formData.get("description") ?? "").trim();
  const customerNotes = String(formData.get("customerNotes") ?? "").trim();

  if (!trackingNumber) {
    throw new Error("Tracking number is required");
  }

  await prisma.parcel.create({
    data: {
      userId: session.user.id,
      trackingNumber,
      description,
      customerNotes,
      status: "EXPECTED",
    },
  });

  redirect("/dashboard/parcels");
}