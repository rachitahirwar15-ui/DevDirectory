import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, BookOpenText, Orbit, ShieldCheck, Users, Building2, Github } from 'lucide-react';
import { getPosts, getUsers } from '../services/postService';
import AlertBanner from '../components/AlertBanner';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Home() {
  const [stats, setStats] = useState({ users: null, posts: null, companies: null });
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [users, posts] = await Promise.all([getUsers(), getPosts()]);
      const companyCount = new Set(users.map((developer) => developer.company?.name).filter(Boolean)).size;
      const newestPosts = [...posts].sort((a, b) => b.id - a.id);
      setStats({ users: users.length, posts: posts.length, companies: companyCount });
      setLatest(newestPosts.slice(0, 3));
    } catch {
      setError('The overview data could not be loaded. Check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return <div className="home-page">
    <section className="hero"><div className="hero-grid-lines"/><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> A considered directory for people who build software</div><h1>Better work<br/>starts with <em>good connections.</em></h1><p className="hero-description">Discover developers, learn about their organisations, and explore shared work in one responsive directory.</p><div className="hero-actions"><Link to="/users" className="btn btn-primary btn-large">Browse developers <ArrowRight size={17}/></Link><Link to="/add-post" className="btn btn-outline btn-large">Share an update <ArrowDownRight size={17}/></Link></div><div className="hero-proof"><div className="proof-source-icon"><Github size={20}/></div><div><strong>Real profiles, direct links.</strong><small>Explore public developer accounts on GitHub.</small></div></div></div>
      <div className="hero-art" aria-label="Abstract electric-blue engineering illustration"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="arena-glow"/><div className="reactor"><div className="reactor-ring ring-a"/><div className="reactor-ring ring-b"/><div className="reactor-ring ring-c"/><div className="reactor-segments">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ transform: `rotate(${index * 30}deg) translateY(-104px)` }}/>)}</div><div className="reactor-core"><span>⌘</span></div></div><div className="orbit-label label-top">DEVDIRECTORY / PEOPLE</div><div className="orbit-label label-bottom">PEOPLE. PROJECTS. PRACTICE.</div><div className="art-cross cross-a">+</div><div className="art-cross cross-b">+</div></div>
      <div className="hero-index">01 <span>/ 04</span></div></section>

    {error && <AlertBanner message={error} onRetry={load}/>}
    <section className="stats-row"><div className="stat-item"><span className="stat-icon"><Users size={19}/></span><div><strong>{loading || error ? '—' : stats.users}</strong><span>Sample API users</span></div></div><div className="stat-item"><span className="stat-icon stat-red"><Building2 size={19}/></span><div><strong>{loading || error ? '—' : stats.companies}</strong><span>Sample companies</span></div></div><div className="stat-item"><span className="stat-icon stat-gold"><BookOpenText size={19}/></span><div><strong>{loading || error ? '—' : stats.posts}</strong><span>Sample publications</span></div></div><div className="stat-item"><span className="stat-icon stat-green"><ShieldCheck size={19}/></span><div><strong>Protected</strong><span>Publishing session</span></div></div></section>

    <section className="section-block" id="features"><div className="section-heading"><div><div className="eyebrow">A SIMPLE PLACE TO START</div><h2>Find people. Share what works.</h2></div><p>A useful directory should make the right next step feel obvious.</p></div><div className="feature-grid"><Link to="/users" className="feature-card feature-red"><div className="feature-number">01 / DIRECTORY</div><div className="feature-art-icon"><Users size={31}/></div><h3>Find your people.</h3><p>Search by developer name or company, then explore each directory profile.</p><span className="feature-link">Browse developers <ArrowRight size={16}/></span></Link><Link to="/users" className="feature-card feature-blue"><div className="feature-number">02 / PROFILES</div><div className="feature-art-icon"><Orbit size={31}/></div><h3>See the work.</h3><p>Browse authentic public GitHub accounts, or switch to assignment records to inspect course API profiles and posts.</p><span className="feature-link">View profiles <ArrowRight size={16}/></span></Link><Link to="/add-post" className="feature-card feature-gold"><div className="feature-number">03 / BULLETINS</div><div className="feature-art-icon"><BookOpenText size={31}/></div><h3>Share an update.</h3><p>Publish a project note, a lesson learned, or an update your team can build on.</p><span className="feature-link">Write an update <ArrowRight size={16}/></span></Link></div></section>

    <section className="latest-section" id="updates"><div className="section-heading"><div><div className="eyebrow">RECENTLY PUBLISHED</div><h2>Ideas worth <em>your time.</em></h2></div><Link to="/users" className="text-link">Explore directory <ArrowRight size={16}/></Link></div>{loading ? <SkeletonLoader count={3}/> : error ? <div className="empty-state"><h3>Publications are temporarily unavailable</h3><p>Use the Retry control above to load them again.</p></div> : <div className="post-grid">{latest.map((post, index) => <article className="post-card" key={post.id}><div className="post-top"><span className={`post-tag tag-${index}`}>FIELD NOTE / {String(index + 1).padStart(2, '0')}</span><span className="post-spark">✳</span></div><h3>{post.title}</h3><p>{post.body}</p><div className="post-foot"><span>DEVELOPER #{String(post.userId).padStart(2, '0')}</span><span>PUBLICATION #{post.id}</span></div></article>)}</div>}</section>

    <section className="cta-band"><div className="cta-symbol">✦</div><div><div className="eyebrow">CONTRIBUTE TO THE COMMUNITY</div><h2>Have something to share?</h2><p>Explore the directory or publish an update for the community.</p></div><Link to="/users" className="btn btn-light">Browse developers <ArrowRight size={17}/></Link></section>
  </div>;
}
