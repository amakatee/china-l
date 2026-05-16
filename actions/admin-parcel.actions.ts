"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/email";

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

  const currentParcel = await prisma.parcel.findUnique({
    where: {
      id: parcelId,
    },
    include: {
      user: true,
    },
  });

  if (!currentParcel) {
    throw new Error("Parcel not found");
  }

  const updatedParcel = await prisma.parcel.update({
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

  if (
    currentParcel.status !== "READY_TO_SHIP" &&
    updatedParcel.status === "READY_TO_SHIP" &&
    currentParcel.user.email
  ) {
    await sendEmail({
      to: "katezi@bk.ru",
      // to: currentParcel.user.email,
      subject: "Your parcel is ready to ship",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your parcel is ready to ship</h2>
          <p>Your parcel <strong>${currentParcel.trackingNumber}</strong> has been checked by our warehouse team and is ready for packing.</p>
          <p>You can now log in to your dashboard, select this parcel, and proceed to packing.</p>
          <p>
            <a href="${process.env.AUTH_URL || "http://localhost:3000"}/dashboard/parcels?status=ready">
              Open ready parcels
            </a>
          </p>
        </div>
      `,
    });
    await createNotification({
      userId: currentParcel.userId,
      title: "Parcel ready to ship",
      message: `Parcel ${currentParcel.trackingNumber} is ready for packing.`,
      href: "/dashboard/parcels?status=ready",
    });
  }

  revalidatePath(`/admin/parcels/${parcelId}`);
  revalidatePath("/admin/parcels");
  revalidatePath("/dashboard/parcels");
}