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
    <div className="card h-100">
      <div
        style={{
          height: '250px',
          backgroundColor: '#f3f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>Image du produit</span>
      </div>

      <div className="card-body">
        <p className="text-muted mb-1">
          {product.brand}
        </p>

        <h5 className="card-title">
          {product.name}
        </h5>

        <p className="card-text text-muted">
          {product.category}
        </p>

        <p className="fw-bold">
          {product.price.toFixed(2)} $
        </p>

        <button className="btn btn-dark w-100">
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

export default ProductCard