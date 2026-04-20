import { useState, useEffect } from "react";

const ROLES = [
  "CAD Design Engineer",
  "PCB Design Engineer",
  "Electrical Systems Engineer",
  "EV Engineer",
  "Battery Engineer",
  "Wiring Harness Engineer",
  "Mechatronics Engineer",
  "Test Engineer",
];

const COMPANIES = [
  // EV & Automotive
  "Ather Energy", "Ola Electric", "Euler Motors", "Tata Motors EV", "Mahindra EV",
  "LAPA Electric", "Ampere Vehicles", "Log9 Materials", "Matter Motor", "Exicom",
  "Revolt Motors", "Statiq", "Greaves Electric", "Hero Electric", "Raptee Energy",
  // Wiring Harness
  "Motherson Sumi", "Yazaki India", "Aptiv", "Tata AutoComp", "Pricol", "Samvardhana Motherson",
  "Delphi Technologies", "Valeo India", "Bosch India",
  // CAD / Engineering Services
  "KPIT Technologies", "Tata Elxsi", "QuEST Global", "Cyient", "L&T Technology Services",
  "HCL Technologies", "Mphasis", "Wipro Engineering",
  // PCB / Embedded
  "Tessolve", "Sanmina", "Jabil", "Flextronics", "Continental",
  // Aerospace
  "Agnikul Cosmos", "Skyroot Aerospace", "Pixxel", "Bellatrix Aerospace", "ISRO (VSSC)",
  // Startups / AI
  "Control One AI", "Torus Robotics", "Niqo Robotics", "Planys Technologies",
];

const PLATFORMS = ["LinkedIn", "Naukri", "Indeed", "Company Website", "Internshala", "Unstop", "IIMJobs", "Email"];

const STATUS_CONFIG = {
  "Applied":     { color: "#3B82F6", bg: "#EFF6FF" },
  "No Response": { color: "#6B7280", bg: "#F9FAFB" },
  "In Review":   { color: "#F59E0B", bg: "#FFFBEB" },
  "Interview":   { color: "#8B5CF6", bg: "#F5F3FF" },
  "Rejected":    { color: "#EF4444", bg: "#FEF2F2" },
  "Offer":       { color: "#10B981", bg: "#ECFDF5" },
};

const DAILY_GUIDE = [
  {
    time: "8:00 – 8:30 AM",
    task: "LinkedIn Search",
    detail: "Search: 'EV Engineer fresher', 'CAD Design Engineer', 'Wiring Harness Engineer India'. Filter: Posted in last 24h. Easy Apply → Apply 4–5 jobs.",
    icon: "🔍",
  },
  {
    time: "8:30 – 9:00 AM",
    task: "Naukri.com Search",
    detail: "Login → Search same roles. Upload relevant resume PDF for each role. Apply 3–4 jobs. Enable 'Resume Highlight' for visibility.",
    icon: "📋",
  },
  {
    time: "9:00 – 9:20 AM",
    task: "Company Career Pages",
    detail: "Check: Ather, Ola Electric, Tata Elxsi, KPIT, Tata AutoComp, Motherson, Agnikul. Apply directly on their website — less competition.",
    icon: "🏢",
  },
  {
    time: "9:20 – 9:40 AM",
    task: "LinkedIn DM to Recruiter",
    detail: "After applying, find the HR/recruiter on LinkedIn. Send a short connection note: 'Hi [Name], I just applied for [Role] at [Company]. I have EV harness + SEVC AIR3 experience. Would love to connect!' — 1–2 DMs/day.",
    icon: "💬",
  },
  {
    time: "9:40 – 10:00 AM",
    task: "Log Everything",
    detail: "Add all applications to this tracker. Set follow-up reminders for 7 days later. Track your daily count — hit 10 before stopping.",
    icon: "✅",
  },
];

const SEARCH_TERMS = [
  "EV Design Engineer fresher",
  "Wiring Harness Engineer fresher India",
  "CAD Design Engineer SolidWorks",
  "PCB Design Engineer KiCAD",
  "Electrical Systems Engineer EV",
  "Battery Engineer fresher",
  "Mechatronics Engineer fresher",
  "Test Engineer embedded systems",
  "Junior Electrical Engineer automotive",
  "ECAD Engineer AutoCAD Electrical",
];

const TIPS = [
  "Always upload the role-specific resume PDF — not a generic one.",
  "Turn on LinkedIn 'Open to Work' visible to recruiters only.",
  "Apply within 24h of posting — early applicants get more attention.",
  "After applying, DM the recruiter or hiring manager on LinkedIn.",
  "Your SEVC All India Rank 3 is rare — always mention it in messages.",
  "Naukri profile: mark yourself as 'Actively looking', update daily.",
  "Set job alerts on LinkedIn + Naukri for all 8 roles — get notified instantly.",
  "Follow target companies on LinkedIn and engage with their posts.",
  "Internshala and Unstop have fresher-specific openings — check daily.",
  "If rejected, wait 3 months and reapply with an updated resume.",
];

function Tag({ label, color, bg }) {
  return (
    <span style={{
      background: bg, color, border: `1px solid ${color}33`,
      borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600,
    }}>{label}</span>
  );
}

export default function App() {
  const [tab, setTab] = useState("tracker");
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    company: "", role: "", platform: "", status: "Applied", notes: "", date: new Date().toISOString().slice(0, 10),
  });
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [tipIndex, setTipIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    async function load() {
      try {
        const res = await window.storage.get("gokularam-job-apps");
        if (res && res.value) setApps(JSON.parse(res.value));
      } catch (e) {}
      setLoaded(true);
    }
    load();
  }, []);

  // Save to storage
  useEffect(() => {
    if (!loaded) return;
    async function save() {
      try { await window.storage.set("gokularam-job-apps", JSON.stringify(apps)); } catch (e) {}
    }
    save();
  }, [apps, loaded]);

  useEffect(() => {
    const t = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = apps.filter(a => a.date === today).length;
  const totalCount = apps.length;
  const interviewCount = apps.filter(a => a.status === "Interview" || a.status === "Offer").length;

  function addApp() {
    if (!form.company || !form.role) return;
    setApps(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm({ company: "", role: "", platform: "", status: "Applied", notes: "", date: today });
    setShowForm(false);
  }

  function updateStatus(id, status) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function deleteApp(id) {
    setApps(prev => prev.filter(a => a.id !== id));
  }

  const filtered = filterStatus === "All" ? apps : apps.filter(a => a.status === filterStatus);

  const styles = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#E2E8F0",
    },
    header: {
      background: "linear-gradient(90deg, #1A5376 0%, #2E86AB 100%)",
      padding: "20px 24px 16px",
      borderBottom: "2px solid #2E86AB44",
    },
    headerTitle: { fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 },
    headerSub: { fontSize: 13, color: "#BAE6FD", marginTop: 4 },
    statsRow: {
      display: "flex", gap: 12, padding: "16px 24px",
      borderBottom: "1px solid #1E293B",
    },
    stat: {
      flex: 1, background: "#1E293B", borderRadius: 12,
      padding: "14px 16px", textAlign: "center",
      border: "1px solid #334155",
    },
    statNum: { fontSize: 28, fontWeight: 800, color: "#38BDF8" },
    statLabel: { fontSize: 11, color: "#94A3B8", marginTop: 2, textTransform: "uppercase", letterSpacing: 1 },
    tabs: {
      display: "flex", gap: 0, padding: "0 24px",
      borderBottom: "1px solid #1E293B", background: "#0F172A",
    },
    tab: (active) => ({
      padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
      borderBottom: active ? "2px solid #38BDF8" : "2px solid transparent",
      color: active ? "#38BDF8" : "#64748B",
      background: "none", border: "none", borderBottom: active ? "2px solid #38BDF8" : "2px solid transparent",
      transition: "all 0.2s",
    }),
    content: { padding: "20px 24px", maxWidth: 900, margin: "0 auto" },
    tipBar: {
      background: "#1A5376", borderRadius: 10, padding: "10px 16px",
      marginBottom: 16, fontSize: 13, color: "#BAE6FD",
      display: "flex", alignItems: "center", gap: 8,
      border: "1px solid #2E86AB44",
    },
    btn: (color = "#2E86AB") => ({
      background: color, color: "#fff", border: "none", borderRadius: 8,
      padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
    }),
    card: {
      background: "#1E293B", borderRadius: 12, padding: "14px 16px",
      marginBottom: 10, border: "1px solid #334155",
      display: "flex", alignItems: "flex-start", gap: 12,
    },
    input: {
      background: "#0F172A", border: "1px solid #334155", borderRadius: 8,
      padding: "8px 12px", color: "#E2E8F0", fontSize: 13, width: "100%", boxSizing: "border-box",
    },
    select: {
      background: "#0F172A", border: "1px solid #334155", borderRadius: 8,
      padding: "8px 12px", color: "#E2E8F0", fontSize: 13, width: "100%",
    },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 },
    guideCard: {
      background: "#1E293B", borderRadius: 12, padding: 16,
      marginBottom: 12, border: "1px solid #334155",
      display: "flex", gap: 14, alignItems: "flex-start",
    },
    timeChip: {
      background: "#0F172A", color: "#38BDF8", borderRadius: 8,
      padding: "4px 10px", fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap", border: "1px solid #1A5376",
    },
    searchTag: {
      background: "#0F172A", border: "1px solid #2E86AB55",
      borderRadius: 20, padding: "5px 12px", fontSize: 12,
      color: "#7DD3FC", display: "inline-block", margin: "4px",
    },
  };

  const progressPct = Math.min((todayCount / 10) * 100, 100);

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={styles.headerTitle}>🎯 Gokularam's Job Hunt Dashboard</p>
            <p style={styles.headerSub}>Track 10 applications/day → Land your next role by May 2026</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#BAE6FD", marginBottom: 4 }}>TODAY'S PROGRESS</div>
            <div style={{ background: "#0F172A", borderRadius: 20, height: 10, width: 140, overflow: "hidden" }}>
              <div style={{
                background: progressPct >= 100 ? "#10B981" : "linear-gradient(90deg, #2E86AB, #38BDF8)",
                height: "100%", width: `${progressPct}%`, borderRadius: 20,
                transition: "width 0.5s",
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#BAE6FD", marginTop: 4 }}>
              {todayCount}/10 today {todayCount >= 10 ? "✅" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { num: todayCount, label: "Applied Today", color: todayCount >= 10 ? "#10B981" : "#38BDF8" },
          { num: totalCount, label: "Total Applied", color: "#38BDF8" },
          { num: interviewCount, label: "Interviews/Offers", color: "#10B981" },
          { num: apps.filter(a => a.status === "In Review").length, label: "In Review", color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} style={styles.stat}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[["tracker", "📊 Tracker"], ["guide", "📅 Daily Guide"], ["search", "🔍 Search Terms"]].map(([key, label]) => (
          <button key={key} style={styles.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={styles.content}>
        {/* Tip bar */}
        <div style={styles.tipBar}>
          <span>💡</span>
          <span style={{ transition: "opacity 0.5s" }}>{TIPS[tipIndex]}</span>
        </div>

        {/* TRACKER TAB */}
        {tab === "tracker" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", ...Object.keys(STATUS_CONFIG)].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{
                    ...styles.btn(filterStatus === s ? "#2E86AB" : "#1E293B"),
                    border: "1px solid #334155", fontSize: 12, padding: "6px 12px",
                  }}>{s}</button>
                ))}
              </div>
              <button style={styles.btn("#10B981")} onClick={() => setShowForm(f => !f)}>
                {showForm ? "✕ Cancel" : "+ Add Application"}
              </button>
            </div>

            {/* Add Form */}
            {showForm && (
              <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2E86AB55" }}>
                <p style={{ fontWeight: 700, marginBottom: 12, color: "#38BDF8" }}>New Application</p>
                <div style={styles.formGrid}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>COMPANY *</div>
                    <input list="companies" style={styles.input} placeholder="e.g. Ather Energy"
                      value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                    <datalist id="companies">{COMPANIES.map(c => <option key={c} value={c} />)}</datalist>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>ROLE *</div>
                    <select style={styles.select} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="">Select role...</option>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>PLATFORM</div>
                    <select style={styles.select} value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                      <option value="">Select platform...</option>
                      {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>DATE</div>
                    <input type="date" style={styles.input} value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>NOTES (optional)</div>
                  <input style={styles.input} placeholder="e.g. Sent DM to HR, referral from X..."
                    value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <button style={styles.btn("#10B981")} onClick={addApp}>✓ Save Application</button>
              </div>
            )}

            {/* Applications List */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: "#475569", padding: 40 }}>
                <div style={{ fontSize: 40 }}>📭</div>
                <div style={{ marginTop: 8 }}>No applications yet. Start adding!</div>
              </div>
            ) : filtered.map(app => (
              <div key={app.id} style={styles.card}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{app.company}</span>
                    <span style={{ color: "#64748B", fontSize: 12 }}>→</span>
                    <span style={{ color: "#7DD3FC", fontSize: 13 }}>{app.role}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <Tag label={app.status} color={STATUS_CONFIG[app.status]?.color} bg={STATUS_CONFIG[app.status]?.bg} />
                    {app.platform && <span style={{ fontSize: 11, color: "#64748B" }}>via {app.platform}</span>}
                    <span style={{ fontSize: 11, color: "#475569" }}>📅 {app.date}</span>
                  </div>
                  {app.notes && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>📝 {app.notes}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 90 }}>
                  <select style={{ ...styles.select, fontSize: 11, padding: "4px 6px" }}
                    value={app.status} onChange={e => updateStatus(app.id, e.target.value)}>
                    {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteApp(app.id)} style={{
                    background: "none", border: "1px solid #EF444433", color: "#EF4444",
                    borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer",
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DAILY GUIDE TAB */}
        {tab === "guide" && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 16, fontSize: 13 }}>
              Follow this routine every morning. Should take <strong style={{ color: "#38BDF8" }}>~2 hours</strong> to hit 10 applications.
            </p>
            {DAILY_GUIDE.map((g, i) => (
              <div key={i} style={styles.guideCard}>
                <div style={{ fontSize: 28 }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{g.task}</span>
                    <span style={styles.timeChip}>{g.time}</span>
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{g.detail}</p>
                </div>
                <div style={{
                  background: "#0F172A", color: "#38BDF8", width: 28, height: 28,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, border: "2px solid #2E86AB", flexShrink: 0,
                }}>
                  {i + 1}
                </div>
              </div>
            ))}

            <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, border: "1px solid #334155", marginTop: 4 }}>
              <p style={{ fontWeight: 700, color: "#38BDF8", marginBottom: 10 }}>📋 Resume to Use — Per Role</p>
              {[
                ["CAD Design Engineer", "Gokularam_CAD_Design_Engineer.pdf"],
                ["PCB Design Engineer", "Gokularam_PCB_Design_Engineer.pdf"],
                ["EV Engineer", "Gokularam_EV_Engineer.pdf"],
                ["Electrical Systems", "Gokularam_Electrical_Systems_Engineer.pdf"],
                ["Battery Engineer", "Gokularam_Battery_Engineer.pdf"],
                ["Wiring Harness", "Gokularam_Wiring_Harness_Engineer.pdf"],
                ["Mechatronics", "Gokularam_ControlOne_AI_Mechatronics_Engineer.pdf"],
                ["Test Engineer", "Gokularam_Agnikul_Cosmos_Test_Engineer.pdf"],
              ].map(([role, file]) => (
                <div key={role} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1E293B", fontSize: 13 }}>
                  <span style={{ color: "#E2E8F0" }}>{role}</span>
                  <span style={{ color: "#64748B", fontSize: 11 }}>📄 {file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH TERMS TAB */}
        {tab === "search" && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 12, fontSize: 13 }}>
              Copy these search terms into <strong style={{ color: "#38BDF8" }}>LinkedIn Jobs</strong> and <strong style={{ color: "#38BDF8" }}>Naukri</strong> every morning.
            </p>
            <div style={{ marginBottom: 20 }}>
              {SEARCH_TERMS.map(t => (
                <span key={t} style={styles.searchTag}
                  onClick={() => navigator.clipboard?.writeText(t)}
                  title="Click to copy">🔍 {t}</span>
              ))}
            </div>

            <p style={{ fontWeight: 700, color: "#38BDF8", marginBottom: 10 }}>🏢 Target Companies by Role</p>
            {[
              { role: "EV / Battery", companies: ["Ather Energy", "Ola Electric", "Euler Motors (FT)", "Tata Motors EV", "Mahindra EV", "Raptee Energy", "Log9 Materials", "Greaves Electric"] },
              { role: "Wiring Harness", companies: ["Motherson Sumi", "Yazaki India", "Aptiv", "Tata AutoComp", "Pricol", "Valeo India", "Bosch India", "Delphi Technologies"] },
              { role: "CAD / Design Eng", companies: ["Tata Elxsi", "KPIT", "QuEST Global", "Cyient", "L&T Technology Services", "HCL Tech Engg"] },
              { role: "PCB / Embedded", companies: ["Tessolve", "Sanmina", "Continental", "Jabil", "Flextronics"] },
              { role: "Aerospace / Test", companies: ["Agnikul Cosmos", "Skyroot Aerospace", "Bellatrix", "Pixxel", "ISRO VSSC"] },
            ].map(({ role, companies }) => (
              <div key={role} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "#F59E0B", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{role}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {companies.map(c => (
                    <span key={c} style={{
                      background: "#1E293B", border: "1px solid #334155",
                      borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#CBD5E1",
                    }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, marginTop: 8, border: "1px solid #334155" }}>
              <p style={{ fontWeight: 700, color: "#38BDF8", marginBottom: 10 }}>💬 LinkedIn DM Template</p>
              <div style={{
                background: "#0F172A", borderRadius: 8, padding: 14, fontSize: 13,
                color: "#94A3B8", lineHeight: 1.7, border: "1px solid #1E293B",
                fontStyle: "italic",
              }}>
                "Hi [Name], I just applied for the [Role] position at [Company] and wanted to connect directly.
                I'm a final-year EEE graduate with hands-on experience in [relevant skill], currently wrapping up
                an EV battery industrialization internship at Euler Motors. I also achieved All India Rank 3 in
                EV Design at SEVC 2025. Would love to be considered — happy to share more details!"
              </div>
              <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>
                ✏️ Customize [Name], [Role], [Company], and [relevant skill] before sending.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}