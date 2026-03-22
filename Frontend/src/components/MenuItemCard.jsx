import { useCart } from '../context/CartContext';
import { foodPlaceholder, formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function MenuItemCard({ item, restaurantId, restaurantName, country }) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const { user } = useAuth();
  
  const qty = getItemQuantity(item._id || item.id);
  const imgSrc = item.image || foodPlaceholder(item.name);
  const restaurantObj = { _id: restaurantId, name: restaurantName };

  // Mocking a veg/non-veg flag (you can replace this with item.isVeg from your DB later)
  const isVeg = !item.name.toLowerCase().includes('chicken') && !item.name.toLowerCase().includes('meat');

  return (
    <div className="flex justify-between items-start py-8 border-b border-slate-200/60 last:border-0 group">
      
      {/* LEFT SIDE: Item Details */}
      <div className="flex-1 pr-6 max-w-[70%]">
        
        {/* Veg / Non-Veg Icon */}
        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center mb-2 ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>

        {/* Title & Price */}
        <h3 className="font-extrabold text-lg text-slate-800 tracking-tight mb-1 group-hover:text-orange-500 transition-colors">
          {item.name}
        </h3>
        <p className="font-bold text-slate-900 mb-3 text-base">
          {formatCurrency(item.price, country || user?.country)}
        </p>

        {/* Rating/Tagline (Mock feature to make it look premium) */}
        <div className="items-center gap-1 text-xs font-bold text-orange-500 mb-3 bg-orange-50 inline-block px-2 py-0.5 rounded-md">
          ★ Bestseller
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 pr-4">
          {item.description || `A highly recommended, mouth-watering portion of our signature ${item.name}. Prepared fresh with authentic ingredients.`}
        </p>
      </div>

      {/* RIGHT SIDE: Image & Overlapping Button */}
      <div className="relative shrink-0 flex flex-col items-center mt-2">
        
        {/* Food Image */}
        <div className="w-32.5 h-32.5 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
          <img
            src={imgSrc}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.target.src = foodPlaceholder(item.name); }}
          />
        </div>

        {/* The Overlapping Swiggy-Style Button */}
        <div className="absolute -bottom-4 z-10 drop-shadow-md">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(item, restaurantObj)}
              className="w-28 h-10 bg-white text-green-600 font-extrabold rounded-xl border border-slate-200 hover:bg-slate-50 hover:shadow-lg transition-all uppercase text-[15px] tracking-wide cursor-pointer flex items-center justify-center"
            >
              ADD
            </button>
          ) : (
            <div className="w-28 h-10 flex items-center justify-between bg-white border border-green-600 rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => removeFromCart(item._id || item.id)}
                className="w-10 text-green-600 font-extrabold hover:bg-green-50 transition-colors h-full text-xl cursor-pointer flex items-center justify-center"
              >
                −
              </button>
              <span className="text-[15px] font-extrabold text-green-600 w-4 text-center">
                {qty}
              </span>
              <button
                onClick={() => addToCart(item, restaurantObj)}
                className="w-10 text-green-600 font-extrabold hover:bg-green-50 transition-colors h-full text-xl cursor-pointer flex items-center justify-center"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}