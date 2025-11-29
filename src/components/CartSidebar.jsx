import React, { useContext } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ← THÊM DÒNG NÀY
import { CartContext } from "../contexts/CartContext";

const CartSidebar = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useContext(CartContext);

  const navigate = useNavigate(); // ← THÊM DÒNG NÀY

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Giỏ hàng của bạn
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Giỏ hàng trống</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-pink-50 p-3 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-pink-600 font-semibold">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-6 h-6 bg-white border border-pink-300 rounded flex items-center justify-center hover:bg-pink-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 bg-white border border-pink-300 rounded flex items-center justify-center hover:bg-pink-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 text-sm hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 bg-pink-50">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-700">Tổng cộng:</span>
                <span className="font-bold text-xl text-pink-600">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full bg-pink-500 text-white py-4 rounded-lg font-semibold hover:bg-pink-600 transition"
              >
                Thanh toán
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;