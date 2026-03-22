import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  // State to control the Cart Drawer visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate total items for the red notification badge
  const totalItems = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white text-xl">🍴</span>
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
              Fork<span className="text-orange-500">It</span>
            </span>
          </div>

          {/* Right: User Info & Cart */}
          <div className="flex items-center gap-6">
            
            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role} • {user?.country}</p>
              </div>
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+')}&background=f97316&color=fff`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm"
              />
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

            {/* CART BUTTON */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="hidden sm:block font-bold">Cart</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              
              {/* LIVE CART BADGE */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-fade-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              title="Logout"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>

          </div>
        </div>
      </nav>

      {/* Render the Drawer here so it overlays the whole screen when opened */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}