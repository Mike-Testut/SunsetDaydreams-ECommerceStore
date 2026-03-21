import React, {useMemo} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {removeFromCart, updateCartQuantity} from "../redux/features/shopSlice.js";
import Title from "../components/Title.jsx";
import {Link, useNavigate} from "react-router-dom";
import OrderSummary from "../components/OrderSummary.jsx";
import {getCartData, getCartSubtotal, getCartTotal} from "../utils/cartHelpers.js";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const products = useSelector(state => state.shop.products)
  const cartItems = useSelector(state => state.shop.cartItems)
  const currency = useSelector(state => state.shop.currency)
  const shippingFee = useSelector(state => state.shop.shippingFee)

  const cartData = useMemo(() => {
    return getCartData(cartItems, products)
  }, [cartItems, products])

  const subtotal = useMemo(() => {
    return getCartSubtotal(cartData)
  }, [cartData])

  const total = useMemo(() => {
    return getCartTotal(subtotal, shippingFee, cartData.length > 0)
  }, [subtotal, shippingFee, cartData])


  return (
      cartData.length > 0 ?
    <div className="pt-10">
      <div className="text-2xl mb-8">
        <Title text1="YOUR" text2="CART" />
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
      {/*  left side / cart items*/}
        <div>
          {cartData.map((item)=>(
              <div
                  key={`${item.productId}-${item.size}`}
                  className="py-6 border-t text-gray-700 grid grid-cols-[4fr_1fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
                {/*Product image and info*/}
                <div className="flex items-start gap-6">
                  <img
                      className="w-20 sm:w-24"
                      src={item.product.image[0]}
                      alt={item.product.name}
                  />

                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {item.product.name}
                    </p>

                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}{item.product.price}
                      </p>

                      {/* Show selected size */}
                      <span className="px-2 sm:px-3 sm:py-1 text-sm sm:text-base">
                      Size: {item.size}
                      </span>
                      <span className='flex items-center gap-2 text-sm sm:text-base'>
                        QTY:
                        <select
                            defaultValue={item.quantity}
                            onChange={(e)=>dispatch(updateCartQuantity({
                              productId: item.productId,
                              size: item.size,
                              quantity: Number(e.target.value)
                        }))}>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      </span>
                  </div>
                </div>
              </div>
                <div/>
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
          ))}
        </div>

      {/*  Right Side - Total Order Info*/}
        <div className="w-full lg:w-100 mb-10">
          <OrderSummary
              currency={currency}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              title="Order Summary"
          >
            {/* Checkout button */}
            <button
                className="w-full bg-black text-white py-3 mt-6 text-sm cursor-pointer"
                onClick={() => navigate('/checkout')}
            >
              PROCEED TO CHECKOUT
            </button>
          </OrderSummary>

        </div>
      </div>
    </div> :
    <div className="pt-10 mb-10">
      <div className="text-2xl mb-8">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>

        {/* Link back to home */}
        <Link
            to="/"
            className="inline-block bg-black text-white px-6 py-3 text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>

  )
}

export default Cart