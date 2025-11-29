import { supabase } from "./client";

// Đăng ký user
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Sau khi tạo user → tạo profiles
  await supabase.from("profiles").insert({
    id: data.user.id,
    role: "user",
  });

  return data.user;
}

// Đăng nhập user/admin
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
}
