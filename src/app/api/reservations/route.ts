import { prisma } from "@/lib/prisma"
import { cleanupExpiredReservations } from "@/lib/cleanup"

export async function POST(req: Request) {
  await cleanupExpiredReservations()

  const body = await req.json()

  try {
    const reservation = await prisma.$transaction(async (tx) => {
      const inventory = await tx.$queryRawUnsafe(`
        SELECT *
        FROM "Inventory"
        WHERE "productId"='${body.productId}'
        AND "warehouseId"='${body.warehouseId}'
        FOR UPDATE
      `)

      const row = inventory[0] as any

      const available =
        row.totalQuantity - row.reservedQuantity

      if (available < body.quantity) {
        throw new Error("INSUFFICIENT_STOCK")
      }

      await tx.inventory.update({
        where: {
          id: row.id
        },
        data: {
          reservedQuantity: {
            increment: body.quantity
          }
        }
      })

      return tx.reservation.create({
        data: {
          productId: body.productId,
          warehouseId: body.warehouseId,
          quantity: body.quantity,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      })
    })

    return Response.json(reservation)
  } catch {
    return new Response(
      JSON.stringify({
        error: "Not enough stock"
      }),
      {
        status: 409
      }
    )
  }
}