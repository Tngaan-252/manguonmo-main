import React from "react";

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Liên hệ với chúng tôi
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Địa chỉ</h3>
              <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p className="text-gray-600">contact@choe.vn</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Điện thoại</h3>
              <p className="text-gray-600">0123 456 789</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Giờ làm việc</h3>
              <p className="text-gray-600">Thứ 2 - Thứ 7: 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Gửi tin nhắn</h2>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-300"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-300"
              />
            </div>
            <div>
              <textarea
                placeholder="Nội dung tin nhắn"
                rows="4"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
