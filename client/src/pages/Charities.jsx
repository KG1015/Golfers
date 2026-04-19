import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config.js';
import { motion } from 'framer-motion';
import { Heart, Search, Globe, ExternalLink } from 'lucide-react';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/charities`);
      setCharities(res.data);
    } catch (e) {
      console.error('Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <header className="flex justify-between items-end mb-12">
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>Global <span className="brand-text">Impact</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
            Choose the cause your performance will support. Every drive makes a difference.
          </p>
        </div>
        <div className="input-group" style={{ width: '320px', marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search missions..." 
              className="input-field"
              style={{ paddingLeft: '3rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid-3">
          {[1, 2, 3].map(i => <div key={i} className="card" style={{ height: '300px', opacity: 0.1 }}></div>)}
        </div>
      ) : (
        <div className="grid-3">
          {filteredCharities.map((charity, i) => (
            <motion.div 
              key={charity._id}
              className="card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}
            >
              <div style={{ position: 'relative', height: '180px', margin: '-1.5rem -1.5rem 0', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                <img 
                  src={charity.image || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800'} 
                  alt={charity.name} 
                  style={{ width: '100%', height: '100%', objectCover: 'cover' }}
                />
              </div>
              <div className="flex justify-between items-start">
                <h3 style={{ fontSize: '1.5rem' }}>{charity.name}</h3>
                <div style={{ color: 'var(--brand)' }}><Globe size={20} /></div>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', flex: 1 }}>{charity.description}</p>
              <div className="flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--brand)', fontWeight: 800, fontSize: '0.8rem' }}>
                  <Heart size={14} fill="currentColor" />
                  ${charity.totalRaised?.toLocaleString() || 0} RAISED
                </div>
                <a href={charity.website} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                  VISIT <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Charities;
