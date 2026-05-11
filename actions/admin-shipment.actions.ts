"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateShipmentByAdmin(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const shipmentId = String(formData.get("shipmentId"));
  const status = String(formData.get("status"));
  const finalPriceRaw = String(formData.get("finalPrice") ?? "").trim();
  const operatorNotes = String(formData.get("operatorNotes") ?? "").trim();

  await prisma.shipment.update({
    where: {
      id: shipmentId,
    },
    data: {
      status: status as any,
      finalPrice: finalPriceRaw ? finalPriceRaw : null,
      operatorNotes,
    },
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
}