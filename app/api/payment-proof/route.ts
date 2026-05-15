import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const shipmentId = String(formData.get("shipmentId"));
  const paymentProofUrl = String(formData.get("paymentProofUrl"));

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: shipmentId,
      userId: session.user.id,
    },
  });

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  await prisma.shipment.update({
    where: {
      id: shipmentId,
    },
    data: {
      paymentProofUrl,
    },
  });

  return NextResponse.json({ success: true });
}