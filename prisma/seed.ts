import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.warehouse.upsert({
    where: {
      id: "china-air-warehouse",
    },
    update: {},
    create: {
      id: "china-air-warehouse",
      name: "China Air Warehouse",
      type: "AIR",
      city: "Guangzhou",
      addressLine: "Warehouse address placeholder",
    },
  });

  await prisma.shippingMethod.upsert({
    where: {
      id: "air-shipping",
    },
    update: {},
    create: {
      id: "air-shipping",
      name: "Air Shipping",
      type: "AIR",
      description: "Fast shipping for standard goods",
    },
  });

  await prisma.shippingMethod.upsert({
    where: {
      id: "sea-cargo",
    },
    update: {},
    create: {
      id: "sea-cargo",
      name: "Sea Cargo",
      type: "SEA_CARGO",
      description: "Slower but supports restricted cargo",
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });