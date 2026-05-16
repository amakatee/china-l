import { prisma } from "@/lib/prisma";

type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  href?: string;
};

export async function createNotification({
  userId,
  title,
  message,
  href,
}: CreateNotificationInput) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      href,
    },
  });
}