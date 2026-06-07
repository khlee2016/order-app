import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'
import './OrderPage.css'

function OrderPage({ menus, loading, cart, onAddToCart, onUpdateQuantity, onOrder }) {
  if (loading) {
    return <p className="page-loading">메뉴를 불러오는 중...</p>
  }

  return (
    <div className="order-page">
      <section className="product-list">
        {menus.map((product) => (
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
