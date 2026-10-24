import React from 'react';
import { ArrowUpRight, Building2, MapPin, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const tones = ['blue', 'teal', 'slate', 'violet', 'sky'];

export default function UserCard({ user }) {
  const initials = user.name?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'DEV';
  const company = user.company?.name || 'Company not listed';
  const city = user.address?.city || 'Location not listed';

  return <article className="user-card directory-user-card">
    <div className="user-card-top">
      <div className={`user-card-avatar avatar-tone-${tones[(Number(user.id) || 0) % tones.length]}`}>{initials}</div>
      <div className="directory-user-heading"><h3>{user.name}</h3><div className="user-company">@{user.username || 'developer'}</div></div>
      <Link className="github-icon-link" to={`/users/${user.id}`} aria-label={`Open ${user.name} profile`}><ArrowUpRight size={17}/></Link>
    </div>
    <p className="directory-summary">{user.company?.catchPhrase || 'Developer profile from the DevDirectory directory.'}</p>
    <div className="directory-company"><Building2 size={15}/><span>{company}</span></div>
    <div className="directory-details"><span><MapPin size={14}/>{city}</span><span><Mail size={14}/>{user.email || 'Email not listed'}</span><span><Globe size={14}/>{user.website || 'Website not listed'}</span></div>
    <div className="user-card-footer"><span className="profile-kind"><span className="profile-dot"/> Directory profile</span><Link to={`/users/${user.id}`}>View profile <ArrowUpRight size={16}/></Link></div>
  </article>;
}
