import { useEffect, useState } from "react";
import axios from "axios";

function Tasks() {
  const [view, setView] = useState("tl");

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [newProject, setNewProject] = useState("");

  const token = localStorage.getItem("token");

  // PROJECTS
  const fetchProjects = async () => {
    const res = await axios.get("/api/projects", {
      headers: { Authorization: "Bearer " + token },
    });
    setProjects(res.data);
  };

  const createProject = async () => {
    await axios.post(
      "http://localhost:5000/api/projects",
      { name: newProject },
      { headers: { Authorization: "Bearer " + token } }
    );
    setNewProject("");
    fetchProjects();
  };

  
  const fetchTasks = async (pid) => {
    const res = await axios.get(
      `http://localhost:5000/api/tasks?projectId=${pid}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    setTasks(res.data);
  };

  const createTask = async () => {
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, projectId },
      { headers: { Authorization: "Bearer " + token } }
    );
    setTitle("");
    fetchTasks(projectId);
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });
    fetchTasks(projectId);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const tabs = [
    { key: "cp", label: "Create Project" },
    { key: "sp", label: "Select Project" },
    { key: "ct", label: "Create Task" },
    { key: "tl", label: "Task List" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={styles.h1}>Tasks & Projects</h1>
          <p style={styles.sub}>Organize your projects and keep tasks moving.</p>
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          {tabs.map((t) => {
            const active = view === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                style={{
                  ...styles.tab,
                  ...(active ? styles.tabActive : {}),
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {view === "cp" && (
          <Panel title="Create Project" subtitle="Group related tasks under a project.">
            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="Project name"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              />
              <button style={styles.primaryBtn} onClick={createProject}>
                Create
              </button>
            </div>
          </Panel>
        )}

        {view === "sp" && (
          <Panel title="Select Project" subtitle="Choose a project to load its tasks.">
            <select
              style={styles.input}
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                fetchTasks(e.target.value);
              }}
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {projectId && (
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 10 }}>
                Loaded {tasks.length} task{tasks.length === 1 ? "" : "s"}.
              </p>
            )}
          </Panel>
        )}

        {view === "ct" && (
          <Panel title="Create Task" subtitle="Add a task to the currently selected project.">
            {!projectId ? (
              <p style={{ color: "#94a3b8" }}>
                Select a project first from the <b>Select Project</b> tab.
              </p>
            ) : (
              <div style={styles.row}>
                <input
                  style={styles.input}
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button style={styles.primaryBtn} onClick={createTask}>
                  Add Task
                </button>
              </div>
            )}
          </Panel>
        )}

        {view === "tl" && (
          <Panel title="Task List" subtitle="All tasks for the selected project.">
            {tasks.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>
                No tasks to show. Select a project to load tasks.
              </p>
            ) : (
              <div style={styles.taskGrid}>
                {tasks.map((t) => (
                  <div key={t._id} style={styles.taskCard}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, margin: 0 }}>{t.title}</p>
                      <span style={styles.statusPill}>{t.status}</span>
                    </div>
                    <button
                      style={styles.dangerBtn}
                      onClick={() => deleteTask(t._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section style={styles.card}>
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
      {subtitle && (
        <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 16px" }}>
          {subtitle}
        </p>
      )}
      {children}
    </section>
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
  h1: { fontSize: 30, fontWeight: 700, margin: 0 },
  sub: { color: "#94a3b8", margin: "4px 0 0" },

  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 6,
    marginBottom: 18,
    backdropFilter: "blur(16px)",
  },
  tab: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  tabActive: {
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "white",
    boxShadow: "0 20px 50px -20px rgba(99,102,241,0.6)",
  },

  card: {
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 22,
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 30px -12px rgba(0,0,0,0.5)",
  },

  row: { display: "flex", gap: 10, flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: 200,
    padding: "12px 14px",
    borderRadius: 10,
    background: "rgba(15,23,42,0.8)",
    color: "white",
    border: "1px solid #334155",
    outline: "none",
    fontSize: 14,
  },
  primaryBtn: {
    padding: "12px 18px",
    borderRadius: 10,
    border: "none",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    boxShadow: "0 20px 50px -20px rgba(99,102,241,0.6)",
  },
  dangerBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    background: "rgba(239,68,68,0.15)",
    color: "#ef4444",
    cursor: "pointer",
    fontWeight: 700,
  },

  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  taskCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "rgba(15,23,42,0.5)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  statusPill: {
    display: "inline-block",
    marginTop: 8,
    background: "rgba(148,163,184,0.18)",
    color: "#cbd5e1",
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 12,
    textTransform: "capitalize",
  },
};

export default Tasks;
