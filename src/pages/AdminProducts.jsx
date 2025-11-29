import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // <-- nhớ tạo file supabase.js

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = [
    { id: "classic", name: "Classic" },
    { id: "pastel", name: "Pastel" },
    { id: "pattern", name: "Họa Tiết" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image_url: "",
    category: "",
  });

  // ===========================
  // 1. LOAD SẢN PHẨM TỪ SUPABASE
  // ===========================
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setProducts(data);
  };

  useEffect(() => {
    loadProducts();

    // ===========================
    // 2. REALTIME: TỰ CẬP NHẬT
    // ===========================
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => loadProducts()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ===========================
  // 3. HANDLE FORM INPUT
  // ===========================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===========================
  // 4. THÊM SẢN PHẨM (SUPABASE)
  // ===========================
  const addProduct = async () => {
    if (!formData.name || !formData.price || !formData.image_url || !formData.category) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const priceNumber = Number(formData.price.replace(/\./g, ""));

    const { error } = await supabase.from("products").insert([
      {
        name: formData.name,
        price: priceNumber,
        image_url: formData.image_url,
        category: formData.category,
      },
    ]);

    if (!error) {
      resetForm();
    }
  };

  // ===========================
  // 5. CẬP NHẬT SẢN PHẨM
  // ===========================
  const updateProduct = async () => {
    const priceNumber = Number(formData.price.replace(/\./g, ""));

    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        price: priceNumber,
        image_url: formData.image_url,
        category: formData.category,
      })
      .eq("id", editingProduct.id);

    if (!error) resetForm();
  };

  // ===========================
  // 6. XÓA SẢN PHẨM
  // ===========================
  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await supabase.from("products").delete().eq("id", id);
    }
  };

  // ===========================
  // 7. SỬA SẢN PHẨM
  // ===========================
  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: new Intl.NumberFormat("vi-VN").format(product.price),
      image_url: product.image_url,
      category: product.category,
    });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", image_url: "", category: "" });
  };

  const filteredProducts =
    filterCategory === "all" ? products : products.filter((p) => p.category === filterCategory);

  // ===========================
  // 8. UI – GIỮ NGUYÊN 100%
  // ===========================
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffd6e8 0%, #ffeaf3 100%)",
      padding: "30px 20px",
      fontFamily: "Arial, sans-serif",
    },
    content: {
      maxWidth: "1100px",
      margin: "auto",
      background: "rgba(255, 255, 255, 0.95)",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(255, 182, 193, 0.3)",
    },
    title: {
      textAlign: "center",
      marginBottom: "30px",
      color: "#d4649f",
      fontSize: "32px",
      fontWeight: "600",
    },
    filterBox: {
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    label: {
      fontWeight: "500",
      color: "#d4649f",
      fontSize: "16px",
    },
    select: {
      padding: "10px 15px",
      fontSize: "15px",
      border: "2px solid #ffb3d9",
      borderRadius: "10px",
      background: "white",
      color: "#d4649f",
      cursor: "pointer",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      background: "linear-gradient(135deg, #fff0f5 0%, #ffe6f0 100%)",
      padding: "25px",
      borderRadius: "15px",
      marginBottom: "30px",
      border: "2px solid #ffccdd",
    },
    input: {
      padding: "12px 15px",
      border: "2px solid #ffb3d9",
      borderRadius: "10px",
      fontSize: "14px",
      background: "white",
      color: "#d4649f",
    },
    button: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      color: "white",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      background: "linear-gradient(135deg, #ff80bf 0%, #ff4da6 100%)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      width: "100%",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      overflow: "hidden",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(255, 182, 193, 0.2)",
    },
    th: {
      background: "linear-gradient(135deg, #ff80bf 0%, #ff4da6 100%)",
      color: "white",
      padding: "15px 10px",
      fontWeight: "600",
      textAlign: "center",
      fontSize: "15px",
      textTransform: "uppercase",
    },
    td: {
      borderBottom: "1px solid #ffccdd",
      padding: "12px 10px",
      textAlign: "center",
      color: "#666",
    },
    img: {
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    btnEdit: {
      padding: "8px 15px",
      margin: "3px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      color: "white",
      fontWeight: "600",
      fontSize: "13px",
      background: "linear-gradient(135deg, #80d4ff 0%, #4db8ff 100%)",
    },
    btnDelete: {
      padding: "8px 15px",
      margin: "3px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      color: "white",
      fontWeight: "600",
      fontSize: "13px",
      background: "linear-gradient(135deg, #ff8080 0%, #ff4d4d 100%)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>🌸 Quản lý sản phẩm 🌸</h2>

        <div style={styles.filterBox}>
          <label style={styles.label}>Lọc theo danh mục:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.select}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="price"
            placeholder="Giá"
            value={formData.price}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              setFormData({
                ...formData,
                price: v ? new Intl.NumberFormat("vi-VN").format(v) : "",
              });
            }}
            style={styles.input}
          />

          <input
            type="text"
            name="image_url"
            placeholder="Link ảnh sản phẩm"
            value={formData.image_url}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </select>

          {editingProduct ? (
            <button onClick={updateProduct} style={styles.button}>
              Cập nhật sản phẩm
            </button>
          ) : (
            <button onClick={addProduct} style={styles.button}>
              Thêm sản phẩm
            </button>
          )}

          {editingProduct && (
            <button
              onClick={resetForm}
              style={{
                ...styles.button,
                background: "linear-gradient(135deg, #d4649f 0%, #b85585 100%)",
              }}
            >
              Hủy
            </button>
          )}
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Ảnh</th>
              <th style={styles.th}>Tên</th>
              <th style={styles.th}>Giá</th>
              <th style={styles.th}>Danh mục</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={p.id} style={{ background: index % 2 === 0 ? "white" : "#fff5fa" }}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>
                  <img
                    src={p.image_url}
                    alt={p.name}
                    width={60}
                    style={styles.img}
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/150x150?text=No+Image")
                    }
                  />
                </td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>
                  {new Intl.NumberFormat("vi-VN").format(p.price)}đ
                </td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>
                  <button onClick={() => editProduct(p)} style={styles.btnEdit}>
                    Sửa
                  </button>
                  <button onClick={() => deleteProduct(p.id)} style={styles.btnDelete}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
