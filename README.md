# ForkIt | Enterprise RBAC Food Management

**ForkIt** is a high-performance, full-stack MERN application designed for corporate food ordering. It features a sophisticated **Role-Based Access Control (RBAC)** system and **Regional Data Isolation**, wrapped in a premium, Swiggy-inspired animated UI.

---

## Key Features

* ** Regional Data Isolation:** Automatic filtering ensures users only interact with restaurants and orders within their assigned country (e.g., India vs. America).
* ** Granular RBAC Matrix:**
    * **Admin:** Full system visibility, order management, and exclusive rights to override payment methods.
    * **Manager:** Oversight of regional orders, authority to approve "Saved" drafts, and checkout processing.
    * **Member:** Personal dashboard to browse menus and "Save" orders for higher-level approval.
* ** Dynamic Checkout Pipeline:** Seamless state transitions from `saved` → `placed` → `cancelled` with real-time UI feedback.
* ** Premium UI/UX:** Built with React 19 and Tailwind CSS v4, featuring "lift-on-hover" cards and custom SVG iconography.

---

##  Development Timeline (March 2026)

### **March 20th: Core Architecture & Security**
* **Auth System:** Implemented JWT-based authentication with custom `verifyToken` and `checkRole` middlewares.
* **Schema Design:** Architected MongoDB models for Users, Restaurants, and Orders with strict country-coding.
* **Context API:** Developed a synchronized Cart Context to handle persistence and RBAC-aware pricing.

### **March 21st: API Logic & Persistence**
* **Order Controllers:** Built the backend logic to distinguish between a "Saved" draft and a "Placed" order.
* **State Management:** Resolved critical "Double Nesting" data issues in the frontend hooks to ensure stable rendering.
* **Bug Fixing:** Patched 500-series server errors during the checkout handshake and refined database queries.

### **March 22nd: UI Hardening & Final Polish**
* **Animated Orders Page:** Created the Swiggy-style horizontal filter pills and implemented `hover:-translate-y-1` lift effects on order cards.
* **Unified Payment Modal:** Engineered a smart modal that dynamically locks inputs for Managers while granting full edit access to Admins.
* **SVG Icon System:** Migrated from library-dependent icons to raw, optimized SVGs to ensure 100% reliability and pixel-perfect alignment.
* **Responsive Layouts:** Fixed flexbox wrapping issues for SVG-text combinations and refined the "Manager Access Locked" visual indicators.

---

##  Tech Stack

* **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide (SVG logic), React Router 7.
* **Backend:** Node.js, Express, MongoDB, Mongoose.
* **Security:** JWT (JSON Web Tokens), Bcrypt.js.
* **Utilities:** Axios, React Hot Toast.

---

##  Security Gatekeeping

The application employs a three-tier validation process for every request:
1.  **Identity:** Validates the JWT signature.
2.  **Role:** Verifies the user's seniority level against the requested action.
3.  **Region:** Ensures the user is not attempting to access or modify data outside their assigned country.

---

## 📦 Installation

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/hamimreja-404//rbac-food-app.git](https://github.com/hamimreja-404//rbac-food-app.git)
    ```
2.  **Install Frontend & Backend Dependencies:**
    ```bash
    cd frontend && npm install
    cd ../backend && npm install
    ```
3.  **Setup Environment Variables (.env):**
    ```env
    PORT=5000
    MONGODB_URI=your_uri
    JWT_SECRET=your_secret
    ```
4.  **Launch:**
    ```bash
    npm run dev
    ```

---

**Developed with ❤️ by Hamim**