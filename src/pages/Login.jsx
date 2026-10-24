import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/AlertBanner';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const attemptedRoute = location.state?.from;
  const redirectTo = attemptedRoute
    ? `${attemptedRoute.pathname || '/'}${attemptedRoute.search || ''}${attemptedRoute.hash || ''}`
    : '/add-post';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const readAccounts = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('devdirectory_demo_accounts') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  const submit = (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (mode === 'signup') {
      if (name.trim().length < 2) return setError('Please enter your name (at least 2 characters).');
      if (password.length < 8) return setError('Use a password with at least 8 characters.');
      if (password !== confirm) return setError('The passwords do not match.');
      const accounts = readAccounts();
      if (accounts.some((account) => account.email.toLowerCase() === email.trim().toLowerCase())) return setError('An account with this email already exists. Sign in instead.');
      const account = { name: name.trim(), email: email.trim(), password };
      localStorage.setItem('devdirectory_demo_accounts', JSON.stringify([...accounts, account]));
      login({ name: account.name, email: account.email });
      navigate(redirectTo, { replace: true });
      return;
    }
    const accounts = readAccounts();
    const account = accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (accounts.length && !account) return setError('Email or password is incorrect. Check your details or create an account.');
    if (!accounts.length && (!email.trim() || !password)) return setError('Enter your email and password to continue.');
    login(account ? { name: account.name, email: account.email } : { name: email.split('@')[0], email: email.trim() });
    navigate(redirectTo, { replace: true });
  };

  return <div className="login-layout">
    <section className="login-art">
      <div className="eyebrow"><span className="eyebrow-dot"/> A thoughtful directory for developers</div>
      <div className="login-art-symbol"><div className="auth-orbit"><div className="auth-orbit-core"/></div></div>
      <h2>Good work<br/>starts with <em>people.</em></h2>
      <p>Meet developers, explore what they’re building, and share ideas worth passing on.</p>
      <div className="auth-benefits"><span><CheckCircle2 size={16}/> Discover people and projects</span><span><CheckCircle2 size={16}/> Publish useful field notes</span><span><CheckCircle2 size={16}/> Keep your profile in one place</span></div>
      <div className="login-art-bottom"><span>DevDirectory / COMMUNITY</span><span>BUILT FOR BUILDERS</span></div>
    </section>
    <section className="login-panel"><div className="login-form-wrap">
      <div className="form-kicker"><LockKeyhole size={16}/> YOUR WORKSPACE</div>
      <h1>{mode === 'signin' ? <>Welcome <em>back.</em></> : <>Create your <em>account.</em></>}</h1>
      <p className="muted">{mode === 'signin' ? 'Sign in to continue to your workspace.' : 'A few details and you’re ready to get started.'}</p>
      <div className="auth-tabs"><button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => {setMode('signin');setError('');setSuccess('');}}>Sign in</button><button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => {setMode('signup');setError('');setSuccess('');}}>Create account</button></div>
      {isAuthenticated && <AlertBanner type="info" message="You’re already signed in. You can continue to publishing."/>}
      {error && <AlertBanner message={error}/>}{success && <AlertBanner type="success" message={success}/>}
      <form onSubmit={submit} className="stack-form">
        {mode === 'signup' && <label>Full name<span className="input-wrap"><input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required minLength={2}/><UserRound size={16}/></span></label>}
        <label>Email address<span className="input-wrap"><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/><Mail size={16}/></span></label>
        <label>Password<span className="input-wrap"><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={mode === 'signup' ? 8 : 1}/><LockKeyhole size={16}/></span></label>
        {mode === 'signup' && <label>Confirm password<span className="input-wrap"><input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" required minLength={8}/><LockKeyhole size={16}/></span></label>}
        <button className="btn btn-primary btn-large full-btn" type="submit">{mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={17}/></button>
      </form>
      <div className="login-note"><span><LockKeyhole size={16}/></span><p><strong>Student project demo</strong><br/>Accounts are stored locally in this browser only. Don’t use a real password; this is not production-grade authentication.</p></div>
      <Link className="back-link login-back" to="/">← Back to directory</Link>
    </div></section>
  </div>;
}
