import React, { useState } from "react";
import "./DispatchDesk.css";

type EventItem = { id: number; level: "critical" | "warning"; time: string; title: string; detail: string; service: string; acknowledged: boolean };
const initialEvents: EventItem[] = [
  { id: 1, level: "critical", time: "14:42:08", title: "Elevated latency in payments-api", detail: "p99 crossed 840ms across eu-west-1. Error budget burn accelerating.", service: "payments-api", acknowledged: false },
  { id: 2, level: "warning", time: "14:38:51", title: "Worker pool nearing capacity", detail: "Queue depth is 7,240 jobs; autoscaler has added two workers.", service: "jobs-worker", acknowledged: false },
  { id: 3, level: "warning", time: "14:21:17", title: "Replica lag above threshold", detail: "Read replica is 4.8 seconds behind primary in us-east-1.", service: "ledger-db", acknowledged: true },
];
const services = [
  { name: "gateway-edge", state: "operational", kind: "ok", note: "All 12 regions responding normally. Median edge latency 42ms." },
  { name: "payments-api", state: "degraded", kind: "down", note: "p99 latency is 840ms; on-call is investigating the eu-west-1 cluster." },
  { name: "jobs-worker", state: "watch", kind: "warn", note: "Queue depth rising, autoscaling active. Processing remains healthy." },
  { name: "ledger-db", state: "operational", kind: "ok", note: "Primary healthy. Replica lag has returned to within tolerance." },
  { name: "identity", state: "operational", kind: "ok", note: "Authentication and session refresh are operating normally." },
];
const tasks = [
  { n: "01", title: "Review payments-api latency", desc: "INC-2841 · Priya Nair", time: "6 min", kind: "P1 / ACTIVE" },
  { n: "02", title: "Check worker autoscale ceiling", desc: "INC-2839 · Marcus Lee", time: "12 min", kind: "P2 / WATCH" },
  { n: "03", title: "Validate replica recovery", desc: "INC-2832 · Resolved", time: "31 min", kind: "CLOSED" },
];

export default function DispatchDesk() {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState<"all" | "open" | "critical">("all");
  const [selected, setSelected] = useState("payments-api");
  const [toast, setToast] = useState("");
  const visibleEvents = events.filter(e => filter === "all" || (filter === "open" ? !e.acknowledged : e.level === "critical"));
  const openCount = events.filter(e => !e.acknowledged).length;
  const acknowledge = (id: number) => {
    setEvents(current => current.map(e => e.id === id ? { ...e, acknowledged: true } : e));
    setToast("Signal acknowledged · incident room updated");
    window.setTimeout(() => setToast(""), 2400);
  };
  const selectedService = services.find(s => s.name === selected) ?? services[0];

  return (
    <div className="dispatch-desk">
      <header className="dispatch-head">
        <div className="dispatch-brand">
          <div className="dispatch-mark">⌘</div>
          <div className="dispatch-wordmark">NORTHSTAR OPS<small>PLATFORM DISPATCH / 01</small></div>
        </div>
        <div className="dispatch-head-right">
          <span className="dispatch-build">BUILD 4821</span>
          <span>PRODUCTION</span>
          <span className="dispatch-live"><i /> ALL SYSTEMS REPORTING</span>
        </div>
      </header>

      <main className="dispatch-layout">
        <section className="dispatch-panel dispatch-rail">
          <div className="dispatch-panel-head">
            <div><div className="dispatch-kicker">Signal stream / live</div><h2 className="dispatch-title">Needs attention</h2></div>
            <span className="dispatch-count">{openCount} OPEN</span>
          </div>
          <div className="dispatch-filters" role="tablist" aria-label="Signal filters">
            {(["all", "open", "critical"] as const).map(option => (
              <button key={option} type="button" role="tab" aria-selected={filter === option} className={`dispatch-filter ${filter === option ? "active" : ""}`} onClick={() => setFilter(option)}>
                {option === "all" ? "All signals" : option === "open" ? "Unassigned" : "Critical"}
              </button>
            ))}
          </div>
          <div className="dispatch-feed">
            {visibleEvents.length === 0 ? <div style={{ padding: "24px 5px", color: "var(--muted)", fontSize: 11 }}>No signals in this view. The queue is clear.</div> : visibleEvents.map(event => (
              <article className="dispatch-event" key={event.id}>
                <div className="dispatch-event-top">
                  <span className="dispatch-severity" style={{ color: event.level === "critical" ? "#b94f35" : "#a8752f" }}><i style={{ background: event.level === "critical" ? "#d95736" : "#d69a45" }} />{event.acknowledged ? "ACKNOWLEDGED" : event.level}</span>
                  <time>{event.time}</time>
                </div>
                <h3>{event.title}</h3><p>{event.detail}</p>
                <div className="dispatch-event-foot"><span className="dispatch-tag">{event.service}</span>{!event.acknowledged && <button type="button" className="dispatch-action" onClick={() => acknowledge(event.id)}>ACKNOWLEDGE ↗</button>}</div>
              </article>
            ))}
          </div>
          <div className="dispatch-footer"><span>INGESTION HEALTH</span><span>99.98% · 28ms</span></div>
        </section>

        <section className="dispatch-center">
          <div className="dispatch-hero">
            <div className="dispatch-hero-top"><span className="dispatch-eyebrow">Operational focus · 14:45 UTC</span><span className="dispatch-range">LAST 60 MIN</span></div>
            <h1>One service needs a closer look.</h1>
            <div className="dispatch-hero-bottom">
              <div className="dispatch-hero-copy">Payments latency is trending above its normal band. The incident is contained to one region; the rest of the platform is steady.</div>
              <div className="dispatch-hero-stat"><strong>840</strong><span>ms p99</span></div>
            </div>
          </div>
          <div className="dispatch-section-head"><h2>Response queue</h2><span>3 ACTIVE THREADS</span></div>
          <div className="dispatch-queue">
            {tasks.map(task => <button className="dispatch-task" key={task.n} type="button" onClick={() => { setSelected(task.n === "02" ? "jobs-worker" : task.n === "03" ? "ledger-db" : "payments-api"); }}>
              <span className="dispatch-task-num">{task.n}</span><span><h3>{task.title}</h3><p>{task.desc}</p></span><span className="dispatch-task-meta"><b>{task.kind}</b><small>{task.time}</small></span>
            </button>)}
          </div>
          <div className="dispatch-activity">
            <div className="dispatch-activity-head"><strong>Latest interventions</strong><span>EVENT LOG · UTC</span></div>
            <div className="dispatch-log"><time>14:44:12</time><i className="alert" /><span>Autoscaler raised jobs-worker pool to 18</span></div>
            <div className="dispatch-log"><time>14:41:36</time><i /><span>Incident room opened by Priya Nair</span></div>
            <div className="dispatch-log"><time>14:37:09</time><i /><span>Deploy 4821 completed in eu-west-1</span></div>
          </div>
          <div className="dispatch-section-head" style={{ marginTop: "auto", paddingTop: 10 }}><h2>Change window</h2><span>DEPLOY 4821 · 14:31 UTC</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#e9ece2", borderRadius: 9, padding: "11px 13px", color: "#52624e" }}>
            <span style={{ font: "700 10px 'DM Mono', monospace" }}>✓</span><span style={{ fontSize: 9, lineHeight: 1.4 }}>Deploy passed all checks · 6 stages complete · no rollback signals detected</span>
          </div>
        </section>

        <section className="dispatch-panel dispatch-service">
          <div className="dispatch-panel-head"><div><div className="dispatch-kicker">Fleet / 5 services</div><h2 className="dispatch-title">Service register</h2></div><span className="dispatch-kicker">1 DEGRADED</span></div>
          <div className="dispatch-service-list">
            {services.map(service => <button type="button" key={service.name} onClick={() => setSelected(service.name)} className={`dispatch-service-row ${selected === service.name ? "selected" : ""}`}>
              <span className="dispatch-service-name"><i className={service.kind} />{service.name}</span><span className="dispatch-service-state">{service.state}</span>
            </button>)}
          </div>
          <div className="dispatch-detail"><label>Selected service / live summary</label><strong>{selectedService.name}</strong><p>{selectedService.note}</p></div>
          <div className="dispatch-footer"><span>LAST HEALTH CHECK</span><span>14:44:56 UTC</span></div>
        </section>
      </main>
      {toast && <div className="dispatch-toast" role="status">{toast}</div>}
    </div>
  );
}
