import { getDoc, setDoc } from "firebase/firestore";
import { DATA_DOC } from "../config/firebase";

export const saveToStorage = async (data) => {
  try {
    await setDoc(DATA_DOC, data);
    // also keep localStorage as offline fallback
    localStorage.setItem("workos_backup", JSON.stringify(data));
  } catch (e) {
    console.warn("Firebase save failed, using localStorage fallback", e);
    try { localStorage.setItem("workos_backup", JSON.stringify(data)); } catch { }
  }
};

export const loadFromStorage = async () => {
  try {
    const snap = await getDoc(DATA_DOC);
    if (snap.exists()) return snap.data();
    // fallback to localStorage if firebase empty
    const local = localStorage.getItem("workos_backup");
    return local ? JSON.parse(local) : null;
  } catch (e) {
    console.warn("Firebase load failed, using localStorage fallback", e);
    try {
      const local = localStorage.getItem("workos_backup");
      return local ? JSON.parse(local) : null;
    } catch { return null; }
  }
};

export function getNow() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }); }
export function getToday() { return new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
export function nowMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
export function t2m(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
