import { useState, useEffect, useRef } from "react";

export default function Pomodoro({ theme }) {
  const MODES = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const LABELS = { work: "Focus", short: "Short Break", long: "Long Break" };
  const COLS = { work: "#FF3B3B", short: "#22C55E", long: "#00C2FF" };
  const [mode, setMode] = useState("work");
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [custom, setCustom] = useState("");
  const iv = useRef(null);
  const total = custom ? Number(custom) * 60 : MODES[mode];
  const pct = ((total - secs) / total) * 100;
  const R = 54, circ = 2 * Math.PI * R;
  const col = COLS[mode];

  useEffect(() => {
    if (running) {
      iv.current = setInterval(() => setSecs(s => {
        if (s <= 1) { clearInterval(iv.current); setRunning(false); if (mode === "work") setSessions(n => n + 1); return 0; }
        return s - 1;
      }), 1000);
    } else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [running]);

  function switchMode(m) { setMode(m); setRunning(false); setCustom(""); setSecs(MODES[m]); }
  function reset() { setRunning(false); setSecs(custom ? Number(custom) * 60 : MODES[mode]); }
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss2 = String(secs % 60).padStart(2, "0");

  return (
    <div style={{ background: theme.card, border: `1.5px solid ${theme.border}`, borderRadius: 20, padding: "26px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: col, fontFamily: "'Space Mono',monospace" }}>⏱ POMODORO — {LABELS[mode].toUpperCase()}</div>
      <div style={{ display: "flex", gap: 5, background: theme.topbar, borderRadius: 10, padding: 4 }}>
        {Object.keys(MODES).map(m => (
          <button key={m} onClick={() => switchMode(m)} style={{ padding: "5px 12px", borderRadius: 7, border: `1.5px solid ${mode === m ? COLS[m] + "55" : "transparent"}`, fontSize: 11, fontWeight: 600, background: mode === m ? COLS[m] + "22" : "transparent", color: mode === m ? COLS[m] : theme.muted2, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{LABELS[m]}</button>
        ))}
      </div>
      <div style={{ position: "relative", width: 148, height: 148 }}>
        <svg width="148" height="148" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="74" cy="74" r={R} fill="none" stroke={theme.border} strokeWidth="9" />
          <circle cx="74" cy="74" r={R} fill="none" stroke={col} strokeWidth="9" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.9s ease,stroke 0.3s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 30, fontWeight: 700, color: col, lineHeight: 1 }}>{mm}:{ss2}</div>
          <div style={{ fontSize: 10, color: theme.muted, marginTop: 4 }}>{sessions} sessions</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setRunning(r => !r)} style={{ background: running ? "#FF3B3B22" : col + "22", border: `1.5px solid ${running ? "#FF3B3B" : col}`, color: running ? "#FF3B3B" : col, borderRadius: 10, padding: "9px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={reset} style={{ background: theme.border, border: `1.5px solid ${theme.border2}`, color: theme.muted2, borderRadius: 10, padding: "9px 14px", fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>↺</button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={custom} onChange={e => setCustom(e.target.value.replace(/\D/, ""))} placeholder="Custom min" style={{ width: 95, background: theme.topbar, border: `1.5px solid ${theme.border2}`, color: theme.text2, borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
        <button onClick={() => { if (Number(custom) > 0) { setRunning(false); setSecs(Number(custom) * 60); } }} style={{ background: theme.border, border: `1.5px solid ${theme.border2}`, color: theme.muted2, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Set</button>
      </div>
      <div style={{ fontSize: 12, color: theme.muted, textAlign: "center", lineHeight: 1.6, maxWidth: 280 }}>
        Work 25 min → Short break 5 min → Repeat 4× → Long break 15 min
      </div>
    </div>
  );
}
