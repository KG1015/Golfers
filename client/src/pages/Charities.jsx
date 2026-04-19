import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { motion } from 'framer-motion';
import { Heart, Search, Globe, Info, ExternalLink } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black mb-4 grad-text">Global Impact</h1>
          <p className="text-xl text-text-muted">
            The heart of Digital Heroes. Choose where your contributions go. 
            We partner with organizations making tangible differences on the ground.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search charities..." 
            className="w-full bg-surface-light border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text outline-none focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-96 rounded-3xl animate-pulse bg-surface/30"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCharities.map((charity, i) => (
            <motion.div 
              key={charity._id}
              className="glass rounded-3xl overflow-hidden group border border-white/5 hover:border-primary/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={charity.image || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800'} 
                  alt={charity.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                />
                <div className="absolute top-4 left-4 bg-primary text-background px-3 py-1 rounded-full text-xs font-black">
                  FEATURED
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{charity.name}</h3>
                <p className="text-text-muted text-sm mb-6 line-clamp-3 leading-relaxed">
                  {charity.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-primary">
                    <Heart size={16} fill="currentColor" />
                    <span className="text-xs font-bold">${charity.totalRaised?.toLocaleString() || 0} Raised</span>
                  </div>
                  <a 
                    href={charity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-text-muted hover:text-text transition-colors text-xs font-semibold no-underline uppercase tracking-widest"
                  >
                    Site <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredCharities.length === 0 && !loading && (
        <div className="text-center py-24 glass rounded-3xl">
          <Info size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-lg">No charities found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Charities;
