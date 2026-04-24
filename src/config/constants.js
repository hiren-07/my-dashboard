export const THEME_KEY = "workos_theme";

export const DEFAULT_PROJECTS = [
  { id: "saas", name: "SaaS (React+Node)", color: "#00C2FF", tasks: [
    { id: 1, text: "Morning team standup + task assignment", done: false, priority: "high" },
    { id: 2, text: "Review yesterday's dev report", done: false, priority: "high" },
    { id: 3, text: "Reply to client updates", done: false, priority: "medium" },
  ]},
  { id: "m1", name: "Magento Project 1", color: "#FF6B35", tasks: [{ id: 1, text: "Task 1", done: false, priority: "high" }, { id: 2, text: "Task 2", done: false, priority: "medium" }] },
  { id: "m2", name: "Magento Project 2", color: "#A855F7", tasks: [{ id: 1, text: "Task 1", done: false, priority: "high" }, { id: 2, text: "Task 2", done: false, priority: "medium" }] },
  { id: "m3", name: "Magento Project 3", color: "#22C55E", tasks: [{ id: 1, text: "Task 1", done: false, priority: "medium" }] },
  { id: "m4", name: "Magento Project 4", color: "#F59E0B", tasks: [{ id: 1, text: "Task 1", done: false, priority: "low" }] },
];

export const DEFAULT_GROWTH = [
  { id: "market", icon: "📈", label: "Market Updates", done: false },
  { id: "tech", icon: "🧠", label: "Tech Blog Reading", done: false },
  { id: "upwork", icon: "💼", label: "Upwork Bidding", done: false },
  { id: "fiverr", icon: "🟢", label: "Fiverr Gig Updates", done: false },
];

export const DEFAULT_BLOCKS = [
  { id: "b1", start: "09:00", end: "09:30", label: "Morning Standup + Email", color: "#00C2FF", done: false },
  { id: "b2", start: "09:30", end: "12:30", label: "Magento Projects — Block 1", color: "#FF6B35", done: false },
  { id: "b3", start: "12:30", end: "13:00", label: "Calls + Client Replies", color: "#F59E0B", done: false },
  { id: "b4", start: "13:00", end: "17:00", label: "Magento Projects — Block 2", color: "#A855F7", done: false },
  { id: "b5", start: "17:00", end: "17:30", label: "Buffer / Catch-up", color: "#6B7280", done: false },
  { id: "b6", start: "18:00", end: "19:00", label: "🚀 Growth Hour", color: "#22C55E", done: false },
];

export const PC = {
  high:   { bg: "#FF3B3B22", border: "#FF3B3B55", text: "#FF3B3B" },
  medium: { bg: "#F59E0B22", border: "#F59E0B55", text: "#F59E0B" },
  low:    { bg: "#22C55E22", border: "#22C55E55", text: "#22C55E" },
};

export const PALETTE = ["#00C2FF","#FF6B35","#A855F7","#22C55E","#F59E0B","#EC4899","#6B7280"];

export const THEMES = {
  dark:     { name:"Dark Navy",    bg:"#0D0F14", topbar:"#12151C", card:"#161921", card2:"#1A1D24", border:"#1E2130", border2:"#2E3240", text:"#E8EAF0", text2:"#D1D5DB", muted:"#4B5563", muted2:"#6B7280", accent:"#00C2FF", scrollbar:"#2E3240", inp:"#1A1D24" },
  cream:    { name:"Warm Cream",   bg:"#FAF7F2", topbar:"#F5EFE6", card:"#FFFFFF", card2:"#F9F5EF", border:"#E7E2D9", border2:"#D4CFC7", text:"#1C1917", text2:"#292524", muted:"#78716C", muted2:"#A8A29E", accent:"#D97706", scrollbar:"#D4CFC7", inp:"#F5EFE6" },
  midnight: { name:"Midnight",     bg:"#0F0C1A", topbar:"#130F20", card:"#1A1528", card2:"#211A32", border:"#2D1F4A", border2:"#3D2B5E", text:"#EDE9FE", text2:"#DDD6FE", muted:"#6B5B8A", muted2:"#7C6B9A", accent:"#A855F7", scrollbar:"#3D2B5E", inp:"#211A32" },
  forest:   { name:"Forest",       bg:"#0C1410", topbar:"#0F1A14", card:"#141F18", card2:"#1A2820", border:"#1E3024", border2:"#2A4030", text:"#DCFCE7", text2:"#BBF7D0", muted:"#4B7A5A", muted2:"#5A8A6A", accent:"#22C55E", scrollbar:"#2A4030", inp:"#1A2820" },
  slate:    { name:"Slate",        bg:"#0F1117", topbar:"#13161F", card:"#1C1F2B", card2:"#222537", border:"#252836", border2:"#32364A", text:"#E2E8F0", text2:"#CBD5E1", muted:"#64748B", muted2:"#7A8CA0", accent:"#6366F1", scrollbar:"#32364A", inp:"#222537" },
  light:    { name:"Light",        bg:"#F8F9FA", topbar:"#FFFFFF", card:"#FFFFFF", card2:"#F1F5F9", border:"#E5E7EB", border2:"#D1D5DB", text:"#111827", text2:"#1F2937", muted:"#9CA3AF", muted2:"#6B7280", accent:"#2563EB", scrollbar:"#D1D5DB", inp:"#F1F5F9" },
};
