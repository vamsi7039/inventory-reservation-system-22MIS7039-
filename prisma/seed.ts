import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.create({
    data: {
      name: "iPhone 15",
      price: 79999
    }
  })

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Mumbai Central",
      city: "Mumbai"
    }
  })

  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalQuantity: 10
    }
  })
}

main()