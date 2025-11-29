import { useState } from "react";
import { signUp } from "./supabase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signUp(email, password);
      alert("Đăng ký thành công!");
      window.location.href = "/login";
    } catch {
      alert("Lỗi, email có thể đã tồn tại!");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Đăng ký</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}
