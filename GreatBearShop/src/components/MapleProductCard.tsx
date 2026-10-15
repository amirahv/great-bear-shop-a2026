type MapleProduct = {
    id: number
    name: string
    brand: string
    category: string
    price: number
    image: string
  }
  
  type MapleProductCardProps = {
    product: MapleProduct
  }
  
  function MapleProductCard({ product }: MapleProductCardProps) {
    return (
      <div className="card h-100 shadow-sm border-0">
  
        <div
          style={{
            height: "280px",
            backgroundColor: "#f5f5f5",
            overflow: "hidden",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "15px",
            }}
          />
        </div>
  
        <div className="card-body d-flex flex-column">
  
          <p className="text-muted small mb-1">
            {product.brand}
          </p>
  
          <h5 className="card-title">
            {product.name}
          </h5>
  
          <p className="text-muted mb-2">
            {product.category}
          </p>
  
          <p className="fw-bold fs-5 mt-auto">
            {product.price.toFixed(2)} $
          </p>
  
          <button className="btn btn-dark w-100">
            Ajouter au panier
          </button>
  
        </div>
      </div>
    )
  }
  
  export default MapleProductCard