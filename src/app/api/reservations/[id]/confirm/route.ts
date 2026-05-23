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

  if (
    !reservation ||
    reservation.expiresAt < new Date()
  ) {
    return new Response(
      JSON.stringify({
        error: "Reservation expired"
      }),
      {
        status: 410
      }
    )
  }

  await prisma.inventory.update({
    where: {
      productId_warehouseId: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId
      }
    },
    data: {
      totalQuantity: {
        decrement: reservation.quantity
      },
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
      status: "CONFIRMED"
    }
  })

  return Response.json(updated)
}