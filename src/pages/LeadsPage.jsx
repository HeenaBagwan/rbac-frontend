import React, {useEffect,useState} from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

export default function LeadsPage(){
  const user = useSelector(s=>s.auth.user);
  const [leads,setLeads]=useState([]);
  const [loading,setLoading]=useState(false);
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');

  useEffect(()=>{ if(user){ setLoading(true); api.get('/leads').then(r=>setLeads(r.data)).catch(()=>{}).finally(()=>setLoading(false)); } },[user]);

  const create = async ()=> {
    if(!title) return alert('Enter title');
    try{ const res = await api.post('/leads/create',{ title, description: desc }); setLeads(prev=>[res.data,...prev]); setTitle(''); setDesc(''); }catch{ alert('Failed'); }
  };

  return (
    <div style={{padding:20,background:'#f3f4f6',minHeight:'100vh'}}>
      <Navbar onBack={()=>window.location='/dashboard'} />
      <div style={{marginTop:20}}>
        <h1>Leads</h1>
        <p style={{color:'#666'}}>Create and manage leads</p>

        {user.permissions.includes('create_leads') && (
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:10,borderRadius:8}} />
            <input placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} style={{padding:10,borderRadius:8}} />
            <button onClick={create} style={{padding:10,background:'#48bb78',color:'#fff',borderRadius:8}}>Create</button>
          </div>
        )}

        <div style={{marginTop:16}}>
          {loading ? 'Loading...' : leads.map(l=> (
            <div key={l._id} style={{background:'#fff',padding:12,borderRadius:8,marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong>{l.title}</strong>
                <span style={{color:'#666',fontSize:12}}>{new Date(l.createdAt).toLocaleString()}</span>
              </div>
              <div style={{color:'#333'}}>{l.description}</div>
              <div style={{color:'#666',fontSize:13}}>Owner: {l.owner?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
