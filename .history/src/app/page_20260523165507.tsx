async function reserve(productId: string, warehouseId: string) {
  await fetch("http://localhost:3000/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productId,
      warehouseId,
      quantity: 1
    })
  })
}

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store"
  })

  return res.json()
}

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Inventory Reservation System
      </h1>

      <div className="grid gap-6">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold">
              {product.name}
            </h2>

            {product.inventories.map((inventory: any) => (
              <div
                key={inventory.id}
                className="mt-4"
              >
                <p>
                  Warehouse: {inventory.warehouse.name}
                </p>

                <p>
                  Available{" "}
                  {inventory.totalQuantity -
                    inventory.reservedQuantity}
                </p>

                <button
                  className="mt-3 px-4 py-2 bg-black text-white rounded-lg"
                  onClick={async () => {
                    await fetch(
                      "http://localhost:3000/api/reservations",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type":
                            "application/json"
                        },
                        body: JSON.stringify({
                          productId: product.id,
                          warehouseId:
                            inventory.warehouseId,
                          quantity: 1
                        })
                      }
                    )

                    window.location.reload()
                  }}
                >
                  Reserve
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}