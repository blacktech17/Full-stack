import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>
      <button onClick={() => navigate('/appointments')}>Appointments</button>
      <button onClick={() => navigate('/chat/' + user.id)}>Chat</button>
      <button onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
    </div>
  );
}

export default Dashboard;