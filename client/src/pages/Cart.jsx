import React, { useMemo } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeFromCart, updateCartQuantity } from "../redux/features/shopSlice.js"
import Title from "../components/Title.jsx"
import { Link, useNavigate } from "react-router-dom"
import OrderSummary from "../components/OrderSummary.jsx"
import { getCartData, getCartSubtotal, getCartTotal } from "../utils/cartHelpers.js"

const MAX_QTY_OPTIONS = 5

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const products = useSelector(state => state.shop.products)
  const cartItems = useSelector(state => state.shop.cartItems)
  const currency = useSelector(state => state.shop.currency)
  const shippingFee = useSelector(state => state.shop.shippingFee)

  const cartData = useMemo(() => {
    return getCartData(cartItems, products)
  }, [cartItems, products])

  const cartDataWithStock = useMemo(() => {
    return cartData.map((item) => {
      const inventoryItem = item.product?.inventory?.find(
          (entry) => entry.size === item.size
      )

      const availableStock = Number(inventoryItem?.quantity || 0)
      const isOutOfStock = availableStock <= 0
      const exceedsStock = item.quantity > availableStock

      return {
        ...item,
        availableStock,
        isOutOfStock,
        exceedsStock,
      }
    })
  }, [cartData])

  const hasCartIssues = useMemo(() => {
    return cartDataWithStock.some((item) => item.isOutOfStock || item.exceedsStock)
  }, [cartDataWithStock])

  const subtotal = useMemo(() => {
    return getCartSubtotal(cartDataWithStock)
  }, [cartDataWithStock])

  const total = useMemo(() => {
    return getCartTotal(subtotal, shippingFee, cartDataWithStock.length > 0)
  }, [subtotal, shippingFee, cartDataWithStock])

  const getQuantityOptions = (availableStock) => {
    const max = Math.max(1, Math.min(MAX_QTY_OPTIONS, availableStock))
    return Array.from({ length: max }, (_, i) => i + 1)
  }

  return (
      cartDataWithStock.length > 0 ? (
          <div className="pt-10">
            <div className="text-2xl mb-8">
              <Title text1="YOUR" text2="CART" />
            </div>

            {hasCartIssues && (
                <div className="mb-6 border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded">
                  Some items in your cart are no longer available in the selected quantity. Please update your cart before checking out.
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
              <div>
                {cartDataWithStock.map((item) => {
                  const previewImage = item.product?.images?.[0] || ''

                  return (
                      <div
                          key={`${item.productId}-${item.size}`}
                          className="py-6 border-t text-gray-700 grid grid-cols-[4fr_1fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                      >
                        <div className="flex items-start gap-6">
                          <img
                              className="w-20 sm:w-24"
                              src={previewImage}
                              alt={item.product.name}
                          />

                          <div>
                            <p className="text-xs sm:text-lg font-medium">
                              {item.product.name}
                            </p>

                            <div className="flex items-center gap-5 mt-2 flex-wrap">
                              <p>
                                {currency}{item.product.price}
                              </p>

                              <span className="px-2 sm:px-3 sm:py-1 text-sm sm:text-base">
                                                    Size: {item.size}
                                                </span>

                              <span className="flex items-center gap-2 text-sm sm:text-base">
                                                    QTY:
                                                    <select
                                                        value={
                                                          item.isOutOfStock
                                                              ? 1
                                                              : Math.min(item.quantity, Math.max(item.availableStock, 1))
                                                        }
                                                        disabled={item.isOutOfStock}
                                                        onChange={(e) =>
                                                            dispatch(updateCartQuantity({
                                                              productId: item.productId,
                                                              size: item.size,
                                                              quantity: Number(e.target.value)
                                                            }))
                                                        }
                                                        className="border rounded px-2 py-1"
                                                    >
                                                        {getQuantityOptions(item.availableStock).map((qty) => (
                                                            <option key={qty} value={qty}>
                                                              {qty}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </span>
                            </div>

                            <div className="mt-2 text-sm">
                              {item.isOutOfStock ? (
                                  <p className="text-red-500 font-medium">
                                    Out of stock
                                  </p>
                              ) : item.exceedsStock ? (
                                  <p className="text-red-500 font-medium">
                                    Only {item.availableStock} left in stock
                                  </p>
                              ) : item.availableStock <= 5 ? (
                                  <p className="text-orange-500 font-medium">
                                    Only {item.availableStock} left! Checkout now
                                  </p>
                              ):null}
                            </div>

                            {item.exceedsStock && !item.isOutOfStock && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(updateCartQuantity({
                                          productId: item.productId,
                                          size: item.size,
                                          quantity: item.availableStock
                                        }))
                                    }
                                    className="mt-2 text-sm underline cursor-pointer"
                                >
                                  Update to available quantity
                                </button>
                            )}
                          </div>
                        </div>

                        <div />

                        <div>
                          <button
                              onClick={() =>
                                  dispatch(
                                      removeFromCart({
                                        productId: item.productId,
                                        size: item.size,
                                      })
                                  )
                              }
                              className="text-sm underline justify-self-end hover:font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                  )
                })}
              </div>

              <div className="w-full lg:w-100 mb-10">
                <OrderSummary
                    currency={currency}
                    subtotal={subtotal}
                    shippingFee={shippingFee}
                    total={total}
                    title="Order Summary"
                >
                  <button
                      className="w-full bg-black text-white py-3 mt-6 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={hasCartIssues}
                      onClick={() => navigate('/checkout')}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </OrderSummary>
              </div>
            </div>
          </div>
      ) : (
          <div className="pt-10 mb-10">
            <div className="text-2xl mb-8">
              <Title text1="YOUR" text2="CART" />
            </div>

            <div className="border rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>

              <Link
                  to="/"
                  className="inline-block bg-black text-white px-6 py-3 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
      )
  )
}

export default Cart