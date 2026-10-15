type Product = {
  id: number
  name: string
  brand: string
  category: string
  gender: string
  price: number
  image: string
}

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card h-100 shadow-sm border-0">
      
      {/* Image du produit */}
      <div
        style={{
          height: '300px',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Informations du produit */}
      <div className="card-body d-flex flex-column">
        
        <p className="text-muted mb-1 small">
          {product.brand}
        </p>

        <h5 className="card-title mb-2">
          {product.name}
        </h5>

        <p className="card-text text-muted mb-2">
          {product.category}
        </p>

        <p className="fw-bold fs-5 mb-3">
          {product.price.toFixed(2)} $
        </p>

        <button className="btn btn-dark w-100 mt-auto">
          Ajouter au panier
        </button>

      </div>
    </div>
  )
}

export default ProductCard