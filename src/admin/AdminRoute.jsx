// src/admin/AdminRoute.jsx
import { useEffect, useState } from "react";
import { getCurrentUser, getUserRole } from "../services/authService";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState({ loading: true, allowed: false });

  useEffect(() => {
    (async () => {
      setStatus({ loading: true, allowed: false });
      const user = await getCurrentUser();
      if (!user) {
        setStatus({ loading: false, allowed: false });
        return;
      }
      const role = await getUserRole(user.id);
      setStatus({ loading: false, allowed: role === "admin" });
    })();
  }, []);

  if (status.loading) return <div style={{ padding: 40 }}>Đang kiểm tra quyền...</div>;

  if (!status.allowed) {
    // nếu không login thì điều hướng đến login, nếu login nhưng ko phải admin thì show thông báo
    const user = JSON.parse(localStorage.getItem("sb-user") || "null");
    if (!user) return <Navigate to="/admin/login" replace />;
    return <div style={{ padding: 40 }}>Bạn không có quyền truy cập Admin.</div>;
  }

  return children;
}
