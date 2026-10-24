import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, RotateCcw, X } from 'lucide-react';

export default function AlertBanner({ type = 'error', message, onRetry, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => { setDismissed(false); }, [message, type]);
  if (!message || dismissed) return null;
  const Icon = type === 'success' ? CheckCircle2 : type === 'info' ? Info : AlertCircle;
  return <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
    <Icon size={19} aria-hidden="true"/>
    <span className="alert-message">{message}</span>
    {onRetry && <button type="button" className="alert-retry" onClick={onRetry}><RotateCcw size={14}/> Retry</button>}
    <button type="button" className="alert-close" aria-label="Dismiss alert" onClick={() => { setDismissed(true); onDismiss?.(); }}> <X size={16}/></button>
  </div>;
}
