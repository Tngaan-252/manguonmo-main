import { useState } from "react";
import { addProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
// Ví dụ lỗi thường gặp:
import { supabase } from "../supabase"; // ← Kiểm tra đường dẫn này

// Hoặc
// import { useAuth } from "../contexts/AuthContext"; // ← Đường dẫn có đúng không?

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("classic");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await addProduct({
        name,
        price: Number(price),
        category,
        file,
      });

      alert("Đã thêm sản phẩm thành công!");
      nav("/products"); // 🟢 quay về trang sản phẩm
    } catch (err) {
      alert(err.message || "Lỗi khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  // Style chung
  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    background: "white",
    boxSizing: "border-box",
  };

  const group = {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  return (
    <div
      style={{
        padding: "32px 20px",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "26px",
        }}
      >
        Thêm sản phẩm
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Tên */}
        <div style={group}>
          <label>Tên sản phẩm</label>
          <input
            style={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Giá */}
        <div style={group}>
          <label>Giá</label>
          <input
            style={input}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Phân loại */}
        <div style={group}>
          <label>Phân loại</label>
          <select
            style={{ ...input, appearance: "auto" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="classic">Classic</option>
            <option value="pastel">Pastel</option>
            <option value="pattern">Họa tiết</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* Ảnh */}
        <div style={group}>
          <label>Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "4px" }}
          />
        </div>

        {/* Nút lưu */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </form>
    </div>
  );
}
