import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // ✅ FIXED: go to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <div style={styles.wrap}>
        <div style={styles.brand}>
          <div style={styles.logo}>✦</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue to TaskFlow</p>
        </div>

        <form onSubmit={submit} style={styles.card}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={{ ...styles.label, marginTop: 14 }}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p style={styles.hint}>
            New to TaskFlow?{" "}
            <a href="/register" style={styles.link}>
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background:
      "radial-gradient(ellipse at top, #2a1f55 0%, #0b1220 60%)",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    color: "#e5e7eb",
  },
  glowA: {
    position: "absolute",
    left: -120,
    top: 80,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(99,102,241,0.35)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  glowB: {
    position: "absolute",
    right: -80,
    bottom: 40,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(168,85,247,0.25)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  wrap: { position: "relative", width: "100%", maxWidth: 420 },
  brand: { textAlign: "center", marginBottom: 28 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "white",
    fontSize: 26,
    boxShadow: "0 20px 50px -20px rgba(99,102,241,0.6)",
  },
  title: { fontSize: 28, fontWeight: 700, margin: "4px 0" },
  subtitle: { color: "#94a3b8", fontSize: 14, margin: 0 },
  card: {
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 28,
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 30px -12px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
  },
  label: { fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 6 },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    background: "rgba(15,23,42,0.8)",
    color: "white",
    border: "1px solid #334155",
    outline: "none",
    fontSize: 14,
  },
  button: {
    marginTop: 22,
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    boxShadow: "0 20px 50px -20px rgba(99,102,241,0.6)",
  },
  hint: { textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 18 },
  link: { color: "#c7d2fe", textDecoration: "none", fontWeight: 500 },
};

export default Login;
