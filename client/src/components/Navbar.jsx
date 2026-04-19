import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <div className="container flex justify-between items-center h-full">
        <Link to="/" className="flex items-center gap-4">
          <Trophy className="brand-text" size={28} />
          <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.1em' }}>HEROES</span>
        </Link>

        <div className="flex items-center gap-8 nav-links">
          <Link to="/charities">Charities</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" className="brand-text">Admin</Link>}
              <button 
                onClick={handleLogout} 
                style={{ background: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}
                className="flex items-center"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
