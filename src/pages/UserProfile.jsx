import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { getPostsByUser, getUserById } from '../services/postService';
import AlertBanner from '../components/AlertBanner';
import SkeletonLoader from '../components/SkeletonLoader';

function externalWebsite(value) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setUser(null);
    try {
      const [developer, publications] = await Promise.all([getUserById(id), getPostsByUser(id)]);
      // JSONPlaceholder returns {} with HTTP 200 for unknown IDs, so check the data too.
      if (!developer?.id || !developer?.name) {
        setError('No developer was found for this profile ID. Check the address or return to the directory.');
        return;
      }
      setUser(developer);
      setPosts(publications);
    } catch {
      setError('This profile could not be loaded. The service may be unavailable. Retry or return to the directory.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="profile-page"><div className="page-intro"><div className="eyebrow">PROFILE DATA</div><h1>Loading <em>profile…</em></h1></div><SkeletonLoader count={2}/></div>;

  return <div className="profile-page">
    <Link to="/users" className="back-link"><ArrowLeft size={16}/> Back to directory</Link>
    {error && <AlertBanner message={error} onRetry={load}/>}
    {user && <>
      <section className="profile-hero"><div className="profile-avatar">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="profile-heading"><div className="eyebrow">DEVELOPER / {String(user.id).padStart(2, '0')}</div><h1>{user.name}</h1><p>@{user.username} <span className="status-pill"><span/> PROFILE AVAILABLE</span></p><div className="profile-tags"><span>{user.company?.name || 'Company not listed'}</span><span>{user.address?.city || 'Location not listed'}</span><span>Developer</span></div></div>{user.website && <a className="btn btn-outline profile-website" href={externalWebsite(user.website)} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16}/></a>}</section>
      <div className="profile-columns">
        <section className="panel"><div className="panel-heading"><span className="panel-index">01</span><h2>About this developer</h2></div>
          <div className="detail-row"><Mail size={17}/><div><small>EMAIL</small><a href={`mailto:${user.email}`}>{user.email}</a></div></div>
          <div className="detail-row"><Phone size={17}/><div><small>PHONE</small><span>{user.phone || 'Not listed'}</span></div></div>
          <div className="detail-row"><Globe size={17}/><div><small>WEBSITE</small>{user.website ? <a href={externalWebsite(user.website)} target="_blank" rel="noreferrer">{user.website}</a> : <span>Not listed</span>}</div></div>
          <div className="detail-row"><MapPin size={17}/><div><small>LOCATION</small><span>{[user.address?.suite, user.address?.street, user.address?.city, user.address?.zipcode].filter(Boolean).join(', ') || 'Not listed'}</span></div></div>
          <div className="detail-row"><Building2 size={17}/><div><small>ORGANIZATION</small><span>{user.company?.name || 'Not listed'}</span><p>{user.company?.catchPhrase || ''}</p></div></div>
        </section>
        <section className="panel posts-panel"><div className="panel-heading"><span className="panel-index">02</span><h2>Publications</h2><span className="panel-count">{posts.length} POSTS</span></div>{posts.length ? posts.map((post, index) => <article className="profile-post" key={post.id}><div className="post-number">{String(index + 1).padStart(2, '0')}</div><div><h3>{post.title}</h3><p>{post.body}</p><span className="post-author">POST / #{post.id}</span></div></article>) : <p className="muted">No publications were found for this developer.</p>}</section>
      </div>
    </>}
  </div>;
}
