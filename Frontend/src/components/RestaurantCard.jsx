import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const { user } = useAuth();

  // currency symbol based on the user's country
  const currency = user?.country === "India" ? "₹" : "$";

  const topDish =
    restaurant.menu && restaurant.menu.length > 0 ? restaurant.menu[0] : null;

  const quantity = topDish ? getItemQuantity(topDish._id) : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group flex flex-col h-full cursor-pointer relative">
      {/* 1. Image & Offers Banner */}
      <div
        className="relative h-48 overflow-hidden"
        onClick={() => navigate(`/restaurant/${restaurant._id}`)} // Clicking image goes to full menu
      >
        <img
          src={
            restaurant.image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-90"></div>

        <div className="absolute bottom-2 left-3 font-extrabold text-white text-lg tracking-tight">
          50% OFF UPTO {currency}100
        </div>
      </div>

      {/*  Restaurant Info */}
      <div
        className="p-4 flex-1"
        onClick={() => navigate(`/restaurant/${restaurant._id}`)} 
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded-md text-xs font-bold shrink-0">
            <span>★</span> {restaurant.rating || "New"}
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-1 mb-2">
          {restaurant.cuisine || "Multi-Cuisine"}
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
          <span className="flex items-center gap-1">
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
              class="lucide lucide-clock-icon lucide-clock"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>{" "}
            {restaurant.deliveryTime || "30-40 min"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
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
              class="lucide lucide-map-pin-icon lucide-map-pin"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>{" "}
            {restaurant.country}
          </span>
        </div>
      </div>

      {topDish && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Featured Dish
            </p>
            <p className="text-sm font-semibold text-slate-800 line-clamp-1">
              {topDish.name}
            </p>
            <p className="text-sm font-bold text-slate-900">
              {currency}
              {topDish.price}
            </p>
          </div>

          <div className="shrink-0">
            {quantity === 0 ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(topDish, restaurant);
                }}
                className="bg-white text-green-600 font-extrabold px-6 py-2 rounded-lg shadow-sm border border-green-200 hover:bg-green-50 hover:shadow-md transition-all uppercase text-sm cursor-pointer"
              >
                ADD
              </button>
            ) : (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center bg-white border border-green-500 rounded-lg shadow-sm overflow-hidden h-9 w-20"
              >
                <button
                  onClick={() => removeFromCart(topDish._id || topDish.id)}
                  className="flex-1 text-green-600 font-bold hover:bg-green-50 transition-colors h-full cursor-pointer"
                >
                  −
                </button>
                <span className="text-sm font-bold text-green-600 w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => addToCart(topDish, restaurant)}
                  className="flex-1 text-green-600 font-bold hover:bg-green-50 transition-colors h-full cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
