// import for UI handling and API calls
import React, { useEffect, useState } from 'react';
import axios from './axiosConfig'; // ← use our backend-connected Axios

//import axios from 'axios';

function Dashboard({ user }) {
  const [contacts, setContacts] = useState([]); // store the user's contacts
  const [form, setForm] = useState({ name: '', phone: '' }); // tracking user input 

  
  useEffect(() => {
    axios.get('/api/contacts').then(res => setContacts(res.data));
  }, []);
  

  useEffect(() => {
    // simulate contact loading
    setContacts([
    ]);
  }, []);
  

  const addContact = async () => {
      if (!form.name.trim() || !form.phone.trim()) {
      alert("Name and phone number are required.");
      return;
    }
    const isValidPhone = /^[0-9-]+$/.test(form.phone);
    if (!isValidPhone) {
      alert("Phone number should only contain digits and hyphens.");
      return;
    }

    try{
      await axios.post('/api/contacts', form);
    
      const res = await axios.get('/api/contacts');
    
      setContacts(res.data);
      setForm({ name: '', phone: '' });
    } catch(err){
      alert(err.response.data);
    }
  };

  return (
    <div>
      <h2>Welcome, {user.email}</h2>

      <h3>Add Contact</h3>
      <form onSubmit={(e) => { e.preventDefault(); addContact(); }}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      
      <button type="submit">Save</button>
      </form>

      <h3>Your Contacts</h3>
      <ul>
        {contacts.map(c => (
          <li key={c.id}>{c.name} - {c.phone}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

