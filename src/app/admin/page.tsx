"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, LogOut, RefreshCw } from "lucide-react";

type Enquiry = { _id: string; name: string; email: string; phone: string; websiteType: string; budget: string; requirements: string; status: string; createdAt: string };
type Feedback = { _id: string; name: string; rating: number; message: string; createdAt: string };

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [error, setError] = useState("");

  async function loadData() {
    const [enquiriesResponse, feedbackResponse] = await Promise.all([fetch("/api/enquiries"), fetch("/api/feedback")]);
    if (enquiriesResponse.status === 401) { setLoggedIn(false); return; }
    setEnquiries(await enquiriesResponse.json()); setFeedback(await feedbackResponse.json()); setLoggedIn(true);
  }
  useEffect(() => { const timer = window.setTimeout(() => void loadData(), 0); return () => window.clearTimeout(timer); }, []);
  async function signIn(event: React.FormEvent) { event.preventDefault(); setError(""); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(login) }); if (!response.ok) { setError((await response.json()).error); return; } await loadData(); }
  async function updateStatus(id: string, status: string) { await fetch("/api/enquiries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }); await loadData(); }
  async function deleteItem(type: "enquiries" | "feedback", id: string) { await fetch(`/api/${type}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await loadData(); }
  async function signOut() { await fetch("/api/auth/logout", { method: "POST" }); setLoggedIn(false); }

  if (!loggedIn) return <main className="admin-page"><div className="admin-login"><Link href="/" className="brand"><span className="brand-mark">W</span><span>Web<span className="brand-accent">Service</span></span></Link><h1>Admin access</h1><p>Sign in to manage enquiries and feedback.</p><form onSubmit={signIn}><label>Email<input type="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} required /></label><label>Password<input type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} required /></label><button className="button button-dark">Sign in</button>{error && <small className="admin-error">{error}</small>}</form></div></main>;

  return <main className="admin-page"><div className="admin-shell"><header className="admin-header"><div><Link href="/" className="brand"><span className="brand-mark">W</span><span>Web<span className="brand-accent">Service</span></span></Link><h1>Dashboard</h1></div><div className="admin-actions"><button onClick={() => void loadData()} aria-label="Refresh"><RefreshCw size={17} /></button><button onClick={() => void signOut()}><LogOut size={16} /> Sign out</button></div></header><section className="admin-stats"><div><strong>{enquiries.length}</strong><span>Enquiries</span></div><div><strong>{feedback.length}</strong><span>Feedback</span></div><div><strong>{enquiries.filter((item) => item.status === "new").length}</strong><span>New leads</span></div></section><section className="admin-section"><h2>Enquiries</h2><div className="admin-table">{enquiries.length === 0 && <p className="empty">No enquiries yet.</p>}{enquiries.map((item) => <article className="admin-item" key={item._id}><div><strong>{item.name}</strong><span>{item.email} · {item.phone}</span><span>{item.websiteType} · {item.budget}</span><p>{item.requirements}</p></div><div className="item-actions"><select value={item.status} onChange={(event) => void updateStatus(item._id, event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="closed">Closed</option></select><button aria-label="Delete enquiry" onClick={() => void deleteItem("enquiries", item._id)}><Trash2 size={16} /></button></div></article>)}</div></section><section className="admin-section"><h2>Feedback</h2><div className="admin-table">{feedback.length === 0 && <p className="empty">No feedback yet.</p>}{feedback.map((item) => <article className="admin-item" key={item._id}><div><strong>{item.name} <span className="stars">{"★".repeat(item.rating)}</span></strong><p>{item.message}</p></div><button aria-label="Delete feedback" onClick={() => void deleteItem("feedback", item._id)}><Trash2 size={16} /></button></article>)}</div></section></div></main>;
}
