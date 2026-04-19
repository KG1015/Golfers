import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config.js';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Heart } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    charityId: '',
    plan: 'monthly'
  });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/charities`);
        setCharities(res.data);
      } catch (e) {
        console.error('Failed to fetch charities');
      }
    };
    fetchCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.charityId) {
      setError('Please select a charity to support.');
      return;
    }
    try {
      await register({
        ...formData,
        subscription: { status: 'active', plan: formData.plan }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
      <motion.div 
        className="card" 
        style={{ width: '100%', maxWidth: '600px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-center mb-4" style={{ fontSize: '2.5rem' }}>Join the Guild</h2>
        <p className="text-center mb-8" style={{ color: 'var(--text-dim)' }}>
          Start tracking your performance and making an impact.
        </p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="left-col">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="hero@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="right-col">
            <div className="input-group">
              <label className="input-label">Support a Cause</label>
              <select 
                className="input-field"
                value={formData.charityId}
                onChange={(e) => setFormData({...formData, charityId: e.target.value})}
                required
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">Select Charity</option>
                {charities.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Choose Plan</label>
              <div className="flex gap-4">
                <div 
                  className="card" 
                  style={{ 
                    flex: 1, padding: '1rem', cursor: 'pointer', 
                    borderColor: formData.plan === 'monthly' ? 'var(--brand)' : 'var(--border)',
                    background: formData.plan === 'monthly' ? 'rgba(0,234,140,0.05)' : 'var(--surface-light)'
                  }}
                  onClick={() => setFormData({...formData, plan: 'monthly'})}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Monthly</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>$29.99</div>
                </div>
                <div 
                  className="card" 
                  style={{ 
                    flex: 1, padding: '1rem', cursor: 'pointer',
                    borderColor: formData.plan === 'yearly' ? 'var(--brand)' : 'var(--border)',
                    background: formData.plan === 'yearly' ? 'rgba(0,234,140,0.05)' : 'var(--surface-light)'
                  }}
                  onClick={() => setFormData({...formData, plan: 'yearly'})}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Yearly</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>$299.99</div>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Register & Begin
            </button>
          </div>
        </form>

        <p className="text-center mt-8" style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          Already a Hero? <Link to="/login" className="brand-text" style={{ fontWeight: 700 }}>Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
