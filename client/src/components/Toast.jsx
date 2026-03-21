import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {hideToast} from "../redux/features/shopSlice.js";

const Toast = () => {
    const dispatch = useDispatch()
    const toast = useSelector(state => state.shop.toast)

    useEffect(() => {
        if (!toast.visible) return

        const timer = setTimeout(() => {
            dispatch(hideToast())
        }, 2000)

        return () => clearTimeout(timer)
    }, [toast.visible, dispatch])


    return (
        <div
            className={`fixed bottom-6 right-6 z-100 transition-all duration-300 ${
                toast.visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <div className="bg-black text-white px-5 py-3 rounded-xl shadow-lg text-sm">
                {toast.message}
            </div>
        </div>
    )
}
export default Toast
