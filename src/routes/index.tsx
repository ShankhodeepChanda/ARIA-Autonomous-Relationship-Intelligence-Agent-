import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARIA — Autonomous Relationship & Intelligence Agent | SBI" },
      { name: "description", content: "ARIA: Agentic AI banking dashboard for SBI Global Fintech Fest 2026." },
      { property: "og:title", content: "ARIA — SBI Agentic AI Dashboard" },
      { property: "og:description", content: "Autonomous Relationship & Intelligence Agent for SBI Bank." },
    ],
  }),
  component: AriaDashboard,
});

// ───────── Brand tokens ─────────
const C = {
  navy: "#1a237e",
  blue: "#1565c0",
  blueLight: "#e3ecf7",
  white: "#ffffff",
  success: "#2e7d32",
  warning: "#f57f17",
  danger: "#c62828",
  bg: "#f0f4f8",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
};

type AgentKey = "scout" | "profiler" | "engagement" | "onboarding";
type AgentStatus = "pending" | "active" | "done";
type LeadStatus = "Pending" | "Processing" | "Completed";

interface Lead {
  id: number;
  name: string;
  event: "NEW JOB" | "SALARY HIKE" | "MARRIAGE" | "NEW HOME";
  city: string;
  score: number;
  product: string;
  status: LeadStatus;
  agents: Record<AgentKey, AgentStatus>;
  data: {
    intent?: string;
    age?: string;
    income?: string;
    risk?: string;
    offer?: string;
    message?: string;
    accountNo?: string;
  };
}

const INITIAL_LEADS: Lead[] = [
  { id: 1, name: "Rohan S.", event: "NEW JOB", city: "Pune", score: 92, product: "Salary Account", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 2, name: "Priya M.", event: "SALARY HIKE", city: "Mumbai", score: 87, product: "SimplySAVE Credit Card", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 3, name: "Arjun K.", event: "NEW HOME", city: "Bangalore", score: 83, product: "Home Loan", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 4, name: "Sneha R.", event: "MARRIAGE", city: "Delhi", score: 79, product: "Joint Savings Account", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 5, name: "Vikram T.", event: "NEW JOB", city: "Hyderabad", score: 88, product: "Salary Account", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 6, name: "Ananya B.", event: "SALARY HIKE", city: "Chennai", score: 74, product: "Personal Loan", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 7, name: "Rahul G.", event: "NEW JOB", city: "Kolkata", score: 91, product: "Salary Account", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 8, name: "Meera P.", event: "NEW HOME", city: "Pune", score: 76, product: "Home Loan", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 9, name: "Karan S.", event: "MARRIAGE", city: "Mumbai", score: 82, product: "Joint Savings Account", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 10, name: "Divya N.", event: "SALARY HIKE", city: "Bangalore", score: 85, product: "SimplySAVE Credit Card", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 11, name: "Aditya R.", event: "NEW JOB", city: "Noida", score: 89, product: "Salary Account", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
  { id: 12, name: "Pooja V.", event: "NEW HOME", city: "Ahmedabad", score: 71, product: "Home Loan", status: "Pending", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} },
];

const EVENT_TAG_COLORS: Record<Lead["event"], { bg: string; fg: string }> = {
  "NEW JOB": { bg: "#e3f2fd", fg: "#0d47a1" },
  "SALARY HIKE": { bg: "#e8f5e9", fg: "#1b5e20" },
  "MARRIAGE": { bg: "#fce4ec", fg: "#880e4f" },
  "NEW HOME": { bg: "#fff3e0", fg: "#e65100" },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function scoreColor(s: number) {
  if (s <= 40) return C.danger;
  if (s <= 70) return C.warning;
  return C.success;
}

// ───────── Live analytics derived from leads state ─────────
function getIntentBreakdown(leads: Lead[]) {
  const counts: Record<Lead["event"], number> = { "NEW JOB": 0, "SALARY HIKE": 0, "NEW HOME": 0, "MARRIAGE": 0 };
  leads.forEach((l) => { counts[l.event]++; });
  const total = leads.length || 1;
  return (Object.keys(counts) as Lead["event"][])
    .map((name) => ({ name, pct: Math.round((counts[name] / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

function getProductBreakdown(leads: Lead[]) {
  const groups: Record<string, number> = {};
  leads.forEach((l) => { groups[l.product] = (groups[l.product] || 0) + 1; });
  const total = leads.length || 1;
  const colors = ["#1a237e", "#1565c0", "#42a5f5", "#90caf9", "#bbdefb"];
  return Object.entries(groups)
    .map(([name, count], i) => ({ name, value: Math.round((count / total) * 100), color: colors[i % colors.length] }))
    .sort((a, b) => b.value - a.value);
}

function getFunnelStats(leads: Lead[]) {
  const detected = leads.length;
  const profiled = leads.filter((l) => l.data.intent || l.status !== "Pending").length;
  const messaged = leads.filter((l) => l.data.message).length;
  const completed = leads.filter((l) => l.status === "Completed").length;
  const conversion = detected ? ((completed / detected) * 100).toFixed(1) : "0.0";
  return {
    rows: [
      ["Leads Detected", detected, 100],
      ["Profiles Built", profiled, detected ? Math.round((profiled / detected) * 100) : 0],
      ["Messages Sent", messaged, detected ? Math.round((messaged / detected) * 100) : 0],
      ["Accounts Opened", completed, detected ? Math.round((completed / detected) * 100) : 0],
    ] as [string, number, number][],
    conversion,
  };
}

function buildAgentData(lead: Lead) {
  const offers: Record<Lead["event"], string> = {
    "NEW JOB": "Zero-balance Salary Account + ₹2L pre-approved overdraft",
    "SALARY HIKE": "Upgrade to SBI Elite — 5x reward points for 90 days",
    "MARRIAGE": "Joint Savings + complimentary YONO Insurance cover",
    "NEW HOME": "Home Loan @ 8.40% p.a. + zero processing fee",
  };
  const messages: Record<Lead["event"], string> = {
    "NEW JOB": `Hi ${lead.name.split(" ")[0]}! 🎉 Congrats on the new role. SBI has a Zero-Balance Salary Account ready for you — open in 90 seconds with Aadhaar. Shall I start?`,
    "SALARY HIKE": `Hi ${lead.name.split(" ")[0]}! Your income growth qualifies you for SBI SimplySAVE Credit Card with 5x rewards. Approve in one tap?`,
    "MARRIAGE": `Hi ${lead.name.split(" ")[0]}! Best wishes 💐 Open a Joint SBI Savings Account in minutes — no branch visit needed.`,
    "NEW HOME": `Hi ${lead.name.split(" ")[0]}! 🏡 You're pre-approved for an SBI Home Loan @ 8.40% with zero processing fee. Get instant sanction letter?`,
  };
  const incomeByScore = lead.score > 85 ? "₹15L – ₹25L p.a." : lead.score > 75 ? "₹8L – ₹15L p.a." : "₹4L – ₹8L p.a.";
  const ageBracket = lead.event === "NEW JOB" ? "24–30" : lead.event === "MARRIAGE" ? "26–32" : lead.event === "NEW HOME" ? "30–40" : "28–38";
  return {
    intent: lead.event,
    age: ageBracket,
    income: incomeByScore,
    risk: lead.score > 85 ? "Low" : lead.score > 70 ? "Moderate" : "Elevated",
    offer: offers[lead.event],
    message: messages[lead.event],
    accountNo: "SBI" + Math.floor(1000000000 + Math.random() * 8999999999),
  };
}

function AriaDashboard() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [pipelineActive, setPipelineActive] = useState<AgentKey | null>(null);

  const selected = leads.find((l) => l.id === selectedId) ?? null;
  const intentData = getIntentBreakdown(leads);
  const productData = getProductBreakdown(leads);
  const funnelStats = getFunnelStats(leads);

  const updateLead = (id: number, patch: (l: Lead) => Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? patch(l) : l)));
  };

  async function runPipeline(id: number) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    setSelectedId(id);
    updateLead(id, (l) => ({ ...l, status: "Processing", agents: { scout: "pending", profiler: "pending", engagement: "pending", onboarding: "pending" }, data: {} }));
    let data;

    try {
      const [scout, profiler, engagement, onboarding] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/scout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        }).then((r) => r.json()),

        fetch("http://127.0.0.1:8000/api/profiler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        }).then((r) => r.json()),

        fetch("http://127.0.0.1:8000/api/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        }).then((r) => r.json()),

        fetch("http://127.0.0.1:8000/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        }).then((r) => r.json()),
      ]);

      data = {
        intent: scout.intent,
        age: scout.age,
        income: profiler.income,
        risk: profiler.risk,
        offer: profiler.offer,
        message: engagement.message,
        accountNo: onboarding.accountNo,
      };
    } catch (err) {
      console.error("Backend error:", err);

      // Fallback so the UI never crashes
      data = buildAgentData(lead);
    }
    const order: AgentKey[] = ["scout", "profiler", "engagement", "onboarding"];
    for (const key of order) {
      setPipelineActive(key);
      updateLead(id, (l) => ({ ...l, agents: { ...l.agents, [key]: "active" } }));
      await sleep(1000);
      updateLead(id, (l) => {
        const nextData = { ...l.data };
        if (key === "scout") { nextData.intent = data.intent; nextData.age = data.age; }
        if (key === "profiler") { nextData.income = data.income; nextData.risk = data.risk; nextData.offer = data.offer; }
        if (key === "engagement") { nextData.message = data.message; }
        if (key === "onboarding") { nextData.accountNo = data.accountNo; }
        return { ...l, agents: { ...l.agents, [key]: "done" }, data: nextData };
      });
    }
    setPipelineActive(null);
    updateLead(id, (l) => ({ ...l, status: "Completed" }));
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(46,125,50,.6);} 50%{ box-shadow:0 0 0 8px rgba(46,125,50,0);} }
        @keyframes pulseAmber { 0%,100%{ box-shadow:0 0 0 0 rgba(245,127,23,.6);} 50%{ box-shadow:0 0 0 10px rgba(245,127,23,0);} }
        @keyframes spin { to { transform: rotate(360deg);} }
        @keyframes glow { 0%,100%{ box-shadow:0 0 0 0 rgba(21,101,192,.4);} 50%{ box-shadow:0 0 24px 4px rgba(21,101,192,.5);} }
        .pulse-dot{animation:pulse 1.6s infinite;}
        .pulse-amber{animation:pulseAmber 1.4s infinite;}
        .glow-card{animation:glow 1.4s infinite;}
        .spin{animation:spin 1s linear infinite;}
        .row-hover:hover{background:#f5f9ff;cursor:pointer;}
        .btn-primary{background:${C.blue};color:#fff;border:none;border-radius:6px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer;transition:background .15s;}
        .btn-primary:hover{background:${C.navy};}
        .btn-small{padding:5px 10px;font-size:12px;}
        @media (max-width: 1024px){ .two-col{grid-template-columns:1fr !important;} .metrics-grid{grid-template-columns:repeat(2,1fr) !important;} .analytics-grid{grid-template-columns:1fr !important;} .pipeline-bar{flex-wrap:wrap;gap:12px !important;} .pipeline-arrow{display:none !important;} }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: C.white, borderBottom: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>SBI</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.1 }}>ARIA System</div>
              <div style={{ fontSize: 11, color: C.muted }}>Autonomous Relationship & Intelligence Agent</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Dashboard", "Lead Pipeline", "Analytics"].map((l, i) => (
              <a key={l} href="#" style={{ color: i === 0 ? C.navy : C.muted, fontWeight: i === 0 ? 700 : 500, fontSize: 14, textDecoration: "none", borderBottom: i === 0 ? `2px solid ${C.blue}` : "none", paddingBottom: 4 }}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#e8f5e9", padding: "6px 12px", borderRadius: 20 }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: C.success, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.success }}>System Active</span>
            </div>
            <span style={{ fontSize: 12, color: C.muted }}>Powered by Agentic AI</span>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        {/* HERO METRICS */}
        <section className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          <MetricCard icon="🔍" label="Leads Detected Today" value="142" accent={C.blue} />
          <MetricCard icon="✅" label="Accounts Opened" value="89" accent={C.success} />
          <MetricCard icon="⚡" label="Avg Onboarding Time" value="4m 32s" accent={C.warning} />
          <MetricCard icon="🤖" label="Human Agents Used" value="0" accent={C.navy} />
        </section>

        {/* AGENT PIPELINE STATUS */}
        <section style={{ background: C.white, borderTop: `3px solid ${C.blue}`, borderRadius: 10, padding: 20, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>Agent Pipeline Status</h3>
            <span style={{ fontSize: 12, color: C.muted }}>Real-time multi-agent orchestration</span>
          </div>
          <div className="pipeline-bar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {([
              { key: "scout", icon: "🔍", name: "Scout Agent" },
              { key: "profiler", icon: "🧠", name: "Profiler Agent" },
              { key: "engagement", icon: "💬", name: "Engagement Agent" },
              { key: "onboarding", icon: "🏦", name: "Onboarding Agent" },
            ] as { key: AgentKey; icon: string; name: string }[]).map((a, i, arr) => {
              const isActive = pipelineActive === a.key;
              return (
                <Fragment key={a.key}>
                  <PipelineAgentCard icon={a.icon} name={a.name} active={isActive} />
                  {i < arr.length - 1 && (
                    <div className="pipeline-arrow" style={{ flex: "0 0 auto", color: C.blue, fontSize: 22, fontWeight: 700 }}>→→</div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>

        {/* MAIN DASHBOARD */}
        <section className="two-col" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
          {/* LEFT: Lead Pipeline */}
          <div style={{ background: C.white, borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,.05)", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.navy }}>Live Lead Pipeline</h3>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{leads.length} active leads · auto-refreshed by Scout Agent</div>
              </div>
              <button className="btn-primary" onClick={() => selected && runPipeline(selected.id)}>▶ Run ARIA on Selected</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: C.muted, textAlign: "left" }}>
                    {["#", "Name", "Life Event", "City", "Priority Score", "Recommended Product", "Status", "Action"].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => {
                    const sel = l.id === selectedId;
                    const tag = EVENT_TAG_COLORS[l.event];
                    return (
                      <tr key={l.id} className="row-hover" onClick={() => setSelectedId(l.id)} style={{ background: sel ? C.blueLight : "transparent", borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "12px", color: C.muted }}>{l.id}</td>
                        <td style={{ padding: "12px", fontWeight: 600 }}>{l.name}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: tag.bg, color: tag.fg, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: ".3px" }}>{l.event}</span>
                        </td>
                        <td style={{ padding: "12px", color: C.muted }}>{l.city}</td>
                        <td style={{ padding: "12px", minWidth: 130 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: "#eef2f7", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${l.score}%`, height: "100%", background: scoreColor(l.score) }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(l.score), minWidth: 24 }}>{l.score}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{l.product}</td>
                        <td style={{ padding: "12px" }}><StatusChip status={l.status} /></td>
                        <td style={{ padding: "12px" }}>
                          <button className="btn-primary btn-small" onClick={(e) => { e.stopPropagation(); runPipeline(l.id); }}>▶ Run</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Agent Execution Panel */}
          <div style={{ background: C.white, borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,.05)", padding: 18, minHeight: 600 }}>
            {selected ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600 }}>Agent Execution</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginTop: 2 }}>{selected.name}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ background: EVENT_TAG_COLORS[selected.event].bg, color: EVENT_TAG_COLORS[selected.event].fg, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{selected.event}</span>
                      <span style={{ color: C.muted, fontSize: 12, marginLeft: 8 }}>{selected.city}</span>
                    </div>
                  </div>
                  <button className="btn-primary" disabled={selected.status === "Processing"} onClick={() => runPipeline(selected.id)} style={{ opacity: selected.status === "Processing" ? 0.6 : 1 }}>
                    ▶ Run Full Pipeline
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <AgentCard icon="🔍" title="Scout Agent" status={selected.agents.scout}>
                    <KV label="Intent" value={selected.data.intent} />
                    <KV label="City" value={selected.data.intent ? selected.city : undefined} />
                    <KV label="Age Bracket" value={selected.data.age} />
                    <KV label="Priority Score" value={selected.data.intent ? String(selected.score) : undefined} />
                  </AgentCard>
                  <AgentCard icon="🧠" title="Profiler Agent" status={selected.agents.profiler}>
                    <KV label="Income Bracket" value={selected.data.income} />
                    <KV label="Risk Level" value={selected.data.risk} />
                    <KV label="Recommended Product" value={selected.data.income ? selected.product : undefined} />
                    <KV label="Special Offer" value={selected.data.offer} />
                  </AgentCard>
                  <AgentCard icon="💬" title="Engagement Agent" status={selected.agents.engagement}>
                    {selected.data.message ? (
                      <div style={{ background: "#dcf8c6", color: "#0b3d0b", padding: "10px 12px", borderRadius: "12px 12px 12px 2px", fontSize: 13, lineHeight: 1.45, maxWidth: "95%", boxShadow: "0 1px 1px rgba(0,0,0,.08)" }}>
                        {selected.data.message}
                        <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 6, textAlign: "right" }}>via WhatsApp · delivered ✓✓</div>
                      </div>
                    ) : (
                      <div style={{ color: C.muted, fontSize: 12, fontStyle: "italic" }}>Awaiting profiler output…</div>
                    )}
                  </AgentCard>
                  <AgentCard icon="🏦" title="Onboarding Agent" status={selected.agents.onboarding}>
                    {selected.agents.onboarding === "pending" ? (
                      <div style={{ color: C.muted, fontSize: 12, fontStyle: "italic" }}>Awaiting customer consent…</div>
                    ) : (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                          {["Aadhaar", "OTP", "PAN", "Selfie"].map((s) => (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: selected.agents.onboarding === "done" ? C.success : C.muted }}>
                              <span style={{ width: 16, height: 16, borderRadius: "50%", background: selected.agents.onboarding === "done" ? C.success : "#cfd8dc", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>
                              {s}
                            </div>
                          ))}
                        </div>
                        {selected.data.accountNo && (
                          <div style={{ background: C.blueLight, padding: "10px 12px", borderRadius: 6, fontSize: 12 }}>
                            <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600 }}>Account Opened</div>
                            <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: C.navy, marginTop: 2 }}>{selected.data.accountNo}</div>
                          </div>
                        )}
                      </>
                    )}
                  </AgentCard>
                </div>
              </>
            ) : (
              <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Select a lead to run the agent pipeline.</div>
            )}
          </div>
        </section>

        {/* ANALYTICS */}
        <section className="analytics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
          <AnalyticsCard title="Top Intent Signal" subtitle={`${intentData[0]?.name ?? "—"} · ${intentData[0]?.pct ?? 0}% of leads`}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart layout="vertical" data={intentData} margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="pct" fill={C.blue} radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard title="Product Match Rate" subtitle="Distribution across SBI products">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={productData} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {productData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11, marginTop: -10 }}>
              {productData.map((p) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, background: p.color, borderRadius: 2 }} />{p.name} {p.value}%
                </div>
              ))}
            </div>
          </AnalyticsCard>

          <AnalyticsCard title="Acquisition Funnel" subtitle={`Conversion: ${funnelStats.conversion}%`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
              {funnelStats.rows.map(([label, val, pct]) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: C.text, fontWeight: 600 }}>{label}</span>
                    <span style={{ color: C.muted }}>{val}</span>
                  </div>
                  <div style={{ height: 10, background: "#eef2f7", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.navy}, ${C.blue})` }} />
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </section>
      </main>

      <footer style={{ background: C.navy, color: "#fff", padding: "24px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>ARIA © 2026 — Built for SBI Global Fintech Fest Hackathon</div>
        <div style={{ fontSize: 11, opacity: .75, marginTop: 4 }}>Powered by Agentic AI · LangGraph · Groq · Streamlit</div>
      </footer>
    </div>
  );
}

// ───────── Subcomponents ─────────

function MetricCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) {
  return (
    <div style={{ background: C.white, borderRadius: 10, padding: "16px 18px", borderLeft: `4px solid ${accent}`, boxShadow: "0 1px 3px rgba(0,0,0,.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.navy, marginTop: 4 }}>{value}</div>
      </div>
      <div style={{ fontSize: 28 }}>{icon}</div>
    </div>
  );
}

function PipelineAgentCard({ icon, name, active }: { icon: string; name: string; active: boolean }) {
  return (
    <div className={active ? "glow-card" : ""} style={{ flex: 1, minWidth: 170, background: active ? "#fff8e1" : "#f8fafc", border: `1px solid ${active ? C.warning : C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{name}</div>
        <div style={{ marginTop: 4 }}>
          {active ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff3e0", color: C.warning, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
              <span className="spin" style={{ width: 8, height: 8, border: `2px solid ${C.warning}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
              Processing
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e8f5e9", color: C.success, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, background: C.success, borderRadius: "50%", display: "inline-block" }} />
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: LeadStatus }) {
  const cfg = status === "Completed"
    ? { bg: "#e8f5e9", fg: C.success }
    : status === "Processing"
      ? { bg: "#fff3e0", fg: C.warning }
      : { bg: "#eceff1", fg: C.muted };
  return <span style={{ background: cfg.bg, color: cfg.fg, padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{status}</span>;
}

function AgentCard({ icon, title, status, children }: { icon: string; title: string; status: AgentStatus; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const statusCfg = status === "done"
    ? { label: "Done", bg: "#e8f5e9", fg: C.success }
    : status === "active"
      ? { label: "Active", bg: "#fff3e0", fg: C.warning }
      : { label: "Pending", bg: "#eceff1", fg: C.muted };
  const isActive = status === "active";
  return (
    <div className={isActive ? "pulse-amber" : ""} style={{ border: `1px solid ${isActive ? C.warning : C.border}`, borderRadius: 8, overflow: "hidden", background: status === "done" ? "#fafffb" : "#fff" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "transparent", border: "none", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderBottom: open ? `1px solid ${C.border}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontWeight: 700, color: C.navy, fontSize: 13 }}>{title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: statusCfg.bg, color: statusCfg.fg, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{statusCfg.label}</span>
          <span style={{ color: C.muted, fontSize: 12 }}>{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && <div style={{ padding: "12px" }}>{children}</div>}
    </div>
  );
}

function KV({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px dashed ${C.border}`, fontSize: 12 }}>
      <span style={{ color: C.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ color: value ? C.text : "#cbd5e1", fontWeight: value ? 600 : 400, textAlign: "right", maxWidth: "65%" }}>{value ?? "—"}</span>
    </div>
  );
}

function AnalyticsCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, borderRadius: 10, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
