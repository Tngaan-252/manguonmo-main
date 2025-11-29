// src/admin/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";

export default function AdminDashboard() {
  const nav = useNavigate();

  async function handleLogout() {
    await signOut();
    nav("/");
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Dashboard</h1>
        <div>
          <button onClick={() => nav("/admin/products")} style={{ marginRight: 12 }}>Quản lý sản phẩm</button>
          <button onClick={handleLogout} style={{ background: "#ff6b6b", color: "white", padding: "8px 12px", borderRadius: 6 }}>Đăng xuất</button>
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h3>Thống kê nhanh</h3>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div>Số sản phẩm</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>—</div>
          </div>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div>Đơn hàng</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>—</div>
          </div>
        </div>
      </section>
    </div>
  );
}
