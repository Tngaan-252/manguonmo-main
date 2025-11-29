import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderInfo = location.state?.orderInfo;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng tại Chóe</p>

        {orderInfo && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold">{orderInfo.orderNumber}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-semibold text-pink-500">
                {orderInfo.total.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giao hàng đến:</span>
              <span className="font-semibold text-right">{orderInfo.shipping.fullName}</span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6">
          Chúng tôi sẽ gọi điện xác nhận đơn hàng trong thời gian sớm nhất
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate("/products")}
            className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;