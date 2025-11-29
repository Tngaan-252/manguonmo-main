import { useState } from "react";
import { signIn } from "./supabase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const user = await signIn(email, password);

      alert("Đăng nhập thành công!");
      window.location.href = "/";
    } catch {
      alert("Sai email hoặc mật khẩu");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Đăng nhập</h1>
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

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
