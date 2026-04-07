import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { API_URL } from '../config/api.js'
import Title from '../components/Title.jsx'
import { clearCart } from '../redux/features/shopSlice.js'

const OrderPlaced = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionData, setSessionData] = useState(null)
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('No payment session was found.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/order/stripe/session/${sessionId}`)
        const contentType = response.headers.get('content-type') || ''
        const data = contentType.includes('application/json')
          ? await response.json()
          : null

        if (!response.ok || !data?.success) {
          setError(data?.message || 'Could not verify payment session')
          return
        }

        setSessionData(data.session)
        setOrderNumber(data.orderNumber || '')

        const hasPaid = data.session?.payment_status === 'paid'
        const clearKey = sessionId ? `clearedCart:${sessionId}` : null

        if (hasPaid && clearKey && !sessionStorage.getItem(clearKey)) {
          dispatch(clearCart())
          sessionStorage.setItem(clearKey, 'true')
        }
      } catch (error) {
        console.log(error)
        setError('Something went wrong verifying your payment')
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [dispatch, sessionId])

  if (loading) {
    return (
        <div className="pt-10">
          <div className="text-2xl mb-8">
            <Title text1="ORDER" text2="CONFIRMED" />
          </div>

          <div className="border rounded-lg p-8 bg-white max-w-2xl">
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="pt-10">
        <div className="text-2xl mb-8">
          <Title text1="ORDER" text2="CONFIRMED" />
        </div>

        <div className="border rounded-lg p-8 bg-white max-w-2xl">
          {error ? (
              <>
                <p className="text-red-500 mb-4">{error}</p>
                <p className="text-gray-600 mb-6">
                  If your payment was successful, your order may still be processing.
                </p>
              </>
          ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Thank you! Your payment was received.
                </p>

                <p className="text-gray-600 mb-6">
                  Your order is being processed now.
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Order Number:</span> {orderNumber || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span> {sessionData?.payment_status}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {sessionData?.customer_email || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Amount Paid:</span>{' '}
                    {sessionData?.amount_total != null
                        ? `$${(sessionData.amount_total / 100).toFixed(2)}`
                        : '-'}
                  </p>
                </div>
              </>
          )}

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link
                to="/account/orders"
                className="inline-block bg-black text-white px-6 py-3 text-sm"
            >
              View My Orders
            </Link>

            <Link
                to="/"
                className="inline-block border px-6 py-3 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
  )
}

export default OrderPlaced
