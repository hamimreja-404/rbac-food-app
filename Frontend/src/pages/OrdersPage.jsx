import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";
import { orderAPI, paymentAPI } from "../services/api";
import { OrderCardSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import toast from "react-hot-toast";

// Helper to format currency
const formatCurrency = (amount, country) => {
  const symbol = country === "India" ? "₹" : "$";
  return `${symbol}${amount}`;
};
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const STATUS_ICONS = {
  saved: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-book-marked-icon lucide-book-marked"
      className="text-blue"
    >
      <path d="M10 2v8l3-3 3 3V2" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </svg>
  ),
  placed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  cancelled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-500"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};
export default function OrdersPage() {
  const { user, canCancelOrder, canUpdatePayment, canPlaceOrder } = useAuth();
  const { orders, loading, error, refetch } = useOrders();

  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [modalMode, setModalMode] = useState("update"); // 'update' or 'checkout'

  // 🧠 MISSING STATE ADDED: Tracks WHICH order the modal is operating on
  const [activeOrderForPayment, setActiveOrderForPayment] = useState(null);

  // UI RBAC LOGIC: If Member, default to 'pending' (Saved). Otherwise, 'all'.
  const isMember = user?.role === "member";
  const [activeStatus, setActiveStatus] = useState(isMember ? "saved" : "all");

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filtered =
    activeStatus === "all"
      ? safeOrders
      : safeOrders.filter((o) => o.status === activeStatus);

  // --- UNIFIED MODAL ACTION (Handles BOTH Checkout & Update) ---
  const handleModalSubmit = async () => {
    if (!paymentMethod.trim() || !activeOrderForPayment) return;
    setPaymentLoading(true);
    try {
      if (modalMode === "checkout") {
        // 🚀 Check Out action (Manager & Admin)
        await orderAPI.checkout(activeOrderForPayment, { paymentMethod });
        toast.success("Order placed successfully with payment method!");
      } else {
       
        await paymentAPI.update({
          orderId: activeOrderForPayment,
          paymentMethod,
        });
        toast.success("Payment method updated successfully!");
      }
      setPaymentModal(false);
      setPaymentMethod("");
      setActiveOrderForPayment(null);
      if (refetch) refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      toast.loading("Cancelling order...", { id: "cancel" });
      await orderAPI.cancel(orderId);
      toast.success("Order cancelled successfully! ❌", { id: "cancel" });
      if (refetch) refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order", {
        id: "cancel",
      });
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 pb-24 min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight">
            My Orders
          </h1>
          {/* 🛠️ ADDED: flex items-center gap-1.5 */}
          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            {orders?.length || 0} order{orders?.length !== 1 ? "s" : ""}
            <span className="mx-1 text-slate-300">•</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500 shrink-0" // shrink-0 ensures the icon never gets squished
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {user?.country}
          </p>
        </div>
      </div>

      {/* Swiggy-Style Status Filter Pills */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {isMember ? (
          <button className="shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition-all shadow-sm bg-orange-500 text-white border-orange-500 flex items-center gap-2">
            {STATUS_ICONS.saved} My Saved Orders
          </button>
        ) : (
          ["all", "saved", "placed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={[
                "shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition-all shadow-sm cursor-pointer flex items-center gap-2",
                activeStatus === s
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-300",
              ].join(" ")}
            >
              {/* 🧠 Logic: If it's 'all', show text. If specific status, show SVG + Text */}
              {s === "all" ? (
                "All Orders"
              ) : (
                <>
                  <span className={activeStatus === s ? "text-white" : ""}>
                    {STATUS_ICONS[s]}
                  </span>
                  {capitalize(s)}
                </>
              )}
            </button>
          ))
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-medium mb-6 flex items-center gap-2">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></span> {error}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-16">
          <EmptyState
            emoji="📦"
            title="No orders found"
            subtitle="Browse restaurants and add items to your cart to get started."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              country={user?.country}
              canCancel={canCancelOrder() && order.status === "saved"}
              canPlace={canPlaceOrder() && order.status === "saved"}
              canUpdate={canUpdatePayment()}
              onCancel={() => handleCancelOrder(order._id)}
              // 🧠 1. CHECKOUT MODAL TRIGGER
              onCheckout={() => {
                setActiveOrderForPayment(order._id);
                setPaymentMethod("Corporate Card"); // Default choice
                setModalMode("checkout");
                setPaymentModal(true);
              }}
              // 🧠 2. UPDATE MODAL TRIGGER
              onUpdatePayment={() => {
                setActiveOrderForPayment(order._id);
                setPaymentMethod(order.paymentMethod || "Corporate Card");
                setModalMode("update");
                setPaymentModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Unified Payment Modal */}
      <Modal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        title={
          modalMode === "checkout"
            ? "Confirm Order Payment"
            : "Update Payment Method"
        }
        footer={
          <div className="flex gap-3 w-full justify-end mt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setPaymentModal(false)}
            >
              Cancel
            </Button>
            <Button
              size="md"
              loading={paymentLoading}
              onClick={handleModalSubmit}
              className="bg-green-600 hover:bg-green-700 text-white border-0"
            >
              {modalMode === "checkout"
                ? "Confirm & Place Order"
                : "Save New Method"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5 p-2">
          {/* Dynamic Description based on Role & Mode */}
          <div
            className={`p-3 rounded-xl border ${user?.role === "admin" ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}
          >
            <p
              className={`text-xs font-bold flex items-center gap-2 ${user?.role === "admin" ? "text-blue-700" : "text-orange-700"}`}
            >
              {user?.role === "admin" ? (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-shield-check-icon lucide-shield-check"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>{" "}
                  ADMIN ACCESS
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-600"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m4.243 5.21 14.39 12.472" />
                  </svg>
                  MANAGER ACCESS (Locked)
                </span>
              )}
            </p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {user?.role === "admin"
                ? "You have permission to select or override the payment method for this transaction."
                : "Payment selection is restricted to Admins. This order will be processed using the default method."}
            </p>
          </div>

          <Input
            label="Payment Identifier"
            placeholder="e.g. Corporate Card"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            // 🧠 LOCK THE INPUT FOR MANAGERS
            disabled={user?.role !== "admin"}
            className={
              user?.role !== "admin"
                ? "bg-slate-100 opacity-70 cursor-not-allowed"
                : ""
            }
          />

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              Quick Select
              {user?.role !== "admin" && (
                <span className="text-orange-500 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-lock"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Corporate Card",
                "Shield Funds",
                "Stark Industries Acc",
                "UPI",
              ].map((m) => (
                <button
                  key={m}
                  // 🧠 PREVENT CLICKING FOR MANAGERS
                  onClick={() => user?.role === "admin" && setPaymentMethod(m)}
                  className={[
                    "text-xs font-bold px-4 py-2 rounded-lg border transition-all",
                    paymentMethod === m
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-slate-50 text-slate-600 border-slate-200",
                    user?.role === "admin"
                      ? "cursor-pointer hover:border-slate-300"
                      : "cursor-not-allowed opacity-60",
                  ].join(" ")}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
}

// Sub-component for individual orders
function OrderCard({
  order,
  country,
  canCancel,
  canPlace,
  canUpdate,
  onCancel,
  onCheckout,
  onUpdatePayment,
}) {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    await onCancel();
    setCancelling(false);
  };

  const statusColor =
    order.status === "placed"
      ? "bg-green-100 text-green-700 border-green-200"
      : order.status === "cancelled"
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-orange-100 text-orange-700 border-orange-200";

  return (
    <div className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Order Header */}
        <div className="flex items-start justify-between gap-3 mb-5 border-b border-slate-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                Order #{order._id?.slice(-6).toUpperCase() || "NEW"}
              </span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border uppercase tracking-wide transition-all ${statusColor}`}
              >
                {order.status || "saved"}
              </span>

              <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                💳 {order.paymentMethod || "Unpaid / Draft"}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now"}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Total
            </p>
            <p className="font-extrabold text-slate-900 text-xl group-hover:scale-105 transition-transform origin-right">
              {formatCurrency(order.totalAmount || 0, country)}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl group-hover:bg-slate-100/50 transition-colors">
          {(order.items || []).map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm font-medium text-slate-700"
            >
              <span className="flex items-center gap-2">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-xs font-bold text-slate-500 shadow-sm group-hover:border-slate-300 transition-colors">
                  {item.qty || item.quantity || 1}x
                </span>
                {item.name || item.menuItem?.name || "Menu Item"}
              </span>
              <span className="shrink-0 text-slate-900 font-bold">
                {formatCurrency(
                  (item.price || 0) * (item.qty || item.quantity || 1),
                  country,
                )}
              </span>
            </div>
          ))}
        </div>

        {/* 🚀 DYNAMIC ACTION FOOTER */}
        <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-3">
          {/* SCENARIO 1: PENDING ORDERS (Needs Checkout or Cancel) */}
          {order.status === "saved" && (
            <>
              {canCancel && (
                <button
                  disabled={cancelling}
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}

              {canPlace && (
                <button
                  onClick={onCheckout}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 shadow-sm transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  Select Payment & Place Order
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              )}

              {!canCancel && !canPlace && (
                <p className="text-sm font-medium text-orange-600 w-full py-3 rounded-xl text-center bg-orange-50 border border-orange-100 flex items-center justify-center gap-2">
                  <span className="animate-pulse">⏳</span> Waiting for Manager
                  approval
                </p>
              )}
            </>
          )}

          {/* SCENARIO 2: PLACED ORDERS (Admin Update vs Locked) */}
          {order.status === "placed" && (
            <>
              {canUpdate ? (
                // ADMIN: Can edit the payment method
                <button
                  onClick={onUpdatePayment}
                  className="w-full py-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-500 hover:text-white border border-blue-100 transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Update Payment Method
                </button>
              ) : (
                // MANAGER/MEMBER: Locked message
                <p className="text-sm font-medium text-slate-400 w-full py-3 rounded-xl text-center bg-slate-50 border border-slate-100 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Payment method locked (Admin only)
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
