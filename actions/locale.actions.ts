"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLocale(formData: FormData) {
  const locale = String(formData.get("locale"));

  if (locale !== "en" && locale !== "ru") {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
}