import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useRestaurants } from "../hooks/useRestaurants";
import RestaurantCard from "../components/RestaurantCard";
import { RestaurantCardSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";

// Simplified Swiggy-style Filter Pills
const FILTERS = ["Sort: High to Low", "Fast Delivery", "Ratings 4.0+"];

// Updated categories to match typical food delivery cuisines/items
const CATEGORIES = [
  {
    name: "Biryani",
    img: "https://images.unsplash.com/photo-1736680056325-ba2ade6250a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyeWFuaXxlbnwwfDJ8MHx8fDA%3D",
  },
  {
    name: "Pizza",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop",
  },
  {
    name: "Burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop",
  },
  {
    name: "North Indian",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=150&h=150&fit=crop",
  },
  {
    name: "South Indian",
    img: "https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=150&h=150&fit=crop",
  },
  {
    name: "Desserts",
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&h=150&fit=crop",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { restaurants, loading, error } = useRestaurants();

  // States for all our different UI controls
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // 🧠 The "Derived State" Pipeline
  // useMemo ensures this heavy filtering only runs when the dependencies change
  const processedRestaurants = useMemo(() => {
    let processed = [...(restaurants || [])];

    // 1. TEXT SEARCH (Checks name and cuisine)
    if (search) {
      const q = search.toLowerCase();
      processed = processed.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.cuisine?.toLowerCase().includes(q),
      );
    }

    // 2. CATEGORY CLICK ("What's on your mind?")
    if (activeCategory) {
      const cat = activeCategory.toLowerCase();
      processed = processed.filter(
        (r) =>
          r.cuisine?.toLowerCase().includes(cat) ||
          r.name?.toLowerCase().includes(cat) ||
          r.menu?.some((item) => item.name?.toLowerCase().includes(cat)), // Even searches inside the menu!
      );
    }

    // 3. PILL FILTERS
    if (activeFilter === "Ratings 4.0+") {
      processed = processed.filter((r) => r.rating >= 4.0);
    }

    if (activeFilter === "Fast Delivery") {
      // Assuming deliveryTime is a string like "15-25 min". We extract the first number.
      processed = processed.filter((r) => {
        const minTime = parseInt(r.deliveryTime);
        return minTime && minTime <= 30; // Anything starting with 30 mins or less is "Fast"
      });
    }

    // 4. SORTING
    if (activeFilter === "Sort: High to Low") {
      processed.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return processed;
  }, [restaurants, search, activeCategory, activeFilter]);

  // Handler to toggle categories on and off
  const handleCategoryClick = (categoryName) => {
    setActiveCategory((prev) => (prev === categoryName ? "" : categoryName));
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. Header / Search Section */}
      <section className="bg-slate-50 pt-8 pb-6 px-4 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight">
                Hey {user?.name}, what's for dinner?
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-1 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                Delivering to{" "}
                <span className="text-orange-500 font-bold border-b border-orange-500 border-dashed pb-0.5">
                  {user?.country}
                </span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search for restaurants and food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* 2. "What's on your mind?" (Category Carousel) */}
        {!search && (
          <section className="mb-10 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                What's on your mind?
              </h2>
              {/* Show clear button if a category is active */}
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory("")}
                  className="text-sm font-bold text-orange-500 hover:text-orange-600"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {CATEGORIES.map((cat, idx) => {
                const isActive = activeCategory === cat.name;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex flex-col items-center gap-3 shrink-0 snap-start cursor-pointer group"
                  >
                    <div
                      className={`w-24 h-24 rounded-full overflow-hidden transition-all duration-300 ${
                        isActive
                          ? "ring-4 ring-orange-500 ring-offset-2 scale-95 opacity-100"
                          : "shadow-sm group-hover:shadow-md opacity-90 group-hover:opacity-100"
                      }`}
                    >
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span
                      className={`text-sm ${isActive ? "font-bold text-orange-600" : "font-semibold text-slate-700"}`}
                    >
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!search && <hr className="border-t-2 border-slate-100 mb-10" />}

        {/* 3. Main Restaurant Feed */}
        <section>
          <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-6">
            {search || activeCategory
              ? `Results for "${search || activeCategory}"`
              : `Restaurants with online food delivery in ${user?.country}`}
          </h2>

          {/* Sticky Filters Row */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto scrollbar-hide mb-6 border-b border-slate-100">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(isActive ? "" : f)}
                  className={[
                    "shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 shadow-sm",
                    isActive
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-700 border-slate-300 hover:shadow-md hover:border-slate-400",
                  ].join(" ")}
                >
                  {f}
                  {/* Shows an X if active, or a sort icon if it's the sort button */}
                  {isActive ? (
                    <svg
                      className="w-4 h-4"
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
                  ) : f.includes("Sort") ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-2 mb-6">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* The Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))
            ) : processedRestaurants.length > 0 ? (
              processedRestaurants.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))
            ) : (
              <div className="col-span-full py-12">
                <EmptyState
                  emoji="🔍"
                  title="No matches found"
                  subtitle={`We couldn't find anything matching your filters in ${user?.country}.`}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
