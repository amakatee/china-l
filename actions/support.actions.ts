"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createSupportTicket(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!subject || !message) {
    throw new Error("Subject and message are required");
  }

  await prisma.supportTicket.create({
    data: {
      userId: session.user.id,
      subject,
      message,
    },
  });

  revalidatePath("/dashboard/support");
  revalidatePath("/admin/support");
}

export async function updateSupportTicketStatus(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["ADMIN", "OPERATOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const ticketId = String(formData.get("ticketId"));
  const status = String(formData.get("status"));

  await prisma.supportTicket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: status as any,
    },
  });

  revalidatePath("/admin/support");
  revalidatePath("/dashboard/support");
}