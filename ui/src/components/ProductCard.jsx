import { useState } from 'react'
import { formatPrice } from '../utils/format'
import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  function toggleOption(optionId) {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    )
  }

  function handleAdd() {
    onAddToCart(product, selectedOptions)
    setSelectedOptions([])
  }

  return (
    <article className="product-card">
      <div className="product-image" aria-hidden="true">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <span className="product-image-placeholder">☕</span>
        )}
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{formatPrice(product.price)}</p>
      <p className="product-description">{product.description}</p>
      <div className="product-options">
        {(product.options || []).map((option) => (
          <label key={option.id} className="option-label">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option.id)}
              onChange={() => toggleOption(option.id)}
            />
            <span>
              {option.name} ({option.price > 0 ? '+' : ''}
              {formatPrice(option.price)})
            </span>
          </label>
        ))}
      </div>
      <button type="button" className="btn btn-primary add-btn" onClick={handleAdd}>
        담기
      </button>
    </article>
  )
}

export default ProductCard
