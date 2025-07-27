import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'patient', profile: { age: '', gender: '', specialization: '', bio: '' }
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['age', 'gender', 'specialization', 'bio'].includes(name)) {
      setForm({ ...form, profile: { ...form.profile, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/auth/register', 'POST', form);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {form.role === 'patient' && (
          <>
            <input name="age" placeholder="Age" value={form.profile.age} onChange={handleChange} />
            <input name="gender" placeholder="Gender" value={form.profile.gender} onChange={handleChange} />
          </>
        )}
        {form.role === 'doctor' && (
          <>
            <input name="specialization" placeholder="Specialization" value={form.profile.specialization} onChange={handleChange} />
            <input name="bio" placeholder="Bio" value={form.profile.bio} onChange={handleChange} />
          </>
        )}
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;