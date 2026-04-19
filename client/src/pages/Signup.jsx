import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Heart, ShieldCheck } from 'lucide-react';

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
        subscription: { status: 'active', plan: formData.plan } // Mocking active sub for "easy" req
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-6 py-12">
      <motion.div 
        className="glass p-10 rounded-3xl w-full max-w-2xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-extrabold mb-2">Create Account</h2>
        <p className="text-text-muted mb-8 text-lg">Join the community driving change through golf.</p>
        
        {error && <div className="bg-error/10 text-error border border-error/20 p-4 rounded-xl mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="text" 
                  className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text outline-none focus:border-primary/50 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="email" 
                  className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text outline-none focus:border-primary/50 transition-all"
                  placeholder="hero@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text outline-none focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2"><Heart size={16} className="text-primary" /> Supported Charity</label>
              <select 
                className="w-full bg-surface border border-white/5 rounded-2xl py-4 px-4 text-text outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                value={formData.charityId}
                onChange={(e) => setFormData({...formData, charityId: e.target.value})}
                required
              >
                <option value="">Select a charity</option>
                {charities.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2"><ShieldCheck size={16} className="text-secondary" /> Subscription Plan</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${formData.plan === 'monthly' ? 'border-primary bg-primary/10' : 'border-white/5 bg-surface-light'}`}
                  onClick={() => setFormData({...formData, plan: 'monthly'})}
                >
                  <div className="font-bold">Monthly</div>
                  <div className="text-text-muted text-xs">$29.99/mo</div>
                </div>
                <div 
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${formData.plan === 'yearly' ? 'border-secondary bg-secondary/10' : 'border-white/5 bg-surface-light'}`}
                  onClick={() => setFormData({...formData, plan: 'yearly'})}
                >
                  <div className="font-bold">Yearly</div>
                  <div className="text-text-muted text-xs">$299.99/yr</div>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary text-background font-extrabold py-4 rounded-2xl mt-4 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
              Register & Subscribe
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-text-muted text-sm">
          Already have an account? <Link to="/login" className="text-primary font-bold no-underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
