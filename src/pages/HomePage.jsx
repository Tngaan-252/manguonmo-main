import React from "react";
import { Heart, Package, ShoppingCart } from "lucide-react";
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-pink-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Chào mừng đến với Chóe
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Túi tote thời trang - Phong cách riêng của bạn
          </p>
         
            <Link 
                to="/products"
                className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition inline-block text-center">
                Khám phá ngay
            </Link>
   
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Câu chuyện thương hiệu
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwqypqesx3a1dc_tn.webp"
                alt="Brand"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-4">
                Chóe được sinh ra từ niềm đam mê với túi tote và phong cách sống
                tối giản. Chúng tôi tin rằng một chiếc túi không chỉ đơn thuần
                là phụ kiện, mà còn là biểu tượng của cá tính và lối sống.
              </p>
              <p className="text-gray-600">
                Mỗi sản phẩm của Chóe đều được thiết kế và sản xuất tỉ mỉ, với
                chất liệu canvas cao cấp và màu sắc pastel nhẹ nhàng, mang đến
                sự thoải mái và phong cách cho người sử dụng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Tại sao chọn Chóe?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Thiết kế độc đáo</h3>
              <p className="text-gray-600">
                Phong cách tối giản, màu sắc pastel nhẹ nhàng
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Chất liệu cao cấp</h3>
              <p className="text-gray-600">
                Canvas bền đẹp, thân thiện môi trường
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Giá cả hợp lý</h3>
              <p className="text-gray-600">
                Chất lượng tốt với mức giá phải chăng
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
