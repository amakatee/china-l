"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markNotificationsAsRead() {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}