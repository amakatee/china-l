"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markNotificationsAsRead } from "@/actions/notification.actions";

export function MarkNotificationsRead() {
  const router = useRouter();

  useEffect(() => {
    async function markRead() {
      await markNotificationsAsRead();
      router.refresh();
    }

    markRead();
  }, [router]);

  return null;
}