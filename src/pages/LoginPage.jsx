import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // ----- LOGIN -----
        // Kiểm tra xem có phải admin không
        const isAdmin = await checkIfAdmin(formData.email);
        
        // Chỉ kiểm tra email tồn tại nếu KHÔNG phải admin
        if (!isAdmin) {
          const emailExists = await checkEmailExists(formData.email);
          
          if (!emailExists) {
            setError("Email này chưa được đăng ký. Vui lòng đăng ký tài khoản trước.");
            setLoading(false);
            return;
          }
        }

        const result = await login(formData.email, formData.password);
        if (result.success) {
          // Redirect đến trang được yêu cầu hoặc trang chủ
          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        } else {
          setError(result.error || "Email hoặc mật khẩu không đúng");
        }
      } else {
        // ----- REGISTER -----
        // VALIDATION
        if (!formData.name.trim()) {
          setError("Vui lòng nhập họ và tên");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Mật khẩu phải có ít nhất 6 ký tự");
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Mật khẩu xác nhận không khớp");
          setLoading(false);
          return;
        }

        // Kiểm tra email đã tồn tại chưa
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          setError("Email này đã được đăng ký. Vui lòng đăng nhập.");
          setLoading(false);
          return;
        }

        const result = await register(
          formData.email,
          formData.password,
          formData.name
        );

        if (result.success) {
          setError("");
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          // Reset form và chuyển sang chế độ đăng nhập
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setIsLogin(true);
        } else {
          setError(result.error || "Không thể đăng ký. Vui lòng thử lại.");
        }
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hàm kiểm tra xem có phải admin không
  const checkIfAdmin = async (email) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Lỗi kiểm tra admin:", error);
        return false;
      }

      console.log("✅ Kiểm tra admin:", data?.role);
      return data?.role === "admin";
    } catch (error) {
      console.error("Exception kiểm tra admin:", error);
      return false;
    }
  };

  // ✅ Hàm kiểm tra email có tồn tại không
  const checkEmailExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      // PGRST116 = No rows returned (email chưa tồn tại)
      if (error && error.code === "PGRST116") {
        return false;
      }

      if (error) {
        console.error("Lỗi kiểm tra email:", error);
        return false;
      }

      console.log("✅ Email tồn tại:", !!data);
      return !!data;
    } catch (error) {
      console.error("Exception kiểm tra email:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-200/50 p-8 border border-pink-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full mb-4">
              <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
              {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? "Đăng nhập để tiếp tục" : "Đăng ký tài khoản mới"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-400 text-rose-700 px-4 py-3 rounded-lg mb-6 animate-shake">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Họ và tên <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-pink-50/50 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-white transition-all duration-200"
                  placeholder="Nhập họ và tên của bạn"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-50/50 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-white transition-all duration-200"
                placeholder="example@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mật khẩu <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-50/50 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-white transition-all duration-200"
                placeholder={isLogin ? "Nhập mật khẩu" : "Tối thiểu 6 ký tự"}
                disabled={loading}
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  💡 Mật khẩu phải có ít nhất 6 ký tự
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Xác nhận mật khẩu <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-pink-50/50 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-white transition-all duration-200"
                  placeholder="Nhập lại mật khẩu"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 hover:from-pink-400 hover:via-rose-400 hover:to-pink-400 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Đăng nhập
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Đăng ký
                    </>
                  )}
                </span>
              )}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="text-pink-400 hover:text-pink-500 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
              disabled={loading}
            >
              {isLogin
                ? "Chưa có tài khoản? Đăng ký ngay 💗"
                : "Đã có tài khoản? Đăng nhập 🌸"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Bằng việc đăng nhập/đăng ký, bạn đồng ý với{" "}
            <a href="/terms" className="text-pink-400 hover:text-pink-500 underline">
              Điều khoản sử dụng
            </a>{" "}
            của chúng tôi
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default LoginPage;