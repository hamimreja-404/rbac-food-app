import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Corporate Card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeCart = cart || [];
  const itemTotal = safeCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const grandTotal = itemTotal + deliveryFee;
  const currency = user?.country === "India" ? "₹" : "$";

  const canCheckout = user?.role === "admin" || user?.role === "manager";

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;


  const submitOrder = async (autoCheckout = false) => {
    try {
      setIsSubmitting(true);

      const payload = {
        restaurant: safeCart[0]?.restaurantId,
        totalAmount: grandTotal,
        items: safeCart.map((item) => ({
          menuItem: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          qty: item.quantity,
          price: item.price,
        })),
      };

      const response = await orderAPI.create(payload);

      const orderData = response.data?.data || response.data;
      const newOrderId = orderData?._id || orderData?.id;

      if (!newOrderId) {
        throw new Error("Backend did not return an Order ID!");
      }

      if (autoCheckout && canCheckout) {
        await orderAPI.checkout(newOrderId, { paymentMethod });
        toast.success("Order placed successfully! 🎉");
      } else {
        toast.success("Order saved to database as Draft! ⏳");
      }

      clearCart();
      onClose();
      navigate("/orders");
    } catch (error) {
      console.error("Order Submission Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to process order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-50 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">
            Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {safeCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <span className="text-5xl">🛒</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Your cart is empty
              </h3>
              <button
                onClick={onClose}
                className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors cursor-pointer"
              >
                No Items in Cart
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
                {safeCart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">
                        From: {item.restaurantName}
                      </p>
                      <p className="font-bold text-slate-900 text-sm">
                        {currency}
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center bg-white border border-green-500 rounded-lg shadow-sm overflow-hidden h-8 w-20 shrink-0 mt-1">
                      <button
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="flex-1 text-green-600 font-bold hover:bg-green-50 h-full cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-xs font-bold text-green-600 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          addToCart(item, {
                            _id: item.restaurantId,
                            name: item.restaurantName,
                          })
                        }
                        className="flex-1 text-green-600 font-bold hover:bg-green-50 h-full cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">
                  Bill Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Item Total</span>
                    <span>
                      {currency}
                      {itemTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>
                      {currency}
                      {deliveryFee}
                    </span>
                  </div>
                  <hr className="border-slate-100 border-dashed" />
                  <div className="flex justify-between font-bold text-slate-900 text-base">
                    <span>To Pay</span>
                    <span>
                      {currency}
                      {grandTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Checkout Area */}
        {safeCart.length > 0 && (
          <div className="bg-white p-4 border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-3">
            <button
              disabled={isSubmitting}
              onClick={() => submitOrder(false)}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {isSubmitting ? "Saving..." : "Save Order"}
            </button>

            {canCheckout ? (
              <div className="space-y-3">
                {/* 🔒 RBAC ENFORCED PAYMENT SELECTOR */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    Payment Method{" "}
                    {!isAdmin && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"
                      >
                        <circle cx="12" cy="16" r="1" />
                        <rect x="3" y="10" width="18" height="12" rx="2" />
                        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                      </svg>
                    )}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={!isAdmin}
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none transition-colors ${isAdmin ? "focus:border-green-500 cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
                  >
                    <option value="Corporate Card">Corporate Card</option>
                    <option value="Stark Industries Acc">
                      Stark Industries Acc
                    </option>
                    <option value="Shield Funds">Shield Funds</option>
                    <option value="UPI">UPI</option>
                  </select>

                  {/* Warning message for Managers */}
                  {!isAdmin && (
                    <p className="text-[10px] font-bold text-orange-600 mt-1.5 flex items-center gap-1">
                      <span className="text-[12px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                      </span>{" "}
                      This option is limited to Admins.
                    </p>
                  )}
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={() => submitOrder(true)}
                  className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-between px-6 transition-all bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <span>
                    {currency}
                    {grandTotal}
                  </span>
                  <span className="flex items-center gap-2">
                    Place Order{" "}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-2 items-start text-xs text-orange-800">
                <p>
                  <strong>Member Role:</strong> You can save this order, but
                  only Admins and Managers can place the final order.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
