import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <motion.div 
        className="glass p-10 rounded-3xl w-full max-w-md border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-4xl font-extrabold mb-2 text-center">Welcome Back</h2>
        <p className="text-text-muted text-center mb-8">Sign in to track your scores and impact.</p>
        
        {error && <div className="bg-error/10 text-error border border-error/20 p-4 rounded-xl mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="email" 
                className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text outline-none focus:border-primary/50 transition-all"
                placeholder="hero@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="w-full bg-primary text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all">
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-text-muted text-sm">
          Don't have an account? <Link to="/signup" className="text-primary font-bold no-underline hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
