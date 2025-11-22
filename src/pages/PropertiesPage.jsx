import React, {useEffect,useState} from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

export default function PropertiesPage(){
  const user = useSelector(s=>s.auth.user);
  const [props,setProps]=useState([]);
  const [loading,setLoading]=useState(false);
  const [title,setTitle]=useState('');
  const [address,setAddress]=useState('');
  const [price,setPrice]=useState('');

  useEffect(()=>{ if(user){ setLoading(true); api.get('/properties').then(r=>setProps(r.data)).catch(()=>{}).finally(()=>setLoading(false)); } },[user]);

  const create = async ()=> {
    if(!title) return alert('Enter title');
    try{ const res = await api.post('/properties/create',{ title, address, price: Number(price) || 0 }); setProps(prev=>[res.data,...prev]); setTitle(''); setAddress(''); setPrice(''); }catch{ alert('Failed'); }
  };

  return (
    <div style={{padding:20,background:'#f3f4f6',minHeight:'100vh'}}>
      <Navbar onBack={()=>window.location='/dashboard'} />
      <div style={{marginTop:20}}>
        <h1>Properties</h1>
        <p style={{color:'#666'}}>Create and manage properties</p>

        {user.permissions.includes('create_property') && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:8,marginTop:12}}>
            <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:10,borderRadius:8}} />
            <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} style={{padding:10,borderRadius:8}} />
            <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} style={{padding:10,borderRadius:8}} />
            <button onClick={create} style={{padding:10,background:'#3182ce',color:'#fff',borderRadius:8}}>Create</button>
          </div>
        )}

        <div style={{marginTop:16}}>
          {loading ? 'Loading...' : props.map(p=> (
            <div key={p._id} style={{background:'#fff',padding:12,borderRadius:8,marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong>{p.title}</strong>
                <span style={{color:'#666',fontSize:12}}>{new Date(p.createdAt).toLocaleString()}</span>
              </div>
              <div style={{color:'#333'}}>{p.address}</div>
              <div style={{color:'#666',fontSize:13}}>Price: ₹{p.price} — Owner: {p.owner?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
