import { useState, type ReactNode } from "react";
import {
  Anvil, ArrowUpRight, Bell, ChevronRight, CreditCard, Eye, EyeOff,
  Flower2, Home, Landmark, Layers, PieChart, Plus, ScanLine, Sprout, User,
} from "lucide-react";

const accounts = [
  { name: "Everyday Purse", sub: "Current · ··4417", balance: "£2,847.20", change: "+£312 this week", accent: "#E8B85F", Icon: CreditCard },
  { name: "Workshop Reserve", sub: "Savings · 4.1% AER", balance: "£12,460.00", change: "+£42.18 interest", accent: "#9DBE85", Icon: Anvil },
  { name: "Wool & Linen Fund", sub: "Pot · auto-stitch on", balance: "£638.75", change: "Rounds up every sale", accent: "#D99AB8", Icon: Flower2 },
];
const jars = [
  { name: "New Floor Loom", saved: 1840, goal: 2400, accent: "#E8B85F" },
  { name: "Pottery Kiln", saved: 920, goal: 3200, accent: "#D99AB8" },
  { name: "Spring Market Stall", saved: 410, goal: 600, accent: "#9DBE85" },
  { name: "Linen Restock", saved: 265, goal: 450, accent: "#C9A0E8" },
];
const transactions = [
  { name: "Meadowsweet Yarns", note: "Merino DK · 12 skeins", amount: -86.4, when: "Today, 14:12", tint: "#D99AB8", Icon: Flower2 },
  { name: "Etsy Payout", note: "Weekly settlement", amount: 312.84, when: "Today, 09:00", tint: "#9DBE85", Icon: Landmark },
  { name: "Brambleberry Fabrics", note: "Linen bolt · oat & rust", amount: -124.15, when: "Yesterday", tint: "#E8B85F", Icon: Flower2 },
  { name: "The Copper Kettle Pottery", note: "Glazes & slip trailers", amount: -58.2, when: "Yesterday", tint: "#C9A0E8", Icon: Anvil },
];
const stories = [
  ["A Century of Thread", "Why we still keep ledgers by hand — and by heart.", "OUR STORY"],
  ["Harvest Bond · 4.6% AER", "Lock your autumn earnings until the spring fairs.", "TREASURY OFFER"],
  ["The Hands Behind the Hearth", "Meet the dyers of Hartfield Vale, paid same-day.", "MAKER LEDGER"],
];

function Blossom({ className = "h-6 w-6", color = "#E8B85F" }: { className?: string; color?: string }) {
  return <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
    {[0, 60, 120, 180, 240, 300].map((angle) => <ellipse key={angle} cx="30" cy="17" rx="7" ry="13" fill={color} opacity=".8" transform={`rotate(${angle} 30 30)`} />)}
    <circle cx="30" cy="30" r="6" fill="#1C1810" /><circle cx="30" cy="30" r="3.5" fill={color} />
  </svg>;
}

function Section({ title, action, children }: { title: string; action: string; children: ReactNode }) {
  return <section className="mt-9">
    <div className="mb-4 flex items-center justify-between px-6">
      <h3 className="font-serif-d text-[19px] text-[#F2EAD8]">{title}</h3>
      <button type="button" className="inline-flex items-center gap-1 text-[11px] tracking-wide text-[#E8B85F] transition-colors hover:text-[#f4cb7c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4cb7c]">{action}<ChevronRight size={12} aria-hidden="true" /></button>
    </div>{children}
  </section>;
}

export default function HearthstoneTactileAccounts() {
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("home");
  const [notice, setNotice] = useState("");
  const shownTransactions = transactions.filter((item) => filter === "All" || (filter === "In" ? item.amount > 0 : item.amount < 0));
  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };
  const actions = [
    { label: "Send", Icon: ArrowUpRight },
    { label: "Top up", Icon: Plus },
    { label: "Pay", Icon: ScanLine },
    { label: "Cards", Icon: CreditCard },
  ];

  return <main className="min-h-[100dvh] w-full overflow-hidden bg-[#131009] px-4 py-6 text-[#F2EAD8] sm:py-10">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>{`
      .font-serif-d{font-family:'Fraunces',serif}.font-sans-d{font-family:'Hanken Grotesk',sans-serif}
      .no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      .stitch{background-image:radial-gradient(circle at 1px 1px,rgba(242,234,216,.1) 1px,transparent 1.4px);background-size:14px 14px}
      .app-scroll{scrollbar-width:thin;scrollbar-color:#2c261a transparent}
      .account-card{background:linear-gradient(148deg,rgba(255,255,255,.075) 0%,rgba(232,184,95,.035) 22%,rgba(33,27,17,.98) 72%),#211b11;box-shadow:inset 0 1px 0 rgba(255,246,219,.18),inset 0 -1px 0 rgba(0,0,0,.54),0 8px 17px rgba(0,0,0,.42),0 2px 5px rgba(0,0,0,.28);border-color:#625238}
      .account-card:hover{box-shadow:inset 0 1px 0 rgba(255,246,219,.23),inset 0 -1px 0 rgba(0,0,0,.56),0 9px 19px rgba(0,0,0,.45),0 2px 5px rgba(0,0,0,.3)}
      .tactile-focus:focus-visible{outline:2px solid #f4cb7c;outline-offset:3px}
      @media(max-width:767px){.layout-grid{grid-template-columns:minmax(0,1fr)!important}.phone-shell{width:min(392px,100%);height:min(812px,calc(100dvh - 32px));min-height:720px}}
      @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition-duration:.01ms!important}}
    `}</style>
    <div className="layout-grid mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1fr_auto]">
      <aside className="hidden font-sans-d lg:block">
        <div className="mb-10 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8B85F]/50"><Blossom /></div><div><p className="font-serif-d text-lg tracking-wide">Hearthstone Treasury</p><p className="text-[11px] tracking-[.28em] text-[#b3a47f]">FOR MAKERS · EST. 1894</p></div></div>
        <h1 className="max-w-xl font-serif-d text-[56px] font-medium leading-[1.04]">Money, kept like a<br />well-tended <span className="italic font-light text-[#E8B85F]">garden.</span></h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#c3b797]">The banking home of Hartfield Makers — every skein, kiln firing and market stall accounted for with the calm authority of a hundred-year ledger.</p>
        <div className="mt-10 grid max-w-md grid-cols-3 gap-px border border-[#403722] bg-[#403722]">{[["4.6%", "Harvest Bond AER"], ["12,400", "Maker accounts"], ["Same-day", "Craft supplier pay"]].map(([value, label]) => <div key={label} className="bg-[#17140c] px-4 py-5"><p className="font-serif-d text-xl text-[#E8B85F]">{value}</p><p className="mt-1 text-[11px] tracking-wide text-[#b3a47f]">{label}</p></div>)}</div>
      </aside>
      <div className="phone-shell relative mx-auto h-[812px] w-[392px] overflow-hidden rounded-[44px] border border-[#3a3120] bg-[#1A1610] shadow-[0_40px_120px_-30px_rgba(0,0,0,.9),0_0_0_1px_rgba(232,184,95,.06)] font-sans-d">
        <div className="app-scroll absolute inset-0 overflow-y-auto pb-28">
          <div className="relative overflow-hidden pb-9">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#E8B85F] opacity-[.12] blur-[48px]" />
            <div className="stitch absolute inset-0 opacity-60" />
            <div className="relative flex items-center justify-between px-6 pt-7">
              <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8B85F]/60 bg-[#1A1610]/60"><Blossom className="h-5 w-5" /></div><div><p className="font-serif-d text-[15px] leading-none">Hearthstone</p><p className="mt-1 text-[9px] tracking-[.3em] text-[#b3a47f]">TREASURY · EST. 1894</p></div></div>
              <div className="flex items-center gap-2"><button type="button" aria-label="Notifications" onClick={() => announce("You're all caught up")} className="tactile-focus flex h-9 w-9 items-center justify-center rounded-full border border-[#3a3120] bg-[#241e13] transition-colors hover:border-[#E8B85F]/60"><Bell size={15} className="text-[#e1d4b5]" /></button><div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8B85F]/50 bg-[#665238] font-serif-d text-sm text-[#fff1d0]" aria-label="Margaret Ashworth profile">MA</div></div>
            </div>
            <div className="relative mt-9 px-6">
              <p className="text-[11px] tracking-[.26em] text-[#b3a47f]">GUILD HOLDINGS · MARGARET ASHWORTH</p>
              <div className="mt-3 flex items-end gap-3"><h2 className="font-serif-d text-[46px] font-medium leading-none tabular-nums text-[#F6EFD9]">{hidden ? "£ ••,•••" : <>£15,946<span className="text-[26px] text-[#d8cba8]">.95</span></>}</h2><button type="button" aria-label={hidden ? "Show balance" : "Hide balance"} onClick={() => setHidden(!hidden)} className="tactile-focus mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3120] bg-[#241e13] transition-colors hover:border-[#E8B85F]/60">{hidden ? <EyeOff size={14} className="text-[#e1d4b5]" /> : <Eye size={14} className="text-[#e1d4b5]" />}</button></div>
              <div className="mt-3 flex items-center gap-2"><span className="inline-flex items-center gap-1 rounded-full border border-[#9DBE85]/40 bg-[#9DBE85]/10 px-2.5 py-1 text-[12px] text-[#b9d69f]"><ArrowUpRight size={12} aria-hidden="true" />+£487.30 this week</span><span className="text-[12px] text-[#b3a47f]">Spring fair season</span></div>
            </div>
            <div className="relative mt-8 grid grid-cols-4 gap-2.5 px-6">
              {actions.map(({ label, Icon }, index) => <button key={label} type="button" aria-label={label} onClick={() => announce(`${label} is ready`)} className={`tactile-focus group flex flex-col items-center gap-2 rounded-2xl border py-3.5 transition-all duration-150 ${index === 0 ? "send-cta border-[#E8B85F] bg-[#E8B85F] text-[#21190b] hover:bg-[#d6a347] hover:shadow-[inset_0_2px_2px_rgba(62,39,5,.55)] active:translate-y-px active:shadow-[inset_0_2px_2px_rgba(62,39,5,.55)]" : "border-[#3a3120] bg-[#241e13] text-[#eee3c9] hover:-translate-y-0.5 hover:border-[#E8B85F]/50"}`}><Icon size={17} strokeWidth={2.2} aria-hidden="true" /><span className="text-[11px] font-medium tracking-wide">{label}</span></button>)}
            </div>
          </div>
          <Section title="Your accounts" action="Manage">
            <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
              {accounts.map(({ name, sub, balance, change, accent, Icon }) => <button type="button" key={name} onClick={() => announce(`${name} account selected`)} className="account-card tactile-focus relative w-[238px] shrink-0 snap-start overflow-hidden rounded-[22px] border p-5 pb-[28px] text-left transition-all duration-200">
                <div className="stitch absolute inset-0 opacity-40" /><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[.22] blur-2xl" style={{ background: accent }} />
                <div className="relative">
                  <div className="flex items-center justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: `${accent}88`, color: accent, background: `${accent}18` }}><Icon size={16} aria-hidden="true" /></div><ChevronRight size={15} className="text-[#a49571]" aria-hidden="true" /></div>
                  <p className="mt-5 text-[13px] font-medium text-[#f1e7ce]">{name}</p><p className="mt-0.5 text-[11px] text-[#b9ad91]">{sub}</p>
                  <p className="mt-3 font-serif-d text-[24px] font-semibold tabular-nums" style={{ color: name === "Workshop Reserve" ? "#b9d69f" : name === "Everyday Purse" ? "#f3ca77" : "#efb1ca" }}>{hidden ? "£ •••••" : balance}</p>
                  <p className="mt-1 text-[11px] font-medium text-[#c8bd9f]">{change}</p>
                </div>
              </button>)}
              <button type="button" onClick={() => announce("New pot setup opened")} className="tactile-focus flex w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-[22px] border border-dashed border-[#685a3b] text-[#b9ad91] transition-colors hover:border-[#E8B85F]/70 hover:text-[#E8B85F]"><Plus size={18} aria-hidden="true" /><span className="text-[11px]">New pot</span></button>
            </div>
          </Section>
          <Section title="Pantry jars" action="All jars">
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-6 pb-1">{jars.map((jar) => { const pct = Math.round(jar.saved / jar.goal * 100); return <div key={jar.name} className="w-[158px] shrink-0 rounded-[20px] border border-[#3a3120] bg-[#211b11] p-4"><div className="flex items-center justify-between"><Sprout size={15} style={{ color: jar.accent }} /><span className="text-[11px] tabular-nums" style={{ color: jar.accent }}>{pct}%</span></div><p className="mt-3 text-[13px] font-medium leading-snug text-[#e7dcbe]">{jar.name}</p><p className="mt-1 text-[11px] tabular-nums text-[#b9ad91]">£{jar.saved.toLocaleString()} of £{jar.goal.toLocaleString()}</p><div className="mt-3 h-[5px] overflow-hidden rounded-full bg-[#171208]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: jar.accent }} /></div></div>; })}</div>
          </Section>
          <section className="mt-9 px-6"><div className="mb-4 flex items-center justify-between"><h3 className="font-serif-d text-[19px] text-[#F2EAD8]">The day-book</h3><div className="flex gap-1 rounded-full border border-[#3a3120] bg-[#211b11] p-1">{["All", "In", "Out"].map((item) => <button type="button" key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={`tactile-focus rounded-full px-3 py-1 text-[11px] transition-colors ${filter === item ? "bg-[#E8B85F] font-semibold text-[#1A1610]" : "text-[#b9ad91] hover:text-[#e7dcbe]"}`}>{item}</button>)}</div></div>
            <div className="overflow-hidden rounded-[22px] border border-[#3a3120] bg-[#1d1810]">{shownTransactions.map((item) => <div key={item.name} className="flex items-center gap-3.5 border-b border-[#2c261a] px-4 py-3.5 last:border-0"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: `${item.tint}88`, background: `${item.tint}18`, color: item.tint }}><item.Icon size={16} aria-hidden="true" /></div><div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-medium text-[#ece1c4]">{item.name}</p><p className="truncate text-[11px] text-[#b9ad91]">{item.note} · {item.when}</p></div><p className={`text-[13.5px] font-semibold tabular-nums ${item.amount > 0 ? "text-[#b9d69f]" : "text-[#eee3c9]"}`}>{item.amount > 0 ? "+" : "−"}£{Math.abs(item.amount).toFixed(2)}</p></div>)}</div>
          </section>
          <Section title="From the Guild" action="Read all"><div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-6 pb-2">{stories.map(([title, sub, tag], index) => <article key={title} className="w-[252px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-[#3a3120] bg-[#211b11]"><div className={`relative h-[120px] overflow-hidden ${index === 0 ? "bg-[radial-gradient(ellipse_at_70%_20%,#d99ab8_0%,transparent_30%),linear-gradient(135deg,#483337,#201b12)]" : index === 1 ? "bg-[radial-gradient(ellipse_at_35%_35%,#e8b85f_0%,transparent_30%),linear-gradient(135deg,#493b20,#201b12)]" : "bg-[radial-gradient(ellipse_at_70%_30%,#9dbe85_0%,transparent_30%),linear-gradient(135deg,#344132,#201b12)]"}`}><span className="absolute left-3 top-3 rounded-full border border-[#E8B85F]/40 bg-[#1A1610]/85 px-2.5 py-1 text-[9px] tracking-[.22em] text-[#E8B85F]">{tag}</span><div className="stitch absolute inset-0 opacity-30" /></div><div className="p-4"><p className="font-serif-d text-[16px] leading-snug text-[#F2EAD8]">{title}</p><p className="mt-1.5 text-[11.5px] leading-relaxed text-[#b9ad91]">{sub}</p><span className="mt-3 inline-flex items-center gap-1 text-[11px] text-[#E8B85F]">Continue <ChevronRight size={12} aria-hidden="true" /></span></div></article>)}</div></Section>
          <div className="mb-4 mt-10 flex flex-col items-center gap-2 opacity-70"><Blossom className="h-6 w-6" color="#b3a47f" /><p className="text-[9px] tracking-[.32em] text-[#b3a47f]">KEPT IN GOOD ORDER SINCE 1894</p></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#15110a] via-[#15110a]/95 to-transparent px-5 pb-5 pt-3"><nav aria-label="Main navigation" className="flex items-center justify-between rounded-[22px] border border-[#3a3120] bg-[#211b11]/95 px-3 py-2.5 backdrop-blur-md">{[{ id: "home", Icon: Home, label: "Hearth" }, { id: "jars", Icon: Layers, label: "Jars" }, { id: "pay", Icon: ScanLine, label: "Pay", center: true }, { id: "insights", Icon: PieChart, label: "Almanac" }, { id: "profile", Icon: User, label: "You" }].map(({ id, Icon, label, center }) => center ? <button type="button" key={id} aria-label="Pay" onClick={() => { setTab(id); announce("Payment scanner ready"); }} className="tactile-focus -mt-7 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#15110a] bg-[#E8B85F] text-[#1A1610] shadow-[0_8px_24px_-6px_rgba(232,184,95,.45)] hover:bg-[#d6a347]"><Icon size={19} strokeWidth={2.4} aria-hidden="true" /></button> : <button type="button" key={id} aria-label={label} onClick={() => { setTab(id); announce(`${label} section selected`); }} className={`tactile-focus flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-colors ${tab === id ? "text-[#E8B85F]" : "text-[#b3a47f] hover:text-[#e4d6b6]"}`}><Icon size={18} strokeWidth={tab === id ? 2.4 : 2} aria-hidden="true" /><span className="text-[9.5px] tracking-wide">{label}</span></button>)}</nav></div>
        {notice && <div role="status" aria-live="polite" className="absolute bottom-[92px] left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#74613a] bg-[#302719] px-4 py-2 text-xs text-[#f3e5c4] shadow-lg">{notice}</div>}
      </div>
    </div>
  </main>;
}
