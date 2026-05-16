"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

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
  const carrier = String(formData.get("carrier") ?? "").trim();
  const internationalTrackingNumber = String(
    formData.get("internationalTrackingNumber") ?? ""
  ).trim();

  const currentShipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { user: true },
  });

  if (!currentShipment) {
    throw new Error("Shipment not found");
  }

  const updatedShipment = await prisma.shipment.update({
    where: { id: shipmentId },
    data: {
      status: status as any,
      finalPrice: finalPriceRaw ? finalPriceRaw : null,
      operatorNotes: operatorNotes || null,
      carrier: carrier || null,
      internationalTrackingNumber: internationalTrackingNumber || null,
    },
  });

  if (
    currentShipment.status !== "AWAITING_PAYMENT" &&
    updatedShipment.status === "AWAITING_PAYMENT" &&
    currentShipment.user.email
  ) {
    await sendEmail({
      to: currentShipment.user.email,
      subject: "Payment required for your shipment",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your shipment has been priced</h2>
          <p>Your shipment <strong>${shipmentId.slice(0, 8)}</strong> is ready for payment.</p>
          <p>Amount due: <strong>${updatedShipment.finalPrice?.toString() || "Pending"} ${updatedShipment.currency}</strong></p>
          <p><a href="${process.env.AUTH_URL || "http://localhost:3000"}/dashboard/payment/${shipmentId}">Pay now</a></p>
        </div>
      `,
    });

    await createNotification({
      userId: currentShipment.userId,
      title: "Payment required",
      message: `Shipment ${shipmentId.slice(0, 8)} is ready for payment.`,
      href: `/dashboard/payment/${shipmentId}`,
    });
  }

  if (
    currentShipment.status !== "SHIPPED" &&
    updatedShipment.status === "SHIPPED" &&
    currentShipment.user.email
  ) {
    await sendEmail({
      to: currentShipment.user.email,
      subject: "Your shipment has been shipped",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your shipment is on the way</h2>
          <p>Shipment <strong>${shipmentId.slice(0, 8)}</strong> has been dispatched.</p>
          <p>Tracking: <strong>${
            updatedShipment.internationalTrackingNumber ||
            "Tracking number will be available within 24 hours."
          }</strong></p>
          ${
            updatedShipment.carrier
              ? `<p>Carrier: <strong>${updatedShipment.carrier}</strong></p>`
              : ""
          }
        </div>
      `,
    });

    await createNotification({
      userId: currentShipment.userId,
      title: "Shipment shipped",
      message: `Shipment ${shipmentId.slice(0, 8)} has been dispatched.`,
      href: `/dashboard/shipments/${shipmentId}`,
    });
  }

  if (
    !currentShipment.internationalTrackingNumber &&
    updatedShipment.internationalTrackingNumber &&
    currentShipment.user.email
  ) {
    await sendEmail({
      to: currentShipment.user.email,
      subject: "Tracking number assigned",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your tracking number is ready</h2>
          <p>Shipment <strong>${shipmentId.slice(0, 8)}</strong></p>
          <p>Tracking number: <strong>${updatedShipment.internationalTrackingNumber}</strong></p>
          ${
            updatedShipment.carrier
              ? `<p>Carrier: <strong>${updatedShipment.carrier}</strong></p>`
              : ""
          }
        </div>
      `,
    });

    await createNotification({
      userId: currentShipment.userId,
      title: "Tracking number assigned",
      message: `Tracking number ${updatedShipment.internationalTrackingNumber} has been added.`,
      href: `/dashboard/shipments/${shipmentId}`,
    });
  }

  if (
    currentShipment.status !== "DELIVERED" &&
    updatedShipment.status === "DELIVERED" &&
    currentShipment.user.email
  ) {
    await sendEmail({
      to: currentShipment.user.email,
      subject: "Your shipment has been delivered",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Shipment delivered</h2>
          <p>Your shipment <strong>${shipmentId.slice(0, 8)}</strong> has been marked as delivered.</p>
          <p>Thank you for choosing Northern Fox Logistic.</p>
        </div>
      `,
    });

    await createNotification({
      userId: currentShipment.userId,
      title: "Shipment delivered",
      message: `Shipment ${shipmentId.slice(0, 8)} has been delivered.`,
      href: `/dashboard/shipments/${shipmentId}`,
    });
  }

  revalidatePath(`/admin/shipments/${shipmentId}`);
  revalidatePath(`/dashboard/shipments/${shipmentId}`);
}