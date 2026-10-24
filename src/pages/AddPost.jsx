import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPost, getUsers } from '../services/postService';
import AlertBanner from '../components/AlertBanner';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

export default function AddPost() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersLoadFailed, setUsersLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersLoadFailed(false);
    setError('');
    try {
      const list = await getUsers();
      setUsers(list);
      // Keep the author selector on its placeholder until the user chooses an author.
    } catch {
      setUsersLoadFailed(true);
      setError('Unable to load authors from the API. Retry before publishing.');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const titleError = title.trim().length > 0 && (title.trim().length < 5 || title.trim().length > 80)
    ? 'Title must be between 5 and 80 characters.' : '';
  const bodyError = body.trim().length > 0 && (body.trim().length < 20 || body.trim().length > 500)
    ? 'Body must be between 20 and 500 characters.' : '';
  const valid = Boolean(userId) && title.trim().length >= 5 && title.trim().length <= 80 &&
    body.trim().length >= 20 && body.trim().length <= 500 && !loadingUsers && !usersLoadFailed && !submitting;

  const publish = async () => {
    setError('');
    setSuccess('');
    if (!valid) {
      setError('Please choose an author and meet the title and body length requirements before publishing.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createPost({ title: title.trim(), body: body.trim(), userId: Number(userId) });
      if (result.status === 201) {
        setSuccess('Post published successfully (HTTP 201 Created). The form has been reset.');
        setTitle('');
        setBody('');
        setUserId('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('The server did not confirm creation. Retry publishing.');
      }
    } catch {
      setError('Publishing failed because the request was rejected or the service is unavailable. Check your connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    publish();
  };

  return <div className="add-post-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Back to home</Link>
    <div className="page-intro compact-intro"><div className="eyebrow"><span className="eyebrow-dot"/> PUBLISH AN UPDATE</div><h1>Publish your <em>update.</em></h1><p>Share a project write-up, a lesson learned, or an update for your engineering team.</p></div>
    <div className="compose-layout">
      <section className="compose-panel">
        <div className="compose-heading"><div className="compose-icon"><Sparkles size={20}/></div><div><h2>New article</h2><p>Share a project, insight, or team update.</p></div><span className="draft-tag">NEW POST</span></div>
        {success && <AlertBanner type="success" message={success}/>}
        {error && <AlertBanner message={error} onRetry={usersLoadFailed ? loadUsers : error.includes('Publishing failed') || error.includes('Retry publishing') ? publish : undefined}/>}
        {loadingUsers ? <SkeletonLoader count={1}/> : usersLoadFailed ? <p className="muted">Author options are unavailable until the directory request succeeds. Use Retry above.</p> :
          <form className="stack-form post-form" onSubmit={submit} noValidate>
            <label>Author <span className="required-mark">*</span><select value={userId} onChange={(event) => setUserId(event.target.value)} required aria-label="Author"><option value="">Choose an author…</option>{users.map((developer) => <option key={developer.id} value={developer.id}>{developer.name} — {developer.company?.name || 'Independent'}</option>)}</select><small className="field-hint">Choose the developer this publication represents.</small></label>
            <label>Title <span className="required-mark">*</span><input value={title} onChange={(event) => setTitle(event.target.value)} minLength={5} maxLength={80} placeholder="Give your update a clear title" required aria-describedby="title-help"/><span id="title-help" className={`char-count ${titleError ? 'count-error' : ''}`}>{title.trim().length}/80 {titleError && `· ${titleError}`}</span></label>
            <label>Body content <span className="required-mark">*</span><textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={20} maxLength={500} rows={6} placeholder="Describe the project or share the key details…" required aria-describedby="body-help"/><span id="body-help" className={`char-count ${bodyError ? 'count-error' : ''}`}>{body.trim().length}/500 {bodyError && `· ${bodyError}`}</span></label>
            <div className="form-footer"><span><CheckCircle2 size={15}/> {user?.name || user?.email || 'Signed-in user'} · signed in</span><button type="submit" className="btn btn-primary btn-large" disabled={!valid}>{submitting ? 'Publishing…' : 'Publish post'} <Send size={16}/></button></div>
          </form>}
      </section>
      <aside className="compose-aside"><div className="aside-symbol">✦</div><div className="eyebrow">BEFORE YOU PUBLISH</div><h3>Make it useful.</h3><ul><li><span>01</span><div><strong>Keep it clear</strong><p>A precise title helps readers understand the update.</p></div></li><li><span>02</span><div><strong>Give the details</strong><p>Write at least 20 characters so the post has context.</p></div></li><li><span>03</span><div><strong>Choose an author</strong><p>The author list is loaded dynamically from the API.</p></div></li></ul><div className="aside-bottom">DEV DIRECTORY / TEAM UPDATES</div></aside>
    </div>
  </div>;
}
