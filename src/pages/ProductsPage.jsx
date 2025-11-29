import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { supabase } from "../supabase";

const ProductsPage = () => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      try {
        let query = supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(100);

        if (filter !== "all") {
          query = query.eq("category", filter);
        }

        const { data, error } = await query;

        if (error) {
          console.error("❌ Lỗi load sản phẩm:", error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("❌ Lỗi:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [filter]);

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/checkout");
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400 mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">
            Đang tải sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sản phẩm của chúng tôi
      </h1>

      {/* Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 justify-center">
        {[
          { key: "all", label: "Tất cả" },
          { key: "classic", label: "Classic" },
          { key: "pastel", label: "Pastel" },
          { key: "pattern", label: "Họa tiết" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
              filter === btn.key
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-pink-100 text-pink-600 hover:bg-pink-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <p className="text-gray-600 mb-4 text-center">
        Tìm thấy <strong>{products.length}</strong> sản phẩm
      </p>

      {/* Product list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 && (
          <p className="text-gray-500 text-center col-span-full py-10">
            😔 Không có sản phẩm nào trong danh mục này.
          </p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x600?text=No+Image";
              }}
            />

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                {product.name}
              </h3>

              <p className="text-pink-600 font-bold text-xl mb-4">
                {new Intl.NumberFormat("vi-VN").format(product.price)}đ
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-pink-100 text-pink-600 py-2 rounded-full font-semibold hover:bg-pink-200 transition-colors duration-200 active:scale-95 flex items-center justify-center gap-2"
                  title="Thêm vào giỏ hàng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {/* <span className="hidden sm:inline">Thêm</span> */}
                </button>

                <button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-200 active:scale-95"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;