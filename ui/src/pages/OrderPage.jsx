import { PRODUCTS } from '../data/menu'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'
import './OrderPage.css'

function OrderPage({ cart, onAddToCart, onUpdateQuantity, onOrder }) {
  return (
    <div className="order-page">
      <section className="product-list">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </section>
      <Cart
        items={cart}
        onUpdateQuantity={onUpdateQuantity}
        onOrder={onOrder}
      />
    </div>
  )
}

export default OrderPage
