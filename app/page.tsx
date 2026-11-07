"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

const sections = [
  { id: "research", label: "Research workspace", icon: "⌕" },
  { id: "innovation", label: "Innovation scout", icon: "✳" },
  { id: "projects", label: "Product projects", icon: "▤" },
  { id: "knowledge", label: "Knowledge library", icon: "◫" },
  { id: "reports", label: "Reports & prototypes", icon: "▧" }
] as const;

const sectionCopy: Record<string, { title: string; subtitle: string; prompts: string[] }> = {
  research: {
    title: "What are we researching?",
    subtitle: "Start with a product, a technical problem or a question. The researcher will connect evidence to practical P&H decisions.",
    prompts: ["Explore preservative-free shelf-life technologies for ketchup", "Research tomato fibre and texture functionality", "Compare lower-sugar ketchup formulation approaches"]
  },
  innovation: {
    title: "Discover what we haven't thought of yet",
    subtitle: "Scout unusual ingredients, emerging technologies, patents and cross-industry discoveries with a plausible path into food.",
    prompts: ["Find five unusual technologies that could improve everyday foods", "Explore NASA and aerospace food technologies for P&H", "Find emerging packaging ideas that control moisture migration"]
  },
  projects: {
    title: "Product projects",
    subtitle: "Each product will have its own brief, decisions, prototypes, experiments and technical history.",
    prompts: ["Start a new tomato ketchup development brief", "Review the current chips development requirements", "Create a product-development checklist"]
  },
  knowledge: {
    title: "Knowledge library",
    subtitle: "Google Drive will hold source files and generated documents. Supabase will index their contents so models can retrieve only what they need.",
    prompts: ["Find the FSSAI rules relevant to food additives", "Search uploaded research for shelf-life testing methods", "Show the current knowledge-base structure"]
  },
  reports: {
    title: "Reports & prototypes",
    subtitle: "Create evidence-backed research reports, formulation sheets, test plans and manufacturer-ready documents.",
    prompts: ["Prepare a prototype comparison report", "Draft a simple manufacturer quotation request", "Create a shelf-life validation plan"]
  }
};

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>("research");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const copy = useMemo(() => sectionCopy[activeSection] ?? sectionCopy.research, [activeSection]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: value },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Preview mode: this request has not been sent to an AI model or saved. The next build step connects Supabase, Google Drive and the GPT API so research can run against your private knowledge base."
      }
    ]);
    setDraft("");
  }

  function selectPrompt(prompt: string) {
    setDraft(prompt);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">P<span>&</span>H</div>
          <div>
            <div className="brand-name">PURE & HONEST</div>
            <div className="brand-caption">R&D WORKSPACE</div>
          </div>
        </div>

        <button className="new-research" onClick={() => { setMessages([]); setDraft(""); setActiveSection("research"); }}>
          <span>＋</span> New research
        </button>

        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Workspace">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? "active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="storage-card">
            <div className="storage-heading"><span className="drive-symbol">G</span> Google Drive</div>
            <div className="storage-status"><span className="status-dot pending" /> Not connected</div>
            <div className="storage-meter"><span /></div>
            <div className="storage-foot"><span>Planned R&D allocation</span><strong>3 GB</strong></div>
          </div>
          <div className="admin-profile">
            <div className="avatar">A</div>
            <div><strong>Workspace admin</strong><span>Single-admin setup</span></div>
            <span className="more">•••</span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb"><span>Pure & Honest</span><span className="crumb-divider">/</span><strong>{sections.find((item) => item.id === activeSection)?.label}</strong></div>
          <div className="topbar-right">
            <span className="preview-pill"><span className="status-dot pending" /> Setup preview</span>
            <button className="icon-button" aria-label="Settings" title="Settings">⚙</button>
          </div>
        </header>

        <div className="setup-notice">
          <span className="notice-icon">i</span>
          <span><strong>Setup in progress.</strong> AI, secure login and cloud storage are not connected yet. No prompts or files are being sent or saved.</span>
        </div>

        <div className="conversation">
          {messages.length === 0 ? (
            <div className="welcome-block">
              <div className="welcome-eyebrow"><span className="sparkle">✳</span> YOUR PRODUCT DEVELOPMENT PARTNER</div>
              <h1>{copy.title}</h1>
              <p className="welcome-subtitle">{copy.subtitle}</p>
              <div className="capability-row">
                <span><i>⌕</i> Evidence-led research</span>
                <span><i>✳</i> Cross-industry scouting</span>
                <span><i>◈</i> Practical prototypes</span>
              </div>
              <div className="prompt-grid">
                {copy.prompts.map((prompt) => (
                  <button className="prompt-card" key={prompt} onClick={() => selectPrompt(prompt)}>
                    <span>{prompt}</span><b>↗</b>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <div className={`message-row ${message.role}`} key={message.id}>
                  <div className={`message-avatar ${message.role}`}>{message.role === "user" ? "A" : "✳"}</div>
                  <div className="message-content">
                    <div className="message-author">{message.role === "user" ? "You" : "P&H Researcher"}</div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="composer-wrap">
          <form className="composer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Describe a product, problem or discovery you want to explore..."
              rows={2}
              aria-label="Research prompt"
            />
            <div className="composer-footer">
              <div className="composer-hints"><span>＋ Attachments (coming soon)</span><span>↵ Send · Shift + ↵ for new line</span></div>
              <button className="send-button" type="submit" disabled={!draft.trim()} aria-label="Send prompt">↑</button>
            </div>
          </form>
          <div className="composer-disclaimer">Research outputs will distinguish verified evidence, hypotheses and unvalidated ideas.</div>
        </div>
      </section>
    </main>
  );
}