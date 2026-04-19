import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trophy, Heart, CreditCard, X } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({ value: 36, date: new Date().toISOString().split('T')[0] });
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE_URL}/scores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(res.data);
    } catch (e) {
      console.error('Failed to fetch scores');
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    setModalError('');
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/scores`, {
        ...newScore,
        value: Number(newScore.value)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowScoreModal(false);
      fetchScores();
    } catch (e) {
      setModalError(e.response?.data?.error || 'Failed to add score. Please try again.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Welcome, <span className="brand-text">{user?.name}</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Your performance and impact at a glance.</p>
        </div>
        <button onClick={() => setShowScoreModal(true)} className="btn btn-primary">
          <Plus size={20} /> Log New Score
        </button>
      </header>

      {/* Grid */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--brand)' }}>
            <Trophy size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em' }}>ACTIVE SCORES</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900 }}>{scores.length}<span style={{ fontSize: '1rem', color: 'var(--text-dim)', marginLeft: '0.5rem' }}>/ 5</span></div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Only your latest 5 scores are active for draws.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--secondary)' }}>
            <Heart size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em' }}>TOTAL IMPACT</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900 }}>$12.50</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Supporting {user?.supportedCharity?.name || 'your cause'}.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
            <CreditCard size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em' }}>SUBSCRIPTION</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user?.subscription?.plan?.toUpperCase() || 'MONTHLY'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--brand)', fontWeight: 700 }}>ACTIVE</div>
        </div>
      </div>

      {/* Scores Table */}
      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Recent Performance</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                <th style={{ padding: '1.2rem 2.5rem' }}>DATE</th>
                <th style={{ padding: '1.2rem 2.5rem' }}>STABLEFORD SCORE</th>
                <th style={{ padding: '1.2rem 2.5rem' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s._id} style={{ borderTop: '1px solid var(--border)', background: i === 0 ? 'rgba(0,234,140,0.02)' : 'transparent' }}>
                  <td style={{ padding: '1.2rem 2.5rem' }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} color="var(--text-dim)" />
                      {new Date(s.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 2.5rem', fontWeight: 800, fontSize: '1.1rem' }}>{s.value}</td>
                  <td style={{ padding: '1.2rem 2.5rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                      background: i < 5 ? 'rgba(0,234,140,0.1)' : 'rgba(255,255,255,0.05)',
                      color: i < 5 ? 'var(--brand)' : 'var(--text-dim)'
                    }}>
                      {i < 5 ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </td>
                </tr>
              ))}
              {scores.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No scores recorded yet. Time to hit the course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showScoreModal && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
          }}>
            <motion.div 
              className="card" style={{ width: '100%', maxWidth: '400px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 style={{ fontSize: '1.5rem' }}>Log Score</h3>
                <X style={{ cursor: 'pointer' }} onClick={() => setShowScoreModal(false)} />
              </div>

              {modalError && <div className="error-msg">{modalError}</div>}

              <form onSubmit={handleAddScore}>
                <div className="input-group">
                  <label className="input-label">Stableford Points (1-45)</label>
                  <input 
                    type="number" className="input-field" min="1" max="45"
                    value={newScore.value} 
                    onChange={(e) => setNewScore({...newScore, value: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Round Date</label>
                  <input 
                    type="date" className="input-field" 
                    value={newScore.date}
                    onChange={(e) => setNewScore({...newScore, date: e.target.value})}
                    required 
                  />
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Submit Performance
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
