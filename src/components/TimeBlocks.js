import { useState } from "react";
import { t2m, nowMin } from "../helpers/utils";
import { PALETTE } from "../config/constants";

export default function TimeBlocks({ blocks, setBlocks, theme }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ start:"", end:"", label:"", color:"#00C2FF" });
  const now = nowMin();

  function add() {
    if (!form.label||!form.start||!form.end) return;
    setBlocks(bs=>[...bs,{...form,id:`b_${Date.now()}`,done:false}]);
    setForm({start:"",end:"",label:"",color:"#00C2FF"}); setAdding(false);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontSize:13,color:theme.muted}}>Your structured day · live indicator shows current block</div>
        <button onClick={()=>setAdding(a=>!a)} style={{background:theme.border,border:`1.5px solid ${theme.border2}`,color:theme.muted2,borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>+ Add Block</button>
      </div>
      <div style={{position:"relative",paddingLeft:58}}>
        <div style={{position:"absolute",left:41,top:8,bottom:8,width:2,background:theme.border,borderRadius:2}}/>
        {blocks.map(b=>{
          const s=t2m(b.start), e2=t2m(b.end);
          const isActive=now>=s&&now<e2, isPast=now>=e2;
          return (
            <div key={b.id} style={{display:"flex",alignItems:"center",gap:14,marginBottom:12,position:"relative"}}>
              <div style={{position:"absolute",left:-19,top:"50%",transform:"translateY(-50%)",width:12,height:12,borderRadius:"50%",background:isActive?b.color:isPast?theme.border2:theme.inp,border:`2px solid ${isActive?b.color:theme.border2}`,boxShadow:isActive?`0 0 10px ${b.color}99`:"none",transition:"all 0.4s"}}/>
              <div style={{flex:1,background:isActive?b.color+"11":isPast?theme.topbar:theme.card,border:`1.5px solid ${isActive?b.color+"55":theme.border}`,borderRadius:12,padding:"12px 15px",display:"flex",alignItems:"center",gap:12,opacity:isPast&&b.done?0.45:1,transition:"all 0.3s"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {isActive&&<span style={{width:7,height:7,borderRadius:"50%",background:b.color,display:"inline-block",boxShadow:`0 0 6px ${b.color}`,animation:"pulse 1.5s infinite"}}/>}
                    <span style={{fontWeight:600,fontSize:14,color:isActive?b.color:isPast?theme.muted:theme.text2}}>{b.label}</span>
                    {isActive&&<span style={{fontSize:10,fontWeight:700,color:b.color,background:b.color+"22",border:`1px solid ${b.color}44`,borderRadius:6,padding:"2px 8px",fontFamily:"'Space Mono',monospace"}}>NOW</span>}
                  </div>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:theme.muted,marginTop:3}}>{b.start} – {b.end}</div>
                </div>
                <div onClick={()=>setBlocks(bs=>bs.map(x=>x.id===b.id?{...x,done:!x.done}:x))} style={{width:20,height:20,borderRadius:6,border:`2px solid ${b.done?b.color:theme.border2}`,background:b.done?b.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                  {b.done&&<span style={{color:"#000",fontSize:10,fontWeight:900}}>✓</span>}
                </div>
                <button onClick={()=>setBlocks(bs=>bs.filter(x=>x.id!==b.id))} style={{background:"none",border:"none",color:theme.muted,cursor:"pointer",fontSize:13,padding:"0 2px",flexShrink:0}}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
      {adding&&(
        <div style={{background:theme.card,border:`1.5px solid ${theme.border2}`,borderRadius:14,padding:16,marginTop:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            {[["start","Start"],["end","End"]].map(([k,l])=>(
              <div key={k}><div style={{fontSize:11,color:theme.muted2,marginBottom:4}}>{l} Time</div>
              <input type="time" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",background:theme.topbar,border:`1.5px solid ${theme.border2}`,color:theme.text2,borderRadius:8,padding:"7px 10px",fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
            ))}
          </div>
          <input placeholder="Block label..." value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} style={{width:"100%",background:theme.topbar,border:`1.5px solid ${theme.border2}`,color:theme.text2,borderRadius:8,padding:"7px 10px",fontSize:13,outline:"none",marginBottom:10,fontFamily:"inherit"}}/>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:12,color:theme.muted2}}>Color:</span>
            {PALETTE.map(c=><div key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?`2.5px solid ${theme.text}`:"2px solid transparent",transition:"border 0.15s"}}/>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={add} style={{flex:1,background:"#00C2FF",color:"#000",border:"none",borderRadius:8,padding:"8px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Add Block</button>
            <button onClick={()=>setAdding(false)} style={{background:theme.border,color:theme.muted2,border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
