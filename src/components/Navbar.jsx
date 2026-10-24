import React from 'react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Orbit, LogOut, Network, Users, Layers3, FileText, House } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const signOut = () => { logout(); close(); navigate('/'); };
  return <header className="topbar"><div className="nav-inner">
    <Link to="/" className="brand" onClick={close}><span className="brand-emblem"><Network size={25}/></span><span className="brand-word">Dev<span className="brand-accent">Directory</span><small>DEVELOPER DIRECTORY</small></span></Link>
    <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <nav className={`nav-links ${open ? 'nav-open' : ''}`}>
      <NavLink to="/" end onClick={close}><House size={17}/> Home</NavLink>
      <NavLink to="/users" onClick={close}><Users size={17}/> Developers</NavLink>
      <Link to="/#features" onClick={close}><Layers3 size={17}/> About</Link>
      <Link to="/#updates" onClick={close}><FileText size={17}/> Writing</Link>
      <div className="nav-action">{isAuthenticated ? <><span className="nav-user">{user?.name || user?.email}</span><button className="btn btn-quiet btn-small" onClick={signOut}><LogOut size={14}/> Logout</button></> : <Link to="/login" className="btn btn-primary btn-small" onClick={close}><Orbit size={17}/> Sign in <span>→</span></Link>}</div>
    </nav>
  </div></header>;
}
