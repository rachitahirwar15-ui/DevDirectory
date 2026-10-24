import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return <div className="not-found">
    <div className="not-found-icon"><Compass size={44}/><span>404</span></div>
    <div className="eyebrow">PAGE NOT FOUND</div>
    <h1>This route could not<br/>be <em>found.</em></h1>
    <p>The address may be incorrect or the page may have moved. Return to the home page to continue.</p>
    <Link to="/" className="btn btn-primary btn-large"><ArrowLeft size={17}/> Back to home</Link>
  </div>;
}
