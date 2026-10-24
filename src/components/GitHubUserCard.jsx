import React from 'react';
import { ArrowUpRight, Building2, ExternalLink, MapPin, Users, BookOpen, Github } from 'lucide-react';

function compactNumber(value) {
  if (typeof value !== 'number') return null;
  return new Intl.NumberFormat('en', { notation: value >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);
}

export default function GitHubUserCard({ user }) {
  const login = user.login;
  const profileUrl = user.html_url || `https://github.com/${login}`;
  const name = user.name || login;
  const company = typeof user.company === 'string' ? user.company.replace(/^@/, '') : '';
  const followers = compactNumber(user.followers);
  const repositories = compactNumber(user.public_repos);

  return (
    <article className="user-card directory-user-card github-user-card">
      <div className="user-card-top github-card-top">
        <img
          className="github-avatar"
          src={user.avatar_url || `https://github.com/${login}.png`}
          alt={`${name}'s GitHub avatar`}
          loading="lazy"
          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = 'https://github.com/github.png'; }}
        />
        <div className="directory-user-heading">
          <h3>{name}</h3>
          <a className="user-company github-handle" href={profileUrl} target="_blank" rel="noreferrer">@{login}</a>
        </div>
        <a className="github-icon-link" href={profileUrl} target="_blank" rel="noreferrer" aria-label={`Open ${login} on GitHub`} title="Open real GitHub profile">
          <Github size={17} />
        </a>
      </div>

      <p className="github-bio">{user.bio || (user.isLive ? 'Public GitHub profile. Open the account to explore repositories and contributions.' : 'Real public GitHub account. Live details are temporarily unavailable.')}</p>

      <div className="github-meta">
        {company && <span><Building2 size={14} />{company}</span>}
        {user.location && <span><MapPin size={14} />{user.location}</span>}
        {!company && !user.location && <span className="github-meta-muted"><Github size={14} />Public GitHub account</span>}
      </div>

      <div className="github-stats">
        {followers !== null && <span><Users size={14} /><strong>{followers}</strong> followers</span>}
        {repositories !== null && <span><BookOpen size={14} /><strong>{repositories}</strong> repositories</span>}
        {user.type && <span className="github-account-type">{user.type}</span>}
      </div>

      <div className="user-card-footer github-card-footer">
        <span className={`profile-kind ${user.isLive ? 'profile-live' : ''}`}><span className="profile-dot" />{user.isLive ? 'Live GitHub data' : 'Public profile link'}</span>
        <a href={profileUrl} target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={16} /></a>
      </div>
    </article>
  );
}
