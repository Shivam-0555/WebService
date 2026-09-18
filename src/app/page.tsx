"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, Globe2, Menu, MessageCircle, Monitor, Palette, Send, ShoppingBag, Smartphone, Sparkles, X, Zap } from "lucide-react";

const portfolioUrl = "https://loquacious-bienenstitch-80cf6c.netlify.app/";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const services = [
  { icon: Globe2, number: "01", name: "Business Website", text: "A confident digital home for your brand, team, and next big opportunity." },
  { icon: ShoppingBag, number: "02", name: "E-Commerce Website", text: "A smooth, conversion-ready storefront built around how your customers shop." },
  { icon: Smartphone, number: "03", name: "Restaurant & Café", text: "Make your menu, atmosphere, and table bookings easy to discover." },
  { icon: Palette, number: "04", name: "Portfolio Website", text: "A sharp personal showcase that puts your best work in the spotlight." },
  { icon: Zap, number: "05", name: "Landing Page", text: "Focused pages designed to turn a clear offer into meaningful action." },
  { icon: Monitor, number: "06", name: "Custom Web Application", text: "Purpose-built interfaces and workflows for ambitious digital products." },
];
const prices = [
  { label: "Starter", title: "A clear first impression", text: "For focused launches and small businesses that need to get online with intent.", features: ["Discovery call", "Responsive page design", "SEO-ready structure"], action: "Discuss a starter" },
  { label: "Business", title: "A site that works harder", text: "For growing brands that need a complete, polished web presence.", features: ["Multi-page experience", "Content and conversion strategy", "Launch support"], action: "Plan my website", featured: true },
  { label: "Custom", title: "Built around your workflow", text: "For teams with a bigger idea, a unique process, or a product to shape.", features: ["Custom scope and roadmap", "Interactive functionality", "Flexible ongoing support"], action: "Start a conversation" },
];
type PublicFeedback = { _id: string; name: string; rating: number; message: string; createdAt: string };

function SectionLabel({ children }: { children: string }) { return <p className="section-label">{children}</p>; }

function FeedbackDisplay({ feedback, status, message }: { feedback: PublicFeedback[]; status: string; message: string }) {
  if (status === "loading") return <p className="feedback-status">Loading feedback...</p>;
  if (status === "error") return <p className="feedback-status">{message}</p>;
  if (feedback.length === 0) return <p className="feedback-status">No feedback yet. Be the first to share your experience.</p>;
  return <div className="feedback-list" aria-live="polite">{feedback.map((item) => <article className="feedback-card" key={item._id}><div className="feedback-stars" aria-label={`${item.rating} out of 5 stars`}>{String.fromCharCode(9733).repeat(item.rating)}</div><p>“{item.message}”</p><span>— {item.name}</span>{item.createdAt && <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time>}</article>)}</div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState<string | null>(null);
  const [enquiryState, setEnquiryState] = useState({ status: "idle", message: "" });
  const [feedbackState, setFeedbackState] = useState({ status: "idle", message: "" });
  const [feedback, setFeedback] = useState<PublicFeedback[]>([]);
  const [feedbackLoadState, setFeedbackLoadState] = useState({ status: "loading", message: "" });

  async function loadFeedback() {
    setFeedbackLoadState({ status: "loading", message: "" });
    try {
      const response = await fetch(`${apiUrl}/api/feedback`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error(data.error || "Could not load feedback.");
      setFeedback(data);
      setFeedbackLoadState({ status: "success", message: "" });
    } catch {
      setFeedbackLoadState({ status: "error", message: "Feedback could not be loaded right now." });
    }
  }

  useEffect(() => { const timer = window.setTimeout(() => void loadFeedback(), 0); return () => window.clearTimeout(timer); }, []);

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setEnquiryState({ status: "loading", message: "" });
    try { const response = await fetch(`${apiUrl}/api/enquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setEnquiryState({ status: "success", message: data.message }); event.currentTarget.reset(); } catch (error) { setEnquiryState({ status: "error", message: error instanceof Error ? error.message : "Something went wrong. Please try again." }); }
  }
  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());
    if (typeof formData.name !== "string" || !formData.name.trim() || typeof formData.message !== "string" || !formData.message.trim() || !/^[1-5]$/.test(String(formData.rating))) {
      setFeedbackState({ status: "error", message: "Please add your name, a rating, and feedback." });
      return;
    }
    setFeedbackState({ status: "loading", message: "" });
    try {
      const response = await fetch(`${apiUrl}/api/feedback`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.feedback) setFeedback((current) => [data.feedback, ...current]);
      else await loadFeedback();
      setFeedbackState({ status: "success", message: data.message });
      form.reset();
    } catch (error) {
      setFeedbackState({ status: "error", message: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    }
  }
  function openWhatsApp() { const message = encodeURIComponent("Hi, I want to build a website.\n\nI would love to discuss my project with you."); window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${message}`, "_blank", "noopener,noreferrer"); }
  return <main>
    <nav className="nav-shell"><a href="#top" className="brand"><img src="/logo-icon.png" alt="WebService Logo" className="brand-logo-img" /><span>Web<span className="brand-accent">Service</span></span></a><div className={`nav-links ${menuOpen ? "is-open" : ""}`}>{[["Services", "services"], ["Portfolio", "portfolio"], ["Pricing", "pricing"], ["About", "about"], ["Feedback", "feedback"], ["Contact", "contact"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}<a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Get a Quote <ArrowRight size={15} /></a></div><button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></nav>
    <section className="hero" id="top"><div className="hero-grid" /><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> Independent digital studio</div><h1>You tell us.<br /><em>We build it.</em></h1><p>Modern, responsive and user-friendly websites built according to your requirements.</p><div className="hero-actions"><a className="button button-dark" href="#contact">Get a Quote <ArrowRight size={17} /></a><a className="text-link" href={portfolioUrl} target="_blank" rel="noreferrer">View Portfolio <ArrowRight size={16} /></a></div><div className="hero-proof"><span className="proof-avatars"><img src="/logo-icon.png" alt="W" className="hero-proof-logo" /><i>S</i><i>+</i></span><span>Thoughtful design.<br /><strong>Built for real people.</strong></span></div></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-card"><Sparkles size={18} /><span>Ideas into<br /><strong>interfaces</strong></span></div><div className="orbit-chip">01 / 06</div><div className="orbit-dot" /></div><div className="scroll-note"><span /> Scroll to explore</div></section>
    <section className="ticker"><div>WEBSITE DEVELOPMENT <span>✦</span> DIGITAL STRATEGY <span>✦</span> HUMAN-FIRST DESIGN <span>✦</span> WEBSITE DEVELOPMENT <span>✦</span> DIGITAL STRATEGY <span>✦</span></div></section>
    <section className="section services-section" id="services"><div className="section-heading"><div><SectionLabel>What I can build</SectionLabel><h2>Good websites do<br /><em>more than look good.</em></h2></div><p>Every project starts with a conversation. Together, we turn your goals into a digital experience that feels clear, useful, and unmistakably yours.</p></div><div className="services-grid">{services.map((service) => { const Icon = service.icon; return <article className={`service-card ${serviceOpen === service.name ? "active" : ""}`} key={service.name}><div className="service-top"><span>{service.number}</span><Icon size={24} strokeWidth={1.5} /></div><h3>{service.name}</h3><p>{service.text}</p><button className="service-action" onClick={() => setServiceOpen(serviceOpen === service.name ? null : service.name)}>View Details <ChevronDown size={15} className={serviceOpen === service.name ? "turn" : ""} /></button>{serviceOpen === service.name && <div className="service-detail">A focused, collaborative process from first sketch to final launch, shaped around your goals and audience.</div>}</article>; })}</div></section>
    <section className="portfolio-section" id="portfolio"><div className="portfolio-panel"><div className="portfolio-copy"><SectionLabel>One focused showcase</SectionLabel><h2>My<br /><em>Portfolio</em></h2><p>Explore my skills, projects, experience and work.</p><a className="button button-light" href={portfolioUrl} target="_blank" rel="noreferrer">View My Portfolio <ArrowRight size={17} /></a></div><div className="portfolio-preview"><div className="preview-window"><div className="preview-bar"><span /><span /><span /><b>loquacious-bienenstitch</b></div><div className="preview-body"><div className="preview-line" /><div className="preview-line short" /><div className="preview-block"><strong>Creative<br />direction.</strong><span>Thoughtful work<br />with a point of view.</span></div><div className="preview-foot">Explore the full portfolio <ArrowRight size={14} /></div></div></div><div className="preview-stamp">VIEW<br /><strong>WORK</strong></div></div></div></section>
    <section className="section why-section"><div className="why-intro"><SectionLabel>The WebService difference</SectionLabel><h2>A partner who<br /><em>gets the details.</em></h2></div><div className="why-list"><div><span>01</span><div><h3>Clarity before code</h3><p>We make the right decisions early, so your website stays focused and easy to use.</p></div></div><div><span>02</span><div><h3>Made for your audience</h3><p>No templates pretending to be strategy. Your site should sound and feel like your business.</p></div></div><div><span>03</span><div><h3>Ready for what is next</h3><p>Fast, accessible, and flexible foundations that can grow as your work does.</p></div></div></div></section>
    <section className="section pricing-section" id="pricing"><div className="section-heading"><div><SectionLabel>Simple starting points</SectionLabel><h2>Choose your<br /><em>next chapter.</em></h2></div><p>These are starting points, not rigid packages. Final pricing depends on your goals, content, functionality, and timeline.</p></div><div className="pricing-grid">{prices.map((price) => <article className={`price-card ${price.featured ? "featured" : ""}`} key={price.label}><div className="price-label">{price.label}{price.featured && <span>Most popular</span>}</div><h3>{price.title}</h3><p>{price.text}</p><ul>{price.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul><a href="#contact" className="price-link">{price.action} <ArrowRight size={15} /></a></article>)}</div></section>
    <section className="about-band" id="about"><div className="about-quote"><span className="quote-mark">“</span><h2>Your website is often the first conversation someone has with your business. Let’s make it a good one.</h2><p>WebService is an independent web development service built for people with something worth sharing.</p></div><div className="about-facts"><div><strong>01</strong><span>Personal attention<br />on every project</span></div><div><strong>02</strong><span>Design with<br />purpose</span></div><div><strong>03</strong><span>Built to be<br />remembered</span></div></div></section>
    <section className="section feedback-section" id="feedback"><div className="feedback-copy"><SectionLabel>Kind words welcome</SectionLabel><h2>Help the next<br /><em>client find me.</em></h2><p>Have we worked together? A few honest words help people know what it feels like to build with WebService.</p><FeedbackDisplay feedback={feedback} status={feedbackLoadState.status} message={feedbackLoadState.message} /></div><form className="feedback-form" onSubmit={submitFeedback}><div className="form-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Rating<select name="rating" defaultValue="5" required><option value="5">★★★★★ 5</option><option value="4">★★★★ 4</option><option value="3">★★★ 3</option><option value="2">★★ 2</option><option value="1">★ 1</option></select></label></div><label>Your feedback<textarea name="message" required placeholder="What was it like working together?" rows={4} /></label><button className="button button-dark" disabled={feedbackState.status === "loading"}>{feedbackState.status === "loading" ? "Sending..." : "Share feedback"} <Send size={16} /></button>{feedbackState.message && <p className={`form-message ${feedbackState.status}`}>{feedbackState.message}</p>}</form></section>
    <section className="contact-section" id="contact"><div className="contact-heading"><SectionLabel>Let’s make something useful</SectionLabel><h2>Have a project<br /><em>in mind?</em></h2><p>Tell me a little about it. I’ll get back to you with thoughtful next steps.</p><button className="whatsapp-button" onClick={openWhatsApp}><MessageCircle size={19} /> Chat on WhatsApp</button></div><form className="enquiry-form" onSubmit={submitEnquiry}><div className="form-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input type="email" name="email" required placeholder="you@company.com" /></label></div><div className="form-row"><label>Phone<input name="phone" required placeholder="Your phone number" /></label><label>Website type<select name="websiteType" defaultValue="" required><option value="" disabled>Choose a service</option>{services.map((service) => <option key={service.name}>{service.name}</option>)}</select></label></div><label>Budget<select name="budget" defaultValue="" required><option value="" disabled>Choose a range</option><option>₹5,000 – ₹20,000</option><option>₹25,000 – ₹50,000</option><option>₹50,000 – ₹1,00,000</option><option>Let’s discuss</option></select></label><label>Project requirements<textarea name="requirements" required placeholder="What are you hoping to build?" rows={5} /></label><button className="button button-light submit-button" disabled={enquiryState.status === "loading"}>{enquiryState.status === "loading" ? "Sending enquiry..." : "Send my enquiry"} <ArrowRight size={17} /></button>{enquiryState.message && <p className={`form-message ${enquiryState.status}`}>{enquiryState.message}</p>}</form></section>
    <footer><a href="#top" className="brand" aria-label="WebService Home"><img src="/logo-dark.png" alt="WebService" className="footer-logo-img" /></a><p>Your Ideas. Our Code.</p><div className="footer-links"><a href="#services">Services</a><a href="#portfolio">Portfolio</a><a href="#contact">Contact</a><a href="/admin">Admin</a></div><small>© {new Date().getFullYear()} WebService. Built with intention.</small></footer>
  </main>;
}
