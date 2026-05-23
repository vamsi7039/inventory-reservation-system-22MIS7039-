import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: any
) {
  const reservation = await prisma.reservation.findUnique({
    where: {
      id: params.id
    }
  })

  if (!reservation) {
    return new Response("Not Found", {
      status: 404
    })
  }

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

  const updated = await prisma.reservation.update({
    where: {
      id: reservation.id
    },
    data: {
      status: "RELEASED"
    }
  })

  return Response.json(updated)
}