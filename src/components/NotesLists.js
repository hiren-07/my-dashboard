import { useState } from "react";

export default function NotesLists({ notes, setNotes, scratch, setScratch, theme }) {
  const [active, setActive] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title:"", type:"note" });
  const [newItem, setNewItem] = useState("");

  function create() {
    if (!form.title.trim()) return;
    const n = { id: Date.now(), title: form.title.trim(), type: form.type, content: form.type==="note"?"":[], date: new Date().toLocaleDateString("en-IN") };
    setNotes(ns=>[...ns,n]); setActive(n.id); setForm({title:"",type:"note"}); setShowNew(false);
  }
  function upd(id, content) { setNotes(ns=>ns.map(n=>n.id===id?{...n,content}:n)); }
  function addItem(id) {
    if (!newItem.trim()) return;
    setNotes(ns=>ns.map(n=>n.id===id?{...n,content:[...n.content,{id:Date.now(),text:newItem.trim(),done:false}]}:n));
    setNewItem("");
  }
  function toggleItem(nid,iid) { setNotes(ns=>ns.map(n=>n.id===nid?{...n,content:n.content.map(i=>i.id===iid?{...i,done:!i.done}:i)}:n)); }
  function delItem(nid,iid) { setNotes(ns=>ns.map(n=>n.id===nid?{...n,content:n.content.filter(i=>i.id!==iid)}:n)); }
  function delNote(id) { setNotes(ns=>ns.filter(n=>n.id!==id)); if(active===id) setActive(null); }

  const cur = notes.find(n=>n.id===active);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"210px 1fr",gap:16,minHeight:420}}>
        {/* Sidebar */}
        <div>
          <button onClick={()=>setShowNew(s=>!s)} style={{width:"100%",background:"linear-gradient(135deg,#00C2FF22,#7C3AED22)",border:"1.5px solid #00C2FF33",color:"#00C2FF",borderRadius:10,padding:"9px",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:11,fontFamily:"inherit"}}>+ New Note / List</button>
          {showNew&&(
            <div style={{background:theme.card,border:`1.5px solid ${theme.border2}`,borderRadius:12,padding:13,marginBottom:11}}>
              <input placeholder="Title..." value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&create()} autoFocus style={{width:"100%",background:theme.topbar,border:`1.5px solid ${theme.border2}`,color:theme.text2,borderRadius:8,padding:"7px 10px",fontSize:13,outline:"none",marginBottom:8,fontFamily:"inherit"}}/>
              <div style={{display:"flex",gap:6,marginBottom:9}}>
                {["note","list"].map(t=><button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{flex:1,padding:"5px",borderRadius:7,border:`1.5px solid ${form.type===t?"#00C2FF":theme.border2}`,background:form.type===t?"#00C2FF22":"transparent",color:form.type===t?"#00C2FF":theme.muted2,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{t==="note"?"📝 Note":"☑️ List"}</button>)}
              </div>
              <button onClick={create} style={{width:"100%",background:"#00C2FF",color:"#000",border:"none",borderRadius:8,padding:"7px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Create</button>
            </div>
          )}
          {notes.length===0&&<div style={{color:theme.muted,fontSize:12,textAlign:"center",padding:"20px 0"}}>No notes yet.</div>}
          {notes.map(n=>(
            <div key={n.id} onClick={()=>setActive(n.id)} style={{padding:"10px 12px",borderRadius:10,marginBottom:5,cursor:"pointer",background:active===n.id?theme.border:"transparent",border:`1.5px solid ${active===n.id?theme.border2:"transparent"}`,transition:"all 0.15s",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13}}>{n.type==="list"?"☑️":"📝"}</span>
              <div style={{flex:1,overflow:"hidden"}}>
                <div style={{fontSize:13,fontWeight:600,color:active===n.id?theme.text:theme.text2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</div>
                <div style={{fontSize:10,color:theme.muted}}>{n.date}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();delNote(n.id);}} style={{background:"none",border:"none",color:theme.muted,cursor:"pointer",fontSize:12,opacity:active===n.id?1:0,transition:"opacity 0.15s"}}>✕</button>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div style={{background:theme.card,border:`1.5px solid ${theme.border}`,borderRadius:16,padding:"20px",display:"flex",flexDirection:"column"}}>
          {!cur?(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:theme.muted,gap:10}}>
              <span style={{fontSize:36}}>📋</span>
              <span style={{fontSize:14}}>Select or create a note / list</span>
            </div>
          ):(
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{cur.type==="list"?"☑️":"📝"}</span>
                  <span style={{fontWeight:700,fontSize:16}}>{cur.title}</span>
                </div>
                <span style={{fontSize:11,color:theme.muted,fontFamily:"'Space Mono',monospace"}}>{cur.date}</span>
              </div>
              {cur.type==="note"?(
                <textarea value={cur.content} onChange={e=>upd(cur.id,e.target.value)} placeholder="Write anything — client notes, ideas, call summaries, random thoughts..." style={{flex:1,background:theme.topbar,border:`1.5px solid ${theme.border}`,borderRadius:12,color:theme.text2,fontSize:14,padding:"14px",outline:"none",resize:"none",lineHeight:1.75,fontFamily:"'DM Sans',sans-serif",minHeight:300}}/>
              ):(
                <div style={{flex:1}}>
                  {cur.content.map(item=>(
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${theme.border}`}}>
                      <div onClick={()=>toggleItem(cur.id,item.id)} style={{width:18,height:18,borderRadius:5,border:`2px solid ${item.done?"#22C55E":theme.border2}`,background:item.done?"#22C55E":"transparent",flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {item.done&&<span style={{color:"#000",fontSize:9,fontWeight:900}}>✓</span>}
                      </div>
                      <span style={{flex:1,fontSize:14,color:item.done?theme.muted:theme.text2,textDecoration:item.done?"line-through":"none"}}>{item.text}</span>
                      <button onClick={()=>delItem(cur.id,item.id)} style={{background:"none",border:"none",color:theme.muted,cursor:"pointer",fontSize:12}}>✕</button>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem(cur.id)} placeholder="Add item..." style={{flex:1,background:theme.topbar,border:`1.5px solid ${theme.border2}`,color:theme.text2,borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                    <button onClick={()=>addItem(cur.id)} style={{background:"#22C55E22",border:"1.5px solid #22C55E55",color:"#22C55E",borderRadius:8,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Add</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Scratchpad */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:11,fontWeight:700,color:theme.muted,letterSpacing:"0.08em",marginBottom:9}}>⚡ QUICK SCRATCHPAD — no structure, just dump it</div>
        <textarea value={scratch} onChange={e=>setScratch(e.target.value)} placeholder="Phone numbers, random links, client names, ideas, anything..." style={{width:"100%",minHeight:110,background:theme.card,border:`1.5px solid ${theme.border}`,borderRadius:12,color:theme.text2,fontSize:14,padding:"13px",outline:"none",resize:"vertical",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}/>
      </div>
    </div>
  );
}
