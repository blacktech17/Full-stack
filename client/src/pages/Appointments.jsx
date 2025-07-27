import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate } from 'react-router-dom';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchAppointments();
    if (user.role === 'patient') fetchDoctors();
    // eslint-disable-next-line
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest('/appointments', 'GET', null, token);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await apiRequest('/auth/login', 'POST', { email: 'dummy', password: 'dummy' });
      // This is a placeholder. In a real app, you would have an endpoint to list doctors.
      setDoctors([]);
    } catch {
      setDoctors([]);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/appointments', 'POST', { doctor: doctors[0]?._id, date, reason }, token);
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {user.role === 'patient' && (
        <form onSubmit={handleBook}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} required />
          {/* Doctor selection is a placeholder */}
          <button type="submit">Book Appointment</button>
        </form>
      )}
      <ul>
        {appointments.map(a => (
          <li key={a._id}>
            With: {user.role === 'patient' ? a.doctor?.name : a.patient?.name} | Date: {new Date(a.date).toLocaleString()} | Status: {a.status}
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default Appointments;