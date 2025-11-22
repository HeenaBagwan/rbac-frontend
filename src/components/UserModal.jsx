import React, {useEffect,useState} from 'react';
import api from '../api/api';

export default function UserModal({open,onClose,onSave}){
  const [roles,setRoles]=useState([]);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [roleId,setRoleId]=useState('');
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ if(open) api.get('/roles').then(r=>setRoles(r.data)).catch(()=>{}); },[open]);

  const save=async()=>{
    if(!name||!email||!password) return alert('Fill all');
    setLoading(true);
    try{
      const res = await api.post('/users/create',{ name, email, password, roleId });
      onSave(res.data);
      setName(''); setEmail(''); setPassword(''); setRoleId('');
    } catch {
      alert('Failed to create');
    } finally { setLoading(false); }
  };

  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={(e)=>e.stopPropagation()} style={{background:'#fff',padding:20,borderRadius:12,width:'90%',maxWidth:700}}>
        <h3>Add New User</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{padding:10,borderRadius:8}} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:10,borderRadius:8}} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:10,borderRadius:8}} />
          <select value={roleId} onChange={e=>setRoleId(e.target.value)} style={{padding:10,borderRadius:8}}>
            <option value="">Select Role</option>
            {roles.map(r=> <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button onClick={onClose} style={{padding:8,borderRadius:8}}>Cancel</button>
          <button onClick={save} disabled={loading} style={{padding:8,borderRadius:8,background:'#3182ce',color:'#fff',border:'none'}}>{loading? 'Saving...':'Save User'}</button>
        </div>
      </div>
    </div>
  );
}
