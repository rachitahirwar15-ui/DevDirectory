import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, Users, RotateCcw, ExternalLink, Github, Database } from 'lucide-react';
import UserCard from '../components/UserCard';
import GitHubUserCard from '../components/GitHubUserCard';
import SkeletonLoader from '../components/SkeletonLoader';
import AlertBanner from '../components/AlertBanner';
import useDebounce from '../hooks/useDebounce';
import { getUsers } from '../services/postService';
import { getFeaturedGithubProfiles, searchGithubProfiles } from '../services/githubService';

export default function UserDirectory() {
  const [source, setSource] = useState('github');
  const [githubUsers, setGithubUsers] = useState([]);
  const [assignmentUsers, setAssignmentUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [githubLoading, setGithubLoading] = useState(true);
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [githubSearchLoading, setGithubSearchLoading] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [assignmentError, setAssignmentError] = useState('');
  const [githubSearchError, setGithubSearchError] = useState('');
  const [githubSearchResults, setGithubSearchResults] = useState([]);
  const debouncedQuery = useDebounce(query, 400);

  const loadGithub = useCallback(async (signal) => {
    setGithubLoading(true);
    setGithubError('');
    try {
      const profiles = await getFeaturedGithubProfiles(signal);
      setGithubUsers(profiles);
      if (profiles.length && profiles.every((profile) => !profile.isLive)) {
        setGithubError('GitHub profile details could not be refreshed right now. The listed accounts and direct profile links are genuine; retry to load live details.');
      }
    } catch (error) {
      if (signal?.aborted) return;
      setGithubError('GitHub profiles could not be loaded. Check your connection and retry.');
    } finally {
      if (!signal?.aborted) setGithubLoading(false);
    }
  }, []);

  const loadAssignmentUsers = useCallback(async () => {
    setAssignmentLoading(true);
    setAssignmentError('');
    try {
      setAssignmentUsers(await getUsers());
    } catch {
      setAssignmentError('The JSONPlaceholder assignment data could not be loaded. Check your connection and retry.');
    } finally {
      setAssignmentLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadGithub(controller.signal);
    loadAssignmentUsers();
    return () => controller.abort();
  }, [loadGithub, loadAssignmentUsers]);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const matchingGithubUsers = useMemo(() => {
    if (!normalizedQuery) return githubUsers;
    return githubUsers.filter((developer) =>
      [developer.name, developer.login, developer.company, developer.location, developer.bio]
        .filter((field) => typeof field === 'string' && field.trim())
        .some((field) => field.toLowerCase().includes(normalizedQuery))
    );
  }, [githubUsers, normalizedQuery]);

  // Use GitHub's public user-search endpoint for names not present in the curated profiles.
  // The visible results remain actual public GitHub accounts with their real profile URLs.
  useEffect(() => {
    if (source !== 'github' || normalizedQuery.length < 2 || matchingGithubUsers.length > 0) {
      setGithubSearchResults([]);
      setGithubSearchError('');
      setGithubSearchLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setGithubSearchLoading(true);
    setGithubSearchError('');
    searchGithubProfiles(debouncedQuery.trim(), controller.signal)
      .then((results) => setGithubSearchResults(results))
      .catch((error) => {
        if (controller.signal.aborted) return;
        setGithubSearchResults([]);
        setGithubSearchError(error?.response?.status === 403
          ? 'GitHub search is temporarily rate-limited. Open a featured profile or try again later.'
          : 'GitHub search could not be completed. Check your connection and retry.');
      })
      .finally(() => { if (!controller.signal.aborted) setGithubSearchLoading(false); });

    return () => controller.abort();
  }, [source, normalizedQuery, matchingGithubUsers.length, debouncedQuery]);

  const filteredAssignmentUsers = useMemo(() => {
    if (!normalizedQuery) return assignmentUsers;
    return assignmentUsers.filter((developer) =>
      [developer.name, developer.company?.name]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery))
    );
  }, [assignmentUsers, normalizedQuery]);

  const githubDisplayed = normalizedQuery && matchingGithubUsers.length === 0
    ? githubSearchResults
    : matchingGithubUsers;
  const loading = source === 'github' ? (githubLoading || githubSearchLoading) : assignmentLoading;
  const error = source === 'github' ? (githubError || githubSearchError) : assignmentError;
  const displayed = source === 'github' ? githubDisplayed : filteredAssignmentUsers;
  const retry = source === 'github'
    ? () => {
      const controller = new AbortController();
      loadGithub(controller.signal);
      if (normalizedQuery.length >= 2 && matchingGithubUsers.length === 0) {
        setGithubSearchResults([]);
        setGithubSearchError('');
        searchGithubProfiles(debouncedQuery.trim(), controller.signal)
          .then(setGithubSearchResults)
          .catch(() => setGithubSearchError('GitHub search could not be completed. Check your connection and retry.'));
      }
    }
    : loadAssignmentUsers;

  return <div className="directory-page">
    <div className="page-intro">
      <div className="eyebrow">DEVELOPER DIRECTORY</div>
      <h1>People who <em>build the web.</em></h1>
      <p>Discover real GitHub developers, open their public profiles, and explore their work. The assignment API dataset remains available for the required coursework scenarios.</p>
      <div className="intro-count"><Users size={16}/>{loading ? 'Loading profiles…' : `${displayed.length} ${source === 'github' ? 'GitHub profiles' : 'assignment records'} shown`}</div>
    </div>

    <div className="directory-source-tabs" role="tablist" aria-label="Directory data source">
      <button type="button" role="tab" aria-selected={source === 'github'} className={source === 'github' ? 'source-tab active' : 'source-tab'} onClick={() => setSource('github')}><Github size={16}/> Real GitHub profiles <span>LIVE</span></button>
      <button type="button" role="tab" aria-selected={source === 'assignment'} className={source === 'assignment' ? 'source-tab active' : 'source-tab'} onClick={() => setSource('assignment')}><Database size={16}/> Assignment API <span>JSONPLACEHOLDER</span></button>
    </div>

    <div className="directory-toolbar">
      <label className="search-box"><Search size={19}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={source === 'github' ? 'Search GitHub name or username…' : 'Search by name or company…'} aria-label={source === 'github' ? 'Search GitHub developers' : 'Search assignment developers by name or company'}/><kbd>/</kbd></label>
      <div className="filter-note"><SlidersHorizontal size={16}/>{source === 'github' ? 'PUBLIC GITHUB ACCOUNTS' : 'NAME / COMPANY'}</div>
    </div>
    <p className="directory-note">{source === 'github'
      ? 'Featured accounts are real public GitHub profiles. Search can query GitHub for additional real accounts; unauthenticated API limits may apply.'
      : 'This mode uses the exact JSONPlaceholder records required by the assignment, including the Leanne Graham search scenario.'}</p>

    {error && <AlertBanner message={error} onRetry={retry}/>} 
    {loading ? <SkeletonLoader count={6}/> : error && !displayed.length ? null : displayed.length ? <>
      <div className="results-line"><span>SHOWING <b>{displayed.length}</b>{source === 'github' && !normalizedQuery ? ' FEATURED PROFILES' : normalizedQuery ? ' MATCHES' : ' RECORDS'}</span><button className="directory-reset" onClick={retry} type="button"><RotateCcw size={13}/> Refresh directory</button></div>
      <div className="user-grid">{source === 'github'
        ? githubDisplayed.map((developer) => <GitHubUserCard key={developer.id || developer.login} user={developer}/>)
        : filteredAssignmentUsers.map((developer) => <UserCard key={developer.id} user={developer}/>)}</div>
    </> : <div className="empty-state"><div className="empty-icon"><Search size={26}/></div><h3>{source === 'github' ? 'No matching GitHub accounts' : 'No matching developers'}</h3><p>{source === 'github' ? 'Try a different name or username. Search results link directly to real GitHub profiles.' : 'Try another developer name or company name.'}</p><button className="btn btn-outline" onClick={() => setQuery('')} type="button">Clear search</button></div>}
    <div className="directory-source"><span>{source === 'github' ? 'Data source: GitHub public REST API' : 'Data source: JSONPlaceholder'}</span><a href={source === 'github' ? 'https://docs.github.com/en/rest/users/users' : 'https://jsonplaceholder.typicode.com'} target="_blank" rel="noreferrer">API reference <ExternalLink size={13}/></a></div>
  </div>;
}
