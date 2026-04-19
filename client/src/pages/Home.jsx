import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="container">
      {/* Hero */}
      <section style={{ padding: '80px 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Play with<br />
            <span className="brand-text">Purpose.</span>
          </h1>
          <p className="hero-text">
            The world's first performance-driven charitable platform for golfers. 
            Track your progress, support causes, and win monthly prizes.
          </p>
          <div className="flex gap-4">
            <Link to="/signup" className="btn btn-primary">Join the Community</Link>
            <Link to="/charities" className="btn btn-outline">Explore Causes</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ position: 'relative' }}>
            <img 
              src="/hero.png" 
              alt="Digital Heroes" 
              style={{ width: '100%', borderRadius: '24px', border: '1px solid var(--border)' }}
            />
            {/* Minimal Stat Badge */}
            <div className="card" style={{ position: 'absolute', bottom: '-20px', left: '-20px', padding: '1rem 1.5rem', borderRadius: '12px' }}>
              <div style={{ color: 'var(--brand)', fontWeight: 900, fontSize: '1.5rem' }}>$124,000+</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em' }}>TOTAL IMPACT</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid */}
      <section style={{ padding: '60px 0 120px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {[
          { icon: <Target />, title: "Track Growth", desc: "Log your scores and see your performance evolve over time." },
          { icon: <Globe />, title: "Direct Giving", desc: "10% of every subscription goes directly to your selected charity." },
          { icon: <Trophy />, title: "Monthly Draws", desc: "Your scores are your entries. Higher performance, higher stakes." }
        ].map((f, i) => (
          <motion.div 
            key={i} 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
          >
            <div style={{ color: 'var(--brand)', marginBottom: '1.5rem' }}>{f.icon}</div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
