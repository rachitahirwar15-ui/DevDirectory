import React from 'react';
export default function SkeletonLoader({ count = 6 }) {
  return <div className="user-grid" aria-label="Loading developers">{Array.from({ length: count }, (_, i) => <div className="skeleton-card" key={i}><div className="skeleton skeleton-avatar"/><div className="skeleton skeleton-line short"/><div className="skeleton skeleton-line"/><div className="skeleton skeleton-line medium"/><div className="skeleton skeleton-line button-line"/></div>)}</div>;
}