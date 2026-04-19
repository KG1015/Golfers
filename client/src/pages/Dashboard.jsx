import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trophy, Heart, CreditCard, ChevronRight, X } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({ value: '', date: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/scores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(res.data);
    } catch (e) {
      console.error('Failed to fetch scores');
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/scores', newScore, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowScoreModal(false);
      fetchScores();
      setNewScore({ value: '', date: new Date().toISOString().split('T')[0] });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add score');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Profile & Subs */}
        <div className="md:w-1/3 space-y-6">
          <motion.div 
            className="glass p-8 rounded-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                {user?.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <CreditCard size={14} />
                  {user?.subscription.plan.toUpperCase()} PLAN
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Status</span>
                <span className="bg-success/20 text-success px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user?.subscription.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Renewal Date</span>
                <span>April 24, 2026</span>
              </div>
            </div>
          </motion.div>

          {/* Charity Card */}
          <motion.div 
            className="glass p-8 rounded-3xl border border-primary/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-primary mb-4">
              <Heart size={20} fill="currentColor" />
              <span className="font-bold uppercase tracking-widest text-xs">Giving Back</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Supporting {user?.charity?.name || 'Local Charities'}</h3>
            <p className="text-sm text-text-muted mb-4">You are contributing <span className="text-text font-bold">{user?.contributionPercentage}%</span> of your sub fee.</p>
            <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-semibold transition-all">
              Change Charity
            </button>
          </motion.div>

          {/* Winnings Card */}
          <motion.div 
            className="glass p-8 rounded-3xl bg-gradient-to-br from-surface to-surface-light border border-secondary/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-secondary mb-4">
              <Trophy size={20} />
              <span className="font-bold uppercase tracking-widest text-xs">Rewards</span>
            </div>
            <div className="text-4xl font-extrabold mb-1">${user?.totalWinnings || 0}</div>
            <div className="text-sm text-text-muted">Total Lifetime Winnings</div>
          </motion.div>
        </div>

        {/* Right Column: Scores */}
        <div className="md:w-2/3 space-y-6">
          <motion.div 
            className="glass p-8 rounded-3xl h-full min-h-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-extrabold">Recent Performance</h2>
                <p className="text-text-muted">Latest 5 scores are active for the current draw.</p>
              </div>
              <button 
                onClick={() => setShowScoreModal(true)}
                className="bg-primary text-background p-3 rounded-2xl hover:scale-105 transition-all shadow-lg"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {scores.length === 0 ? (
                <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/5">
                  <p className="text-text-muted">No scores recorded yet.</p>
                </div>
              ) : (
                scores.map((score, i) => (
                  <motion.div 
                    key={score._id} 
                    className="flex items-center justify-between p-6 bg-surface-light/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center text-3xl font-black text-primary border border-primary/20">
                        {score.value}
                      </div>
                      <div>
                        <div className="font-bold text-lg">Stableford Score</div>
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <Calendar size={14} />
                          {new Date(score.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-text-muted" />
                  </motion.div>
                ))
              )}
            </div>
            
            {scores.length >= 5 && (
              <p className="mt-6 text-xs text-text-muted text-center italic">
                Adding a new score will automatically replace your oldest entry.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Score Modal */}
      <AnimatePresence>
        {showScoreModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
            <motion.div 
              className="glass p-8 rounded-3xl w-full max-w-md relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button onClick={() => setShowScoreModal(false)} className="absolute top-6 right-6 text-text-muted hover:text-text">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-6">Enter Golf Score</h3>
              
              {error && <div className="bg-error/10 text-error border border-error/20 p-4 rounded-xl mb-6 text-sm">{error}</div>}

              <form onSubmit={handleAddScore} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Stableford Result (1-45)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="45"
                    className="w-full bg-surface border border-white/10 rounded-2xl py-4 px-4 text-text outline-none focus:border-primary/50 text-2xl font-bold text-center"
                    value={newScore.value}
                    onChange={(e) => setNewScore({...newScore, value: e.target.value})}
                    required
                    placeholder="--"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Match Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-surface border border-white/10 rounded-2xl py-4 px-4 text-text outline-none focus:border-primary/50 transition-all"
                    value={newScore.date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewScore({...newScore, date: e.target.value})}
                    required
                  />
                </div>
                <button className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:shadow-lg transition-all">
                  Confirm Entry
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
