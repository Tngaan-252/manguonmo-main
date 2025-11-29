// src/admin/EditProduct.jsx
import { useEffect, useState } from "react";
import { getProducts, updateProduct } from "../services/productService";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const all = await getProducts();
        const p = all.find(x => String(x.id) === String(id));
        if (!p) {
          alert("Không tìm thấy sản phẩm");
          nav("/admin/products");
          return;
        }
        setProduct(p);
        setName(p.name);
        setPrice(p.price);
      } catch (err) {
        console.error("❌ Lỗi load sản phẩm:", err);
        alert("Lỗi load sản phẩm: " + err.message);
      }
    })();
  }, [id, nav]); // ✅ FIX: Thêm dependencies

  async function handleSubmit(e) {
    e.preventDefault();
    
    console.log("=== BẮT ĐẦU UPDATE ===");
    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Price:", price);
    console.log("File:", file);
    
    try {
      const result = await updateProduct(id, { name, price, file });
      console.log("✅ KẾT QUẢ:", result);
      alert("Cập nhật thành công!");
      nav("/admin/products");
    } catch (err) {
      console.error("❌ LỖI UPDATE:", err);
      console.error("Chi tiết:", err.message);
      alert("Lỗi: " + (err.message || "Không rõ"));
    }
  }

  if (!product) return <div style={{ padding: 24 }}>Đang tải...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Sửa sản phẩm</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, marginTop: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Tên</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} 
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Giá</label>
          <input 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} 
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Ảnh mới (nếu muốn thay)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
        </div>
        <div>
          <button 
            type="submit" 
            style={{ 
              padding: "10px 16px", 
              background: "#24a0ed", 
              color: "white", 
              borderRadius: 6,
              border: "none",
              cursor: "pointer"
            }}
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}