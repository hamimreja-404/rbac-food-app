# ForkIt — Frontend

React + Tailwind frontend for the RBAC Food Ordering system.

## Stack
- **React 18** + **Vite**
- **Tailwind CSS** — custom `brand` palette (orange-based)
- **React Router v6** — protected/guest routes
- **Axios** — API client with JWT interceptor
- **react-hot-toast** — notifications
- **jwt-decode** — client-side token parsing

## Project Structure

```
src/
├── context/
│   ├── AuthContext.jsx     # JWT decode, role helpers, login/logout
│   └── CartContext.jsx     # Cart state with useReducer
├── services/
│   └── api.js              # Axios instance + all API methods
├── hooks/
│   ├── useRestaurants.js   # Fetch all / single restaurant
│   └── useOrders.js        # Fetch orders, cancel order
├── utils/
│   └── helpers.js          # formatCurrency, statusClass, truncate etc.
├── components/
│   ├── Button.jsx          # Reusable Button (5 variants, 4 sizes)
│   ├── Input.jsx           # Reusable Input with label/error
│   ├── Modal.jsx           # Portal-based modal
│   ├── Navbar.jsx          # Sticky navbar with cart badge
│   ├── CartDrawer.jsx      # Slide-in cart (RBAC-gated place order)
│   ├── RestaurantCard.jsx  # Restaurant feed card
│   ├── MenuItemCard.jsx    # Menu item with qty stepper
│   ├── Skeletons.jsx       # Loading skeletons
│   └── EmptyState.jsx      # Empty state UI
├── pages/
│   ├── LoginPage.jsx       # Login + Register tabs
│   ├── HomePage.jsx        # Restaurant feed (Swiggy/Zomato style)
│   ├── RestaurantPage.jsx  # Menu grouped by category
│   └── OrdersPage.jsx      # My Orders + cancel + payment update
└── App.jsx                 # Routes with ProtectedRoute / GuestRoute
```

## RBAC — UI Behaviour

| Action              | Admin | Manager | Member |
|---------------------|-------|---------|--------|
| View restaurants    | ✅    | ✅      | ✅     | ✅
| Add to cart         | ✅    | ✅      | ✅     | ✅
| Save order          | ✅    | ✅      | ✅     | ✅
| **Place order**     | ✅    | ✅      | ❌     | ✅
| **Cancel order**    | ✅    | ✅      | ❌     | ✅
| **Update payment**  | ✅    | ❌      | ❌     | ✅

Country-based filtering happens automatically via the JWT `country` claim —
the backend only returns restaurants matching the user's country, and the
frontend shows the country label on the Navbar.

## Setup

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` → `http://localhost:5000`
(configure in `vite.config.js`).

## Environment

No `.env` needed for the frontend — the proxy handles the API base URL.
For production, set `VITE_API_URL` and update `api.js` accordingly.
