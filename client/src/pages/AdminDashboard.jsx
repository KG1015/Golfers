import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BarChart3, Settings, Play, CheckCircle, AlertCircle, DollarSign, X } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [draws, setDraws] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

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
      alert('Draw failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Admin <span className="brand-text">Control</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage the guild and trigger monthly prize events.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('stats')} 
            className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-outline'}`}
          >
            Insights
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          >
            Members
          </button>
        </div>
      </header>

      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats Grid */}
          <div className="grid-3" style={{ marginBottom: '3rem' }}>
            <div className="card">
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--brand)' }}>
                <Users size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>TOTAL HEROES</span>
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900 }}>{stats?.totalUsers || 0}</div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--secondary)' }}>
                <DollarSign size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>ACTIVE SUBS</span>
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900 }}>{stats?.activeSubscriptions || 0}</div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-dim)' }}>
                <BarChart3 size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>REVENUE</span>
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900 }}>${(stats?.activeSubscriptions * 29.99 || 0).toFixed(0)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            {/* Draw History */}
            <div className="card" style={{ padding: '0' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'between' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Draw Records</h3>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <tr>
                      <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>DATE</th>
                      <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>WINNING NOS</th>
                      <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>PRIZE POOL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draws.map(d => (
                      <tr key={d._id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem 2rem', fontSize: '0.9rem' }}>{new Date(d.date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem 2rem' }}>
                          <div className="flex gap-1">
                            {d.winningNumbers.map((n, i) => (
                              <span key={i} style={{ width: '28px', height: '28px', background: 'var(--brand)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                                {n}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 2rem', fontWeight: 700 }}>${d.prizePool.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, #1a1a1a 100%)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Next Monthly Event</h3>
              <div style={{ padding: '2rem', background: 'rgba(0,234,140,0.03)', borderRadius: '16px', border: '1px dashed var(--brand)', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 800, marginBottom: '0.5rem' }}>CURRENT POOL ESTIMATE</div>
                <div style={{ fontSize: '3rem', fontWeight: 900 }}>${(stats?.activeSubscriptions * 15 || 0).toFixed(2)}</div>
              </div>
              <button 
                onClick={handleTriggerDraw} 
                disabled={processing}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1.2rem' }}
              >
                {processing ? 'Calculating Scores...' : <><Play size={18} fill="currentColor" /> Initialize Draw Now</>}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '1rem' }}>
                This will process all active performance scores against new random targets.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <tr>
                <th style={{ padding: '1.5rem 2rem', textAlign: 'left' }}>MEMBER</th>
                <th style={{ padding: '1.5rem 2rem', textAlign: 'left' }}>CHARITY</th>
                <th style={{ padding: '1.5rem 2rem', textAlign: 'left' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <div style={{ fontWeight: 700 }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1.2rem 2rem', fontSize: '0.9rem' }}>{u.supportedCharity?.name || '---'}</td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                      background: u.subscription?.status === 'active' ? 'rgba(0,234,140,0.1)' : 'rgba(255,77,77,0.1)',
                      color: u.subscription?.status === 'active' ? 'var(--brand)' : 'var(--error)'
                    }}>
                      {u.subscription?.status?.toUpperCase() || 'INACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
