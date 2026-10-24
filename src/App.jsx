import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import UserDirectory from './pages/UserDirectory';
import UserProfile from './pages/UserProfile';
import AddPost from './pages/AddPost';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);

  return <div className="app-shell"><Navbar /><main className="page-wrap"><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users" element={<UserDirectory />} />
    <Route path="/users/:id" element={<UserProfile />} />
    <Route path="/login" element={<Login />} />
    <Route path="/add-post" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><footer className="footer"><span className="footer-brand">DevDirectory</span><span>·</span><span>Developer Directory</span><span className="footer-muted">A place to discover people doing thoughtful work.</span><span className="footer-credit">Made by <strong>Rachit Ahirwar</strong> · BCA III</span></footer></div>;
}