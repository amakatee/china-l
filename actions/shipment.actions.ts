"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createShipment(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parcelIds = formData.getAll("parcelIds").map(String);
  const addressId = String(formData.get("addressId") ?? "");
  const shippingMethodId = String(formData.get("shippingMethodId") ?? "");
  const customerNotes = String(formData.get("customerNotes") ?? "").trim();

  if (parcelIds.length === 0) {
    throw new Error("Select at least one parcel");
  }

  if (!addressId) {
    throw new Error("Select recipient address");
  }

  if (!shippingMethodId) {
    throw new Error("Select shipping method");
  }

  const shipment = await prisma.shipment.create({
    data: {
      userId: session.user.id,
      addressId,
      shippingMethodId,
      customerNotes,
      status: "REQUESTED",
      items: {
        create: parcelIds.map((parcelId) => ({
          parcelId,
        })),
      },
    },
  });

  await prisma.parcel.updateMany({
    where: {
      id: {
        in: parcelIds,
      },
      userId: session.user.id,
    },
    data: {
      status: "IN_SHIPMENT",
    },
  });

  redirect(`/dashboard/shipments/${shipment.id}`);
}