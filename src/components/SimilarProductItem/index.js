// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {similarProductsList} = props

  return (
    <div className="similar-product-details-card">
      <h1 className="similar-heading">similar Products</h1>
      <ul className="similar-lists">
        {similarProductsList.map(eachProduct => (
          <li className="list-of-similar-images" key={eachProduct.id}>
            <img
              className="similar-image"
              src={eachProduct.imageUrl}
              alt={eachProduct.id}
            />
            <p className="title-name">{eachProduct.title}</p>
            <p className="title-brand">{eachProduct.brand}</p>
            <div className="ratings-card-is">
              <p className="similar-product-price">Rs {eachProduct.price}/-</p>
              <div className="ratings-btn">
                <p>{eachProduct.rating}</p>
                <img
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SimilarProductItem
