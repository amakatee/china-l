"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function parseDecimal(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue ? stringValue : null;
}

export async function updateParcelByAdmin(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const parcelId = String(formData.get("parcelId"));
  const status = String(formData.get("status"));
  const operatorNotes = String(formData.get("operatorNotes") ?? "").trim();

  await prisma.parcel.update({
    where: {
      id: parcelId,
    },
    data: {
      status: status as any,
      operatorNotes,
      weightKg: parseDecimal(formData.get("weightKg")),
      lengthCm: parseDecimal(formData.get("lengthCm")),
      widthCm: parseDecimal(formData.get("widthCm")),
      heightCm: parseDecimal(formData.get("heightCm")),
      hasBattery: formData.get("hasBattery") === "on",
      isRestricted: formData.get("isRestricted") === "on",
    },
  });

  revalidatePath(`/admin/parcels/${parcelId}`);
  revalidatePath("/admin/parcels");
  revalidatePath("/dashboard/parcels");
}