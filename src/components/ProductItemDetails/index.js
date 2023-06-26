// Write your code here
import {Component} from 'react'
import {Loader} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaRegMinusSquare, FaRegPlusSquare} from 'react-icons/fa'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiConstantsStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}
class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsList: [],
    count: 1,
    apiStatus: apiConstantsStatus.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  formattingData = data => ({
    id: data.id,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiConstantsStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccb.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedFormat = this.formattingData(fetchedData)
      const similarProductsFormat = fetchedData.similar_products.map(eachItem =>
        this.formattingData(eachItem),
      )
      this.setState({
        productData: updatedFormat,
        similarProductsList: similarProductsFormat,
        apiStatus: apiConstantsStatus.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiConstantsStatus.failure})
    }
  }

  getSuccessView = () => {
    const {productData, similarProductsList, count} = this.state
    const {
      id,
      imageUrl,
      availability,
      brand,
      description,
      price,
      rating,
      totalReviews,
      title,
    } = productData
    return (
      <div className="products-container">
        <div className="product-Details-card">
          <img className="product-img" src={imageUrl} alt={id} />
          <h1 className="title">{title}</h1>
          <p className="price">Rs {price}/-</p>
          <div className="rating-container-is">
            <div className="rating-card">
              <p className="rating">{rating}</p>
              <img
                className="star-img"
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p className="reviews">{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <p className="headers">
            Available: <span className="span">{availability}</span>
          </p>
          <p className="headers">
            Brand: <span className="span">{brand}</span>
          </p>
        </div>
        <div className="similar-products-container">
          <div className="buttons-cart">
            <div className="buttons">
              <button className="btn" type="button" onClick={this.onDecrement}>
                <FaRegMinusSquare className="btn-plus-minus-card" />
              </button>
              <p className="count">{count}</p>
              <button className="btn" type="button" onClick={this.onIncrement}>
                <FaRegPlusSquare className="btn-plus-minus-card" />
              </button>
            </div>
            <button className="add-btn" type="button">
              ADD TO CART
            </button>
          </div>
          <SimilarProductItem similarProductsList={similarProductsList} />
        </div>
      </div>
    )
  }

  getFailureView = () => (
    <div className="failure-card">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1 className="failure-name">Product Not Found</h1>
      <button type="button" className="failure-btn">
        Continue Shopping
      </button>
    </div>
  )

  getLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderProductsView = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiConstantsStatus.inProgress:
        return this.getLoadingView()
      case apiConstantsStatus.success:
        return this.getSuccessView()
      case apiConstantsStatus.failure:
        return this.getFailureView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)
    return (
      <>
        <Header />
        <div className="product-details-container">
          {this.renderProductsView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
