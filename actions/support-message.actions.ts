"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

  const ticket = await prisma.supportTicket.findFirst({
    where: {
      id: ticketId,
      OR: [
        { userId: session.user.id },
        ...(session.user.role === "ADMIN" || session.user.role === "OPERATOR"
          ? [{}]
          : []),
      ],
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

  revalidatePath(`/dashboard/support/${ticketId}`);
  revalidatePath(`/admin/support/${ticketId}`);
}