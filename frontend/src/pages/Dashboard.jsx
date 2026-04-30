import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 1. stats
        const res = await axios.get(
          "/api/tasks/dashboard",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setData(res.data);

        // 2. ALL TASKS (NEW)
        const taskRes = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        setTasks(taskRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, textAlign: "center", maxWidth: 420, margin: "80px auto" }}>
          <div style={styles.spinner} />
          <p style={{ color: "#94a3b8", marginTop: 14 }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Tasks", value: data.total ?? 0, color: "#6366f1", icon: "▦" },
    { label: "Completed", value: data.completed ?? 0, color: "#16a34a", icon: "✓" },
    { label: "Pending", value: data.pending ?? 0, color: "#f59e0b", icon: "◷" },
    { label: "Overdue", value: data.overdue ?? 0, color: "#ef4444", icon: "!" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>Dashboard</h1>
            <p style={styles.sub}>Here's what's happening with your work today.</p>
          </div>
        </div>

        {/* STAT GRID */}
        <div style={styles.grid4}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>{s.label}</p>
                <p style={styles.statValue}>{s.value}</p>
              </div>
              <div
                style={{
                  ...styles.statIcon,
                  background: s.color + "26",
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={styles.grid32}>
          {/* LEFT - TASKS */}
          <section style={styles.card}>
            <div style={styles.cardHead}>
              <h2 style={styles.h2}>Tasks</h2>
              <a href="/tasks" style={styles.muteLink}>View all</a>
            </div>

            {tasks.length === 0 && (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>
                No tasks found
              </p>
            )}

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {tasks.map((t) => (
                <li key={t._id} style={styles.taskRow}>
                  <span style={{ fontWeight: 500 }}>{t.title}</span>
                  <Badge status={t.status} />
                </li>
              ))}
            </ul>
          </section>

          {/* RIGHT - OVERVIEW */}
          <section style={styles.card}>
            <h2 style={{ ...styles.h2, marginBottom: 14 }}>Overview</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Row label="Total Tasks" value={data.total} />
              <Row label="Completed" value={data.completed} />
              <Row label="Pending" value={data.pending} />
              <Row label="Overdue" value={data.overdue} />
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    done: { bg: "rgba(22,163,74,0.18)", fg: "#22c55e" },
    completed: { bg: "rgba(22,163,74,0.18)", fg: "#22c55e" },
    pending: { bg: "rgba(245,158,11,0.18)", fg: "#f59e0b" },
    overdue: { bg: "rgba(239,68,68,0.18)", fg: "#ef4444" },
  };
  const c = map[status] || { bg: "rgba(148,163,184,0.18)", fg: "#cbd5e1" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.fg,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

function Row({ label, value }) {
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        background: "rgba(15,23,42,0.5)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 10,
      }}
    >
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </li>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at top, #2a1f55 0%, #0b1220 60%)",
    color: "#e5e7eb",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    padding: "32px 20px",
  },
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 24 },
  h1: { fontSize: 30, fontWeight: 700, margin: 0 },
  h2: { fontSize: 18, fontWeight: 600, margin: 0 },
  sub: { color: "#94a3b8", margin: "4px 0 0" },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  grid32: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
  },

  card: {
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 22,
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 30px -12px rgba(0,0,0,0.5)",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  muteLink: { color: "#94a3b8", fontSize: 13, textDecoration: "none" },

  statCard: {
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 30px -12px rgba(0,0,0,0.5)",
  },
  statLabel: { color: "#94a3b8", fontSize: 13, margin: 0 },
  statValue: { fontSize: 30, fontWeight: 700, margin: "8px 0 0" },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
  },

  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  spinner: {
    width: 36,
    height: 36,
    margin: "0 auto",
    border: "3px solid rgba(99,102,241,0.3)",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Dashboard;
