import { supabase } from "../supabase";

const TABLE = "products";

/* ---------------------------
    🔥 Upload hình lên Storage
---------------------------- */
async function uploadImage(file) {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) {
    console.error("❌ Lỗi upload ảnh:", error);
    throw error;
  }

  // Lấy public URL
  const { data: publicUrl } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

/* ---------------------------
    🟢 Lấy danh sách sản phẩm
---------------------------- */
export async function getProducts() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("❌ Lỗi getProducts:", error);
    throw error;
  }
  return data;
}

/* ---------------------------
    🟢 Lấy 1 sản phẩm theo id
---------------------------- */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Lỗi getProductById:", error);
    throw error;
  }
  return data;
}

/* ---------------------------
    🟢 Thêm sản phẩm mới
---------------------------- */
export async function addProduct({ name, price, category, file }) {
  // Upload ảnh trước
  const image_url = await uploadImage(file);

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name,
        price,
        category,
        image_url,
      },
    ])
    .select() // ✅ FIX: Thêm .select() để trả về data
    .single();

  if (error) {
    console.error("❌ Lỗi addProduct:", error);
    throw error;
  }

  return data;
}

/* ---------------------------
    🟢 Cập nhật sản phẩm
---------------------------- */
export async function updateProduct(id, updates) {
  console.log("🔄 updateProduct được gọi với:", { id, updates });

  let updateData = { ...updates };

  // Nếu có file mới → upload ảnh mới
  if (updates.file) {
    console.log("🖼️ Có file mới, đang upload...");
    updateData.image_url = await uploadImage(updates.file);
    delete updateData.file; // Xóa file khỏi updateData
  }

  // Xóa các field không cần thiết
  delete updateData.file;

  console.log("💾 Data sẽ update:", updateData);

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq("id", id)
    .select() // ✅ FIX: THÊM .select() để trả về data sau khi update
    .single(); // ✅ FIX: THÊM .single() để trả về 1 object thay vì array

  if (error) {
    console.error("❌ Lỗi updateProduct:", error);
    throw error;
  }

  console.log("✅ Update thành công:", data);
  return data;
}

/* ---------------------------
    🔴 Xóa sản phẩm
---------------------------- */
export async function deleteProduct(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Lỗi deleteProduct:", error);
    throw error;
  }

  return true;
}