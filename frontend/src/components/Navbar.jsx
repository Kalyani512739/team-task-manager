import { Link, useLocation } from "react-router-dom";

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    height: "64px",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(15, 16, 28, 0.7)",
    backdropFilter: "saturate(140%) blur(16px)",
    WebkitBackdropFilter: "saturate(140%) blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#fff",
    textDecoration: "none",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 10px 30px -10px rgba(99,102,241,0.6)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
  },
  brandText: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "#fff",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: "#a1a1b3",
    textDecoration: "none",
    transition: "all 0.18s ease",
  },
  linkActive: {
    background: "rgba(99,102,241,0.15)",
    color: "#fff",
    boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.35)",
  },
  logout: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
    padding: "8px 14px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: "#fca5a5",
    background: "transparent",
    border: "1px solid rgba(248,113,113,0.25)",
    cursor: "pointer",
    transition: "all 0.18s ease",
  },
};

function NavLink({ to, label, icon }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "#fff";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#a1a1b3";
        }
      }}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </Link>
  );
}

function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={styles.navbar} className="navbar">
      {/* LEFT — Brand */}
      <Link to="/dashboard" style={styles.brand}>
        <div style={styles.logo}>✦</div>
        <span style={styles.brandText}>TaskFlow</span>
      </Link>

      {/* RIGHT — Links */}
      <div style={styles.nav}>
        <NavLink to="/dashboard" label="Dashboard" icon="▦" />
        <NavLink to="/tasks" label="Tasks" icon="✓" />
        <button
          onClick={logout}
          style={styles.logout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.1)";
            e.currentTarget.style.color = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#fca5a5";
          }}
        >
          ⎋ Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
