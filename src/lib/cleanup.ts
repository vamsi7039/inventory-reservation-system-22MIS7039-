import { prisma } from "./prisma"

export async function cleanupExpiredReservations() {
  const expired = await prisma.reservation.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lt: new Date()
      }
    }
  })

  for (const reservation of expired) {
    await prisma.inventory.update({
      where: {
        productId_warehouseId: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId
        }
      },
      data: {
        reservedQuantity: {
          decrement: reservation.quantity
        }
      }
    })

    await prisma.reservation.update({
      where: {
        id: reservation.id
      },
      data: {
        status: "RELEASED"
      }
    })
  }
}