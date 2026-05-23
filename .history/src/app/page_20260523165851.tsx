"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])

  async function loadProducts() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/products"
      )

      const data = await res.json()

      console.log(data)

      setProducts(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function reserve(
    productId: string,
    warehouseId: string
  ) {
    const res = await fetch(
      "http://localhost:3000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1
        })
      }
    )

    if (res.status === 409) {
      alert("Out of stock")
      return
    }

    loadProducts()
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-5xl font-bold mb-10">
        Inventory Reservation System
      </h1>

      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="border rounded-xl p-6 shadow"
            >
              <h2 className="text-3xl font-semibold">
                {product.name}
              </h2>

              {product.inventories.map(
                (inventory: any) => (
                  <div
                    key={inventory.id}
                    className="mt-5"
                  >
                    <p>
                      Warehouse:
                      {" "}
                      {
                        inventory.warehouse.name
                      }
                    </p>

                    <p>
                      Available:
                      {" "}
                      {inventory.totalQuantity -
                        inventory.reservedQuantity}
                    </p>

                    <button
                      className="mt-3 px-5 py-2 bg-black text-white rounded-lg"
                      onClick={() =>
                        reserve(
                          product.id,
                          inventory.warehouseId
                        )
                      }
                    >
                      Reserve
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}