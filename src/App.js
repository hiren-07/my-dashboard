import { useState, useEffect, useRef } from "react";
import Pomodoro from "./components/Pomodoro";
import TimeBlocks from "./components/TimeBlocks";
import NotesLists from "./components/NotesLists";
import { getNow, getToday, nowMin, loadFromStorage, saveToStorage } from "./helpers/utils";
import { DEFAULT_PROJECTS, DEFAULT_GROWTH, DEFAULT_BLOCKS, PC, PALETTE, THEMES, THEME_KEY } from "./config/constants";

// ── MAIN ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [growth, setGrowth] = useState(DEFAULT_GROWTH);
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [notes, setNotes] = useState([]);
  const [scratch, setScratch] = useState("");
  const [time, setTime] = useState(getNow());
  const [tab, setTab] = useState("projects");
  const [focus, setFocus] = useState(false);
  const [addTo, setAddTo] = useState(null);
  const [newTask, setNewTask] = useState({});
  const [newPrio, setNewPrio] = useState({});
  const [editId, setEditId] = useState(null);
  const [editTxt, setEditTxt] = useState("");
  const [showNewProj, setShowNewProj] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [saved, setSaved] = useState(false);
  const [themeId, setThemeId] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || "cream"; } catch { return "cream"; }
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    loadFromStorage().then(d => {
      if (d) {
        if (d.projects) setProjects(d.projects);
        if (d.growth) setGrowth(d.growth);
        if (d.blocks) setBlocks(d.blocks);
        if (d.notes) setNotes(d.notes);
        if (d.scratch) setScratch(d.scratch);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToStorage({ projects, growth, blocks, notes, scratch });
      setSaved(true); setTimeout(() => setSaved(false), 1800);
    }, 900);
  }, [projects, growth, blocks, notes, scratch, loaded]);

  useEffect(() => { const t = setInterval(() => setTime(getNow()), 30000); return () => clearInterval(t); }, []);
  useEffect(() => { try { localStorage.setItem(THEME_KEY, themeId); } catch { } }, [themeId]);

  const total = projects.reduce((s, p) => s + p.tasks.length, 0);
  const done = projects.reduce((s, p) => s + p.tasks.filter(t => t.done).length, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  const gDone = growth.filter(g => g.done).length;

  useEffect(() => { document.title = "Project Management Tool"; }, []);

  function cycleTask(pid, tid) {
    setProjects(ps => ps.map(p => p.id === pid ? {
      ...p, tasks: p.tasks.map(t => {
        if (t.id !== tid) return t;
        if (!t.inProgress && !t.done) return { ...t, inProgress: true, done: false };
        if (t.inProgress && !t.done) return { ...t, inProgress: false, done: true };
        return { ...t, inProgress: false, done: false };
      })
    } : p));
  }
  function delTask(pid, tid) { setProjects(ps => ps.map(p => p.id === pid ? { ...p, tasks: p.tasks.filter(t => t.id !== tid) } : p)); }
  function addTask(pid) {
    const txt = (newTask[pid] || "").trim(); if (!txt) return;
    setProjects(ps => ps.map(p => p.id === pid ? { ...p, tasks: [...p.tasks, { id: Date.now(), text: txt, done: false, inProgress: false, priority: newPrio[pid] || "medium" }] } : p));
    setNewTask(n => ({ ...n, [pid]: "" })); setNewPrio(n => ({ ...n, [pid]: "medium" })); setAddTo(null);
  }

  function exportReport() {
    const today = getToday();
    const inProgCount = projects.reduce((s, p) => s + p.tasks.filter(t => t.inProgress && !t.done).length, 0);
    const pendCount = total - done - inProgCount;
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Daily Report - ${today}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#111;padding:0 24px}
      h1{font-size:22px;border-bottom:3px solid #0ea5e9;padding-bottom:10px;margin-bottom:6px}
      .date{color:#888;font-size:13px;margin-bottom:28px}
      .summary{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 24px;margin-bottom:28px;display:flex;gap:32px;flex-wrap:wrap}
      .stat{text-align:center;min-width:70px}
      .stat-n{font-size:26px;font-weight:bold}
      .stat-l{font-size:12px;color:#888;margin-top:2px}
      .project{margin-bottom:24px;page-break-inside:avoid}
      .proj-title{font-size:15px;font-weight:bold;margin-bottom:8px;display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f8fafc;border-radius:6px}
      .dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}
      .task{display:flex;align-items:center;gap:10px;padding:7px 12px;border-bottom:1px solid #f1f5f9;font-size:13px}
      .task:last-child{border-bottom:none}
      .status{font-size:11px;font-weight:bold;padding:2px 8px;border-radius:12px;white-space:nowrap;flex-shrink:0}
      .sdone{background:#dcfce7;color:#166534}
      .sinprog{background:#fef9c3;color:#854d0e}
      .stodo{background:#f1f5f9;color:#64748b}
      .priority{font-size:10px;font-weight:bold;padding:2px 7px;border-radius:10px;white-space:nowrap;flex-shrink:0}
      .ph{background:#fee2e2;color:#991b1b}.pm{background:#fef3c7;color:#92400e}.pl{background:#dcfce7;color:#166534}
      .footer{margin-top:36px;font-size:11px;color:#bbb;text-align:center;border-top:1px solid #f1f5f9;padding-top:16px}
      @media print{body{margin:10px 20px}.summary{break-inside:avoid}}
    </style></head><body>
    <h1>Daily Progress Report</h1>
    <div class="date">${today}</div>
    <div class="summary">
      <div class="stat"><div class="stat-n" style="color:#0ea5e9">${total}</div><div class="stat-l">Total</div></div>
      <div class="stat"><div class="stat-n" style="color:#22c55e">${done}</div><div class="stat-l">Done</div></div>
      <div class="stat"><div class="stat-n" style="color:#f59e0b">${inProgCount}</div><div class="stat-l">In Progress</div></div>
      <div class="stat"><div class="stat-n" style="color:#94a3b8">${pendCount}</div><div class="stat-l">Pending</div></div>
      <div class="stat"><div class="stat-n" style="color:#6366f1">${pct}%</div><div class="stat-l">Progress</div></div>
    </div>`;
    projects.forEach(proj => {
      const pd = proj.tasks.filter(t => t.done).length;
      html += `<div class="project"><div class="proj-title"><span class="dot" style="background:${proj.color}"></span>${proj.name} &nbsp;<span style="font-size:12px;color:#888;font-weight:normal">${pd}/${proj.tasks.length} done</span></div>`;
      proj.tasks.forEach(t => {
        const st = t.done ? "sdone" : t.inProgress ? "sinprog" : "stodo";
        const stL = t.done ? "✓ Done" : t.inProgress ? "⟳ In Progress" : "○ Todo";
        const pc = t.priority === "high" ? "ph" : t.priority === "medium" ? "pm" : "pl";
        html += `<div class="task"><span class="status ${st}">${stL}</span><span style="flex:1">${t.text}</span><span class="priority ${pc}">${t.priority}</span></div>`;
      });
      html += `</div>`;
    });
    html += `<div class="footer">Generated by Project Management Tool &middot; ${today}</div></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
  function saveEdit(pid, tid) {
    setProjects(ps => ps.map(p => p.id === pid ? { ...p, tasks: p.tasks.map(t => t.id === tid ? { ...t, text: editTxt } : t) } : p));
    setEditId(null); setEditTxt("");
  }
  function addProject() {
    const name = newProjName.trim(); if (!name) return;
    setProjects(ps => [...ps, { id: `p_${Date.now()}`, name, color: PALETTE[ps.length % PALETTE.length], tasks: [] }]);
    setNewProjName(""); setShowNewProj(false);
  }

  const T = THEMES[themeId] || THEMES.cream;

  const urgentTasks = projects.flatMap(p => p.tasks.filter(t => !t.done && t.priority === "high").map(t => ({ ...t, pName: p.name, pColor: p.color, pid: p.id })));

  const TABS = [["projects", "📁 Projects"], ["timer", "⏱ Pomodoro"], ["timeblock", "🕐 Time Blocks"], ["growth", "🚀 Growth Hour"], ["noteslist", "📋 Notes & Lists"], ["morning", "☀️ Morning Routine"]];

  if (!loaded) return <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono',monospace", color: T.accent, fontSize: 14 }}>Loading workspace...</div>;

  const inp = { background: T.inp, border: `1.5px solid ${T.border2}`, color: T.text, borderRadius: 8, padding: "7px 10px", fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit" };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: T.bg, minHeight: "100vh", color: T.text, transition: "background 0.3s,color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${T.inp}}::-webkit-scrollbar-thumb{background:${T.scrollbar};border-radius:4px}
        .tr:hover .tdel{opacity:1!important}
        .chk{cursor:pointer;transition:transform 0.15s}.chk:hover{transform:scale(1.12)}
        .db{cursor:pointer;background:none;border:none;color:#FF3B3B77;font-size:12px;padding:2px 5px;border-radius:4px;transition:all 0.15s}
        .db:hover{background:#FF3B3B22;color:#FF3B3B}
        .pc{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;font-family:'Space Mono',monospace;letter-spacing:0.04em}
        @keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        .fi{animation:fadeIn 0.22s ease both}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .pulsing{animation:pulse 1.5s ease infinite}
        .tab{cursor:pointer;transition:all 0.15s;border:none;font-family:inherit}
        .addtbtn{background:transparent;border:1.5px dashed ${T.border2};color:${T.muted2};border-radius:9px;padding:7px;font-size:12px;cursor:pointer;transition:all 0.15s;font-family:inherit;width:100%;margin-top:9px}
        .addtbtn:hover{border-color:${T.accent}55;color:${T.accent}}
        .pc-card{background:${T.card};border:1.5px solid ${T.border};border-radius:16px;overflow:hidden;transition:background 0.3s,border 0.3s,box-shadow 0.2s}
        .pc-card:hover{box-shadow:0 0 0 1.5px ${T.accent}22}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: T.topbar, borderBottom: `1px solid ${T.border}`, padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, transition: "background 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 35, height: 35, background: "linear-gradient(135deg,#00C2FF,#7C3AED)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: T.text }}>Dashboard</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: "'Space Mono',monospace" }}>{getToday()}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {saved && <span style={{ fontSize: 11, color: "#22C55E", display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} className="pulsing" />Saved</span>}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: T.accent }}>{time}</div>
          <button onClick={exportReport} style={{ background: "#22C55E22", border: "1.5px solid #22C55E55", color: "#22C55E", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            🖨 Export
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowThemePicker(s => !s)} style={{ background: T.card2, border: `1.5px solid ${T.border2}`, color: T.text2, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: T.accent, display: "inline-block", flexShrink: 0 }} />
              Theme
            </button>
            {showThemePicker && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "12px", zIndex: 200, width: 220, boxShadow: "0 8px 32px #00000033" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: "0.07em", marginBottom: 10 }}>CHOOSE THEME</div>
                {Object.entries(THEMES).map(([id, th]) => (
                  <div key={id} onClick={() => { setThemeId(id); setShowThemePicker(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, cursor: "pointer", background: themeId === id ? T.card2 : "transparent", border: `1.5px solid ${themeId === id ? T.accent + "55" : "transparent"}`, marginBottom: 4, transition: "all 0.15s" }}>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: th.bg, border: `1.5px solid ${th.border2}`, display: "inline-block" }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: th.card, border: `1.5px solid ${th.border2}`, display: "inline-block" }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: th.accent, display: "inline-block" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: themeId === id ? 700 : 500, color: themeId === id ? T.accent : T.text2 }}>{th.name}</span>
                    {themeId === id && <span style={{ marginLeft: "auto", fontSize: 11, color: T.accent }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setFocus(f => !f)} style={{ background: focus ? T.accent + "22" : T.card2, border: `1.5px solid ${focus ? T.accent + "55" : T.border2}`, color: focus ? T.accent : T.muted2, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            {focus ? "🎯 Focus ON" : "⬜ Focus"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "22px 18px" }} onClick={() => setShowThemePicker(false)}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 20 }} className="fi" onClick={() => setShowThemePicker(false)}>
          {[
            { label: "Total Tasks", v: total, icon: "📋", c: "#00C2FF" },
            { label: "Completed", v: done, icon: "✅", c: "#22C55E" },
            { label: "In Progress", v: projects.reduce((s, p) => s + p.tasks.filter(t => t.inProgress && !t.done).length, 0), icon: "⟳", c: "#F59E0B" },
            { label: "Pending", v: total - done - projects.reduce((s, p) => s + p.tasks.filter(t => t.inProgress && !t.done).length, 0), icon: "⏳", c: "#6B7280" },
            { label: "Growth", v: `${gDone}/${growth.length}`, icon: "📈", c: "#A855F7" },
            { label: "Progress", v: `${pct}%`, icon: "🎯", c: pct >= 80 ? "#22C55E" : "#00C2FF" },
          ].map(s => (
            <div key={s.label} style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 13, padding: "14px 16px", transition: "background 0.3s" }}>
              <div style={{ fontSize: 18, marginBottom: 5 }}>{`${s.icon} (${s.v})`}</div>
              {/* <div style={{ fontSize: 22, fontWeight: 700, color: s.c, fontFamily: "'Space Mono',monospace" }}>{s.v}</div> */}
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 13, padding: "13px 18px", marginBottom: 20, transition: "background 0.3s" }} className="fi">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.muted2 }}>Today's Progress</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: pct >= 80 ? "#22C55E" : "#00C2FF" }}>{pct}% complete</span>
          </div>
          <div style={{ background: T.border, borderRadius: 99, height: 7, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${T.accent},${pct >= 80 ? "#22C55E" : T.accent}DD)`, borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* URGENT */}
        {!focus && urgentTasks.length > 0 && (
          <div style={{ background: "#FF3B3B09", border: "1.5px solid #FF3B3B28", borderRadius: 13, padding: "12px 16px", marginBottom: 18 }} className="fi">
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FF3B3B", marginBottom: 7, letterSpacing: "0.06em" }}>🔥 HIGH PRIORITY — PENDING</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {urgentTasks.map(t => (
                <div key={t.id + t.pid} style={{ background: T.card2, border: `1.5px solid ${t.pColor}44`, borderRadius: 8, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: t.pColor, flexShrink: 0 }}>•</span>
                  <span style={{ color: T.text2 }}>{t.text}</span>
                  <span style={{ color: T.muted, fontSize: 10, flexShrink: 0 }}>[{t.pName}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: T.topbar, borderRadius: 12, padding: 4, width: "fit-content", border: `1.5px solid ${T.border}`, flexWrap: "wrap" }}>
          {TABS.map(([k, l]) => (
            <button key={k} className="tab" onClick={() => setTab(k)} style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, background: tab === k ? "#1E2130" : "transparent", color: tab === k ? "#E8EAF0" : "#4B5563", boxShadow: tab === k ? "0 1px 4px #00000033" : "none" }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── PROJECTS ── */}
        {tab === "projects" && (
          <div className="fi">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(305px,1fr))", gap: 15 }}>
              {projects.map(proj => {
                const pd = proj.tasks.filter(t => t.done).length, pt = proj.tasks.length, pp = pt ? Math.round(pd / pt * 100) : 0;
                return (
                  <div key={proj.id} className="pc-card">
                    <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: proj.color, boxShadow: `0 0 8px ${proj.color}88` }} />
                        <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{proj.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>{pd}/{pt}</span>
                        <button className="db" onClick={() => setProjects(ps => ps.filter(p => p.id !== proj.id))}>✕</button>
                      </div>
                    </div>
                    <div style={{ height: 3, background: T.border }}>
                      <div style={{ height: "100%", width: `${pp}%`, background: proj.color, transition: "width 0.4s" }} />
                    </div>
                    <div style={{ padding: "9px 13px", background: T.card }}>
                      {proj.tasks.length === 0 && <div style={{ color: T.muted, fontSize: 12, padding: "8px 0", textAlign: "center" }}>No tasks yet.</div>}
                      {proj.tasks.map(task => {
                        const pc = PC[task.priority];
                        return (
                          <div key={task.id} className="tr" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}66`, background: task.inProgress && !task.done ? "#F59E0B08" : "transparent", borderRadius: task.inProgress && !task.done ? 6 : 0 }}>
                            <div className="chk" title={task.done ? "Mark todo" : task.inProgress ? "Mark done" : "Mark in progress"} onClick={() => cycleTask(proj.id, task.id)} style={{ width: 17, height: 17, borderRadius: 5, border: `2px solid ${task.done ? proj.color : task.inProgress ? "#F59E0B" : "#2E3240"}`, background: task.done ? proj.color : task.inProgress ? "#F59E0B22" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                              {task.done && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
                              {task.inProgress && !task.done && <span style={{ color: "#F59E0B", fontSize: 9, fontWeight: 900 }}>▶</span>}
                            </div>
                            {editId === `${proj.id}-${task.id}` ? (
                              <input style={{ ...inp, flex: 1, fontSize: 12 }} value={editTxt} onChange={e => setEditTxt(e.target.value)} onBlur={() => saveEdit(proj.id, task.id)} onKeyDown={e => e.key === "Enter" && saveEdit(proj.id, task.id)} autoFocus />
                            ) : (
                              <span onClick={() => { setEditId(`${proj.id}-${task.id}`); setEditTxt(task.text); }} style={{ flex: 1, fontSize: 13, textDecoration: task.done ? "line-through" : "none", color: task.done ? T.muted : task.inProgress ? "#F59E0B" : T.text2, cursor: "text", fontStyle: task.inProgress && !task.done ? "italic" : "normal" }}>{task.text}</span>
                            )}
                            <span className="pc" style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`, flexShrink: 0 }}>{task.priority}</span>
                            <button className="db tdel" style={{ opacity: 0, transition: "opacity 0.15s" }} onClick={() => delTask(proj.id, task.id)}>✕</button>
                          </div>
                        );
                      })}
                      {addTo === proj.id ? (
                        <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 7 }}>
                          <input style={inp} placeholder="Task description..." value={newTask[proj.id] || ""} onChange={e => setNewTask(n => ({ ...n, [proj.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addTask(proj.id)} autoFocus />
                          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                            {["high", "medium", "low"].map(p => (
                              <button key={p} onClick={() => setNewPrio(n => ({ ...n, [proj.id]: p }))} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, border: `1.5px solid ${PC[p].border}`, background: (newPrio[proj.id] || "medium") === p ? PC[p].bg : "transparent", color: PC[p].text, cursor: "pointer", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{p}</button>
                            ))}
                            <button onClick={() => addTask(proj.id)} style={{ marginLeft: "auto", background: proj.color, color: "#000", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
                            <button onClick={() => setAddTo(null)} style={{ background: "#1E2130", color: "#9CA3AF", border: "none", borderRadius: 7, padding: "5px 9px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                          </div>
                        </div>
                      ) : (
                        <button className="addtbtn" onClick={() => setAddTo(proj.id)}>+ Add Task</button>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* New project */}
              <div style={{ background: T.topbar, border: `1.5px dashed ${T.border2}`, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 22, minHeight: 110 }}>
                {showNewProj ? (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 9 }}>
                    <input style={inp} placeholder="Project name..." value={newProjName} onChange={e => setNewProjName(e.target.value)} onKeyDown={e => e.key === "Enter" && addProject()} autoFocus />
                    <div style={{ display: "flex", gap: 7 }}>
                      <button onClick={addProject} style={{ flex: 1, background: "#00C2FF", color: "#000", border: "none", borderRadius: 8, padding: "7px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Create</button>
                      <button onClick={() => setShowNewProj(false)} style={{ background: "#1E2130", color: "#9CA3AF", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowNewProj(true)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 26 }}>＋</span><span>New Project</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── POMODORO ── */}
        {tab === "timer" && (
          <div className="fi" style={{ maxWidth: 380, margin: "0 auto" }}><Pomodoro theme={T} /></div>
        )}

        {/* ── TIME BLOCKS ── */}
        {tab === "timeblock" && (
          <div className="fi" style={{ maxWidth: 620 }}><TimeBlocks blocks={blocks} setBlocks={setBlocks} theme={T} /></div>
        )}

        {/* ── GROWTH ── */}
        {tab === "growth" && (
          <div className="fi" style={{ maxWidth: 500 }}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>1-hour protected block · <span style={{ color: T.accent }}>Best at 6–7 PM daily</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
              {growth.map(g => (
                <div key={g.id} onClick={() => setGrowth(gs => gs.map(x => x.id === g.id ? { ...x, done: !x.done } : x))} style={{ background: g.done ? "#22C55E08" : T.card, border: `1.5px solid ${g.done ? "#22C55E55" : T.border}`, borderRadius: 13, padding: "15px 17px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ width: 40, height: 40, background: g.done ? "#22C55E22" : T.card2, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all 0.2s" }}>{g.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: g.done ? "#22C55E" : T.text }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: g.done ? "#22C55E88" : T.muted, marginTop: 2 }}>{g.done ? "Done ✓" : "Tap when done"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#7C3AED0D", border: "1.5px solid #7C3AED2A", borderRadius: 13, padding: "13px 17px", marginTop: 18, fontSize: 13, color: "#A78BFA" }}>
              🎯 Growth Hour is non-negotiable. Block 6–7 PM in your calendar. No client calls, no dev tasks — just learning, bidding, and growth.
            </div>
          </div>
        )}

        {/* ── NOTES & LISTS ── */}
        {tab === "noteslist" && (
          <div className="fi"><NotesLists notes={notes} setNotes={setNotes} scratch={scratch} setScratch={setScratch} theme={T} /></div>
        )}

        {/* ── MORNING ── */}
        {tab === "morning" && (
          <div className="fi" style={{ maxWidth: 540 }}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>Fixed block · <span style={{ color: T.accent, fontFamily: "'Space Mono',monospace" }}>9:00 AM – 9:30 AM</span></div>
            {[
              { icon: "📬", label: "Check emails & messages (SaaS project)", time: "9:00" },
              { icon: "📞", label: "Team standup — assign today's tasks", time: "9:10" },
              { icon: "📋", label: "Get report on yesterday's tasks", time: "9:20" },
              { icon: "✉️", label: "Reply to client & share updates", time: "9:25" },
              { icon: "🗓️", label: "Plan Magento todo list for the day", time: "9:30" },
            ].map((item, i) => (
              <div key={i} style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 13, padding: "13px 17px", marginBottom: 9, display: "flex", alignItems: "center", gap: 13 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: T.text }}>{item.label}</span>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.accent, background: T.accent + "11", border: `1px solid ${T.accent}33`, borderRadius: 6, padding: "3px 8px" }}>{item.time}</div>
              </div>
            ))}
            <div style={{ background: "#F59E0B0D", border: "1.5px solid #F59E0B2A", borderRadius: 13, padding: "13px 17px", fontSize: 13, color: "#F59E0B" }}>
              💡 Keep standup tight — 30 mins max. Start your Pomodoro timer at 9:00 to stay on track.
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: 28, padding: "12px 17px", background: T.topbar, border: `1.5px solid ${T.border}`, borderRadius: 13, fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 8 }}>
          <span>💾</span>
          <span>All data <strong style={{ color: T.text2 }}>auto-saved</strong> across sessions. Click any task text to edit inline. New projects, notes, and time blocks persist forever.</span>
        </div>
      </div>
    </div>
  );
}
