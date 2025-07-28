import axios from './axiosConfig'; //  use our preconfigured Axios
import React, { useState } from 'react';
//import axios from 'axios';

function Login({ onLogin }) { // this is called by App.js
  const [email, setEmail] = useState(''); // const email var, "useState" allows us to keep this variable empty for now
  const [password, setPassword] = useState(''); // same thing here but for password.

    
  const login = async () => { //login logic function
    try {
      await axios.post('/api/login', { email, password }); // processes input to backend
      const res = await axios.get('/api/me'); // get the result
      onLogin(res.data); // onLogin processes a successful login, or doesn't.
    } catch {
      alert('Login failed');
    }
  };
  
 
  // test case
  /*
  const login = async () => {
    onLogin({ email }); // pretend login worked
  };
  */
  
  

  /*
  below logic will have text ui to input email/pass with a login button that calls the above function.
  */

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={(e) => { e.preventDefault(); login();}}>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /> 
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

