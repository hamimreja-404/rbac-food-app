import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../hooks/useRestaurants';
import MenuItemCard from '../components/MenuItemCard';
import { MenuItemSkeleton } from '../components/Skeletons';
import { restaurantPlaceholder } from '../utils/helpers';
import { useCart } from '../context/CartContext';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurant, loading, error } = useRestaurant(id);
  
  // 1. Grab the cart array to calculate the item count manually
  const { cart } = useCart();
  const itemCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

  // Group menu items alphabetically by first letter as "categories"
  const categories = useMemo(() => {
    if (!restaurant?.menu?.length) return {};
    const CATS = {
      Starters:    [],
      Mains:       [],
      Sides:       [],
      Desserts:    [],
      Beverages:   [],
    };
    restaurant.menu.forEach((item, idx) => {
      const catKeys = Object.keys(CATS);
      CATS[catKeys[idx % catKeys.length]].push(item);
    });
    return Object.fromEntries(Object.entries(CATS).filter(([, v]) => v.length > 0));
  }, [restaurant]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-body">{error}</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-body text-gray-500 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Restaurants
      </button>

      {/* Restaurant Hero */}
      {loading ? (
        <div className="h-56 rounded-3xl bg-gray-200 animate-pulse mb-8" />
      ) : (
        <section className="relative h-56 rounded-3xl overflow-hidden mb-8 shadow-card">
          <img
            src={restaurant?.image}
            alt={restaurant?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="font-display font-extrabold text-3xl mb-1">{restaurant?.name}</h1>
            <div className="flex items-center gap-3 text-sm text-white/80 font-body">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span> 4.3 (200+ ratings)
              </span>
              <span>·</span>
              <span>30–40 mins</span>
              <span>·</span>
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
        </section>
      )}

      {/* Menu */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-gray-900">Menu</h2>
          {itemCount > 0 && (
            <div className="flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-body font-semibold px-4 py-2 rounded-xl shadow-sm">
              <span>🛒</span>
              {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <MenuItemSkeleton key={i} />)}
          </div>
        ) : (
          Object.entries(categories).map(([cat, items]) => (
            <div key={cat} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display font-bold text-lg text-gray-800">{cat}</h3>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-body text-gray-400">{items.length} items</span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    restaurantId={id}
                    restaurantName={restaurant?.name}
                    country={restaurant?.country}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}