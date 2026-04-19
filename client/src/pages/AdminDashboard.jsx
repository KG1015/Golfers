import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config.js';
import { motion } from 'framer-motion';
import { Users, BarChart3, Settings, Play, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [statsRes, usersRes, drawsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/draws`)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDraws(drawsRes.data);
    } catch (e) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDraw = async () => {
    const token = localStorage.getItem('token');
    setProcessing(true);
    try {
      await axios.post(`${API_BASE_URL}/draws/trigger`, { mode: 'random' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (e) {
      alert('Failed to trigger draw');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-text-muted">Initializing Console...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-black mb-2">Control <span className="text-secondary">Console</span></h1>
        <p className="text-text-muted">Platform management and logic orchestration.</p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: <Users size={20} />, label: "Total Users", value: stats?.totalUsers || 0, color: "text-blue-400" },
          { icon: <BarChart3 size={20} />, label: "Active Subs", value: stats?.activeSubs || 0, color: "text-primary" },
          { icon: <DollarSign size={20} />, label: "Prize Pool", value: `$${stats?.totalPrizePool || 0}`, color: "text-secondary" },
          { icon: <DollarSign size={20} />, label: "Charity Total", value: "$4,290", color: "text-emerald-400" }
        ].map((s, i) => (
          <motion.div 
            key={i} 
            className="glass p-6 rounded-2xl border border-white/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`${s.color} mb-3 opacity-80`}>{s.icon}</div>
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-text-muted text-xs font-bold uppercase tracking-widest">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Draw Management */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl h-full border border-secondary/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Settings size={24} className="text-secondary" />
                Monthly Draw Control
              </h2>
              <button 
                onClick={handleTriggerDraw}
                disabled={processing}
                className="bg-secondary text-background px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {processing ? 'Processing...' : <><Play size={18} /> Run Draw Engine</>}
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-text-muted tracking-widest ml-1">Historical Execution</h3>
              {draws.slice(0, 5).map((draw, i) => (
                <div key={draw._id} className="bg-surface/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold">Draw #{draw._id.slice(-6).toUpperCase()}</div>
                    <div className="text-xs text-text-muted">{new Date(draw.drawDate).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {draw.winningNumbers.map(n => (
                      <span key={n} className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xs ring-1 ring-secondary/30">
                        {n}
                      </span>
                    ))}
                  </div>
                  <div className="text-primary font-bold text-sm">
                    {draw.winners.length} Winners
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management List */}
        <div className="glass p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Users size={24} className="text-primary" />
            Registry
          </h2>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {users.map(u => (
              <div key={u._id} className="p-4 bg-surface-light/30 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-surface-light/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {u.name}
                      {u.subscription.status === 'active' && <CheckCircle size={14} className="text-primary" />}
                    </div>
                    <div className="text-xs text-text-muted uppercase font-bold tracking-tighter">
                      Contributor to {u.charity?.name || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary text-xs font-bold">{u.scores.length}/5 Scores</div>
                  <div className="text-[10px] text-text-muted">{u.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
