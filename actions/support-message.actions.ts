"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

export async function createSupportMessage(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const ticketId = String(formData.get("ticketId"));
  const message = String(formData.get("message") ?? "").trim();

  if (!message) {
    throw new Error("Message is required");
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "OPERATOR";

  const ticket = await prisma.supportTicket.findFirst({
    where: {
      id: ticketId,
      OR: [{ userId: session.user.id }, ...(isAdmin ? [{}] : [])],
    },
    include: {
      user: true,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  await prisma.supportMessage.create({
    data: {
      ticketId,
      userId: session.user.id,
      message,
    },
  });

  if (isAdmin && ticket.user.email) {
    await sendEmail({
      to: ticket.user.email,
      subject: "Support replied to your ticket",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Support replied to your ticket</h2>
          <p>Ticket: <strong>${ticket.subject}</strong></p>
          <p>You have a new reply from our support team.</p>
          <p>
            <a href="${process.env.AUTH_URL || "http://localhost:3000"}/dashboard/support/${ticketId}">
              View ticket
            </a>
          </p>
        </div>
      `,
    });

    await createNotification({
      userId: ticket.userId,
      title: "Support replied",
      message: `Support replied to your ticket: ${ticket.subject}`,
      href: `/dashboard/support/${ticketId}`,
    });
  }

  revalidatePath(`/dashboard/support/${ticketId}`);
  revalidatePath(`/admin/support/${ticketId}`);
}