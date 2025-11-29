import React, { useContext, useState, useRef, useEffect } from "react";
import { ShoppingCart, Search, User, LogOut, ChevronDown } from "lucide-react";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { cart, setIsCartOpen } = useContext(CartContext);
  const { role, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      const result = await logout();
      
      if (result?.success !== false) {
        console.log('✅ Redirecting to home...');
        navigate('/', { replace: true });
        window.location.href = '/';
      } else {
        console.error('❌ Logout failed:', result?.error);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Logout exception:', error);
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-wider text-gray-900">
              CHÓE
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-900 hover:text-pink-500 transition"
            >
              TRANG CHỦ
            </Link>

            <Link
              to="/products"
              className="text-sm font-medium text-gray-900 hover:text-pink-500 transition"
            >
              SẢN PHẨM
            </Link>

            {user && role === "admin" && !loading && (
              <Link
                to="/admin/products"
                className="text-sm font-medium text-pink-300 hover:text-pink-500 transition font-semibold"
              >
                ADMIN
              </Link>
            )}

            <Link
              to="/contact"
              className="text-sm font-medium text-gray-900 hover:text-pink-500 transition"
            >
              LIÊN HỆ
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:text-pink-500 transition">
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden md:block">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-pink-500 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              // Dropdown Menu cho Đăng nhập/Đăng ký
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 p-2 text-gray-700 hover:text-pink-500 transition"
                  title="Tài khoản"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Đăng nhập</span>
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <Link
                      to="/register"
                      state={{ isRegister: true }} 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Đăng ký</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-pink-500 transition"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;