"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markShipmentAsPaid(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const shipmentId = String(formData.get("shipmentId"));

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: shipmentId,
      userId: session.user.id,
    },
  });

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  if (shipment.status !== "AWAITING_PAYMENT") {
    throw new Error("Shipment is not awaiting payment");
  }

  await prisma.shipment.update({
    where: {
      id: shipmentId,
    },
    data: {
      status: "SHIPPED",
    },
  });

  revalidatePath(`/dashboard/shipments/${shipmentId}`);
}