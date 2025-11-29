// src/admin/Login.jsx
import { useState } from "react";
import { signIn, getCurrentUser, getUserRole } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signIn(email, password);
      // lấy user id
      const user = await getCurrentUser();
      const role = await getUserRole(user?.id);
      if (role === "admin") {
        nav("/admin/dashboard");
      } else {
        alert("Tài khoản không có quyền admin.");
      }
    } catch (err) {
      alert(err.message || err.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: 420, background: "white", padding: 28, borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 8 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee", marginBottom: 12 }} />

          <label style={{ display: "block", marginBottom: 8 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee", marginBottom: 18 }} />

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#ff66a8", color: "white", border: "none", borderRadius: 8 }}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
