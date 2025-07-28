// import for access to UI management and backend calls.
import React, {useEffect, useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import axios from './axiosConfig';

// App.js: The base of our frontend

function App() {
  const [user, setUser] = useState(null);
  
 const logout = async () => {
  try {
    await axios.post('/api/logout'); // ← tell backend to clear cookie
  } catch (err) {
    console.warn("Logout failed, but continuing."); // should not happen...
  } finally {
    setUser(null);
  }
};


  useEffect(() => {
    axios.get('/api/me') // go into index.js, get the user's token/email
      .then(res => {
        setUser(res.data); // setUser's token/email
      })
      .catch(() => {
        setUser(null); // failed token or not logged in
      });
  }, []);

  // if user not null Dashboard user is whatever was inputed. Else; Set the user.
  return (
    <div>
      {user ? (
        <div>
          <Dashboard user={user} />
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );

  /*
  Ternary operation (if/else) used below if user is true (not null), welcome them. Or just disalay login prompt.
  Side Note:
  <div> is the encasing of our jsx logic; we see a lot of this in jsx code
  
  placeholder for dashboard.js
  return (
    <div>
      {user ? (
        <div>
        <h2>Welcome, {user.email}!</h2>
        <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );

  testcase
  return <Login onLogin={(user) => console.log('Logged in as:', user)} />;
  */
}

export default App;
