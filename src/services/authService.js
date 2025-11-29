// src/services/authService.js
import { supabase } from "../supabase";

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // tạo profile role = 'user' nếu bạn dùng profiles table
  if (data?.user?.id) {
    await supabase.from("profiles").upsert({ id: data.user.id, role: "user" });
  }
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export async function getUserRole(userId) {
  if (!userId) return null;
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (error) return null;
  return data?.role ?? null;
}
