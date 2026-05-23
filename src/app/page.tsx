"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])

  async function loadProducts() {
    const res = await fetch(
      "http://localhost:3000/api/products"
    )

    const data = await res.json()

    setProducts(data)
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
    <main className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-700 to-pink-600 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          Inventory Reservation System
        </h1>

        <p className="text-center text-white/80 text-xl mb-12">
          Smart Multi Warehouse Reservation Platform
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-bold text-white">
                  {product.name}
                </h2>

                <div className="bg-green-400 text-black px-4 py-2 rounded-full font-bold">
                  Active
                </div>
              </div>

              {product.inventories.map(
                (inventory: any) => {
                  const available =
                    inventory.totalQuantity -
                    inventory.reservedQuantity

                  return (
                    <div
                      key={inventory.id}
                      className="mt-8 bg-white/10 rounded-2xl p-6"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white/70">
                            Warehouse
                          </p>

                          <p className="text-white text-2xl font-semibold">
                            {
                              inventory.warehouse
                                .name
                            }
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/70">
                            Available
                          </p>

                          <p className="text-yellow-300 text-5xl font-bold">
                            {available}
                          </p>
                        </div>
                      </div>

                      <button
                        className="w-full mt-6 bg-gradient-to-r from-pink-500 to-yellow-500 hover:scale-105 transition duration-300 text-white font-bold py-4 rounded-2xl text-xl shadow-xl"
                        onClick={() =>
                          reserve(
                            product.id,
                            inventory.warehouseId
                          )
                        }
                      >
                        Reserve Now
                      </button>
                    </div>
                  )
                }
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}