import { useState } from 'react';
import { Crown, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts';

const INK = '#16130F';
const PAPER = '#F1EBDD';
const GOLD = '#9A7B2D';
const OX = '#6E1F1C';

const FY = {
  '2025': {
    issue: 'N° 0427 / 1000',
    valuation: [
      { m: 'JAN', v: 41.2 }, { m: 'FEB', v: 43.8 }, { m: 'MAR', v: 42.6 },
      { m: 'APR', v: 47.1 }, { m: 'MAY', v: 51.4 }, { m: 'JUN', v: 50.2 },
      { m: 'JUL', v: 55.9 }, { m: 'AUG', v: 58.3 }, { m: 'SEP', v: 61.7 },
      { m: 'OCT', v: 64.0 }, { m: 'NOV', v: 67.8 }, { m: 'DEC', v: 71.4 },
    ],
    quarters: [
      { q: 'Q1', n: 6 }, { q: 'Q2', n: 9 }, { q: 'Q3', n: 11 }, { q: 'Q4', n: 8 },
    ],
    metrics: [
      { label: 'PAIRS UNDER REGISTRY', value: '34', sub: '+8 acquired this term' },
      { label: 'PORTFOLIO VALUATION', value: '$71,400', sub: '+34.6% year over year' },
      { label: 'RARITY INDEX', value: '94.2', sub: 'Top 0.4% of all holders' },
      { label: 'DROPS ATTENDED', value: '21 / 23', sub: '91.3% appearance rate' },
      { label: 'DEADSTOCK RATIO', value: '0.76', sub: '26 of 34 pairs unworn' },
      { label: 'TENURE', value: '9 YRS', sub: 'Charter class of 2016' },
    ],
    holdings: [
      { name: 'IMPERATOR I — "Coronation"', ed: '88 / 300', size: 'US 10.5', paid: '$1,450', index: '$6,120', delta: '+322%', up: true },
      { name: 'CONSUL LOW — Oxblood Suede', ed: '412 / 1500', size: 'US 10.5', paid: '$640', index: '$2,880', delta: '+350%', up: true },
      { name: 'REGENT RUNNER — Bone / Gilt', ed: '073 / 500', size: 'US 11', paid: '$890', index: '$3,410', delta: '+283%', up: true },
      { name: 'EDICT MID × ATELIER NOIR', ed: '019 / 150', size: 'US 10.5', paid: '$2,100', index: '$9,750', delta: '+364%', up: true },
      { name: 'TRIBUNE 98 — Archive Reissue', ed: '655 / 2000', size: 'US 10.5', paid: '$420', index: '$385', delta: '−8.3%', up: false },
      { name: 'SCEPTRE TRAINER — Ivory Wax', ed: '104 / 800', size: 'US 11', paid: '$760', index: '$1,940', delta: '+155%', up: true },
      { name: 'IMPERATOR II — "Succession"', ed: '230 / 600', size: 'US 10.5', paid: '$1,300', index: '$4,070', delta: '+213%', up: true },
    ],
    standing: 'SOVEREIGN — FIRST ORDER',
  },
  '2024': {
    issue: 'N° 0427 / 1000',
    valuation: [
      { m: 'JAN', v: 28.4 }, { m: 'FEB', v: 29.0 }, { m: 'MAR', v: 31.2 },
      { m: 'APR', v: 30.8 }, { m: 'MAY', v: 33.5 }, { m: 'JUN', v: 35.0 },
      { m: 'JUL', v: 34.2 }, { m: 'AUG', v: 36.9 }, { m: 'SEP', v: 38.4 },
      { m: 'OCT', v: 39.1 }, { m: 'NOV', v: 40.3 }, { m: 'DEC', v: 41.2 },
    ],
    quarters: [
      { q: 'Q1', n: 4 }, { q: 'Q2', n: 7 }, { q: 'Q3', n: 5 }, { q: 'Q4', n: 6 },
    ],
    metrics: [
      { label: 'PAIRS UNDER REGISTRY', value: '26', sub: '+6 acquired this term' },
      { label: 'PORTFOLIO VALUATION', value: '$41,200', sub: '+22.1% year over year' },
      { label: 'RARITY INDEX', value: '88.7', sub: 'Top 1.1% of all holders' },
      { label: 'DROPS ATTENDED', value: '17 / 20', sub: '85.0% appearance rate' },
      { label: 'DEADSTOCK RATIO', value: '0.69', sub: '18 of 26 pairs unworn' },
      { label: 'TENURE', value: '8 YRS', sub: 'Charter class of 2016' },
    ],
    holdings: [
      { name: 'IMPERATOR I — "Coronation"', ed: '88 / 300', size: 'US 10.5', paid: '$1,450', index: '$4,310', delta: '+197%', up: true },
      { name: 'CONSUL LOW — Oxblood Suede', ed: '412 / 1500', size: 'US 10.5', paid: '$640', index: '$1,720', delta: '+169%', up: true },
      { name: 'REGENT RUNNER — Bone / Gilt', ed: '073 / 500', size: 'US 11', paid: '$890', index: '$2,260', delta: '+154%', up: true },
      { name: 'EDICT MID × ATELIER NOIR', ed: '019 / 150', size: 'US 10.5', paid: '$2,100', index: '$6,400', delta: '+205%', up: true },
      { name: 'TRIBUNE 98 — Archive Reissue', ed: '655 / 2000', size: 'US 10.5', paid: '$420', index: '$455', delta: '+8.3%', up: true },
      { name: 'SCEPTRE TRAINER — Ivory Wax', ed: '104 / 800', size: 'US 11', paid: '$760', index: '$1,180', delta: '+55%', up: true },
      { name: 'IMPERATOR II — "Succession"', ed: '230 / 600', size: 'US 10.5', paid: '$1,300', index: '$2,540', delta: '+95%', up: false },
    ],
    standing: 'SOVEREIGN — SECOND ORDER',
  },
};

const Hairline = ({ className = '' }) => <div className={`bg-[#16130F]/80 ${className}`} style={{ height: 1 }} />;

function Seal() {
  return (
    <div className="relative w-[118px] h-[118px] seal-spin">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <defs>
          <path id="sealCircle" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="none" stroke={OX} strokeWidth="1.4" />
        <circle cx="60" cy="60" r="34" fill="none" stroke={OX} strokeWidth="1" />
        <circle cx="60" cy="60" r="31" fill="none" stroke={OX} strokeWidth="0.5" />
        <text fill={OX} fontSize="9.2" letterSpacing="2.6" fontFamily="'Archivo', sans-serif" fontWeight="600">
          <textPath href="#sealCircle">MONARCH SUPPLY CO. · EST. 1998 · BY APPOINTMENT ·</textPath>
        </text>
        <g transform="translate(60,60)">
          <path d="M -14,8 L -14,-4 L -7,2 L 0,-10 L 7,2 L 14,-4 L 14,8 Z" fill={OX} />
          <rect x="-14" y="10" width="28" height="3" fill={OX} />
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  const [year, setYear] = useState('2025');
  const d = FY[year];

  return (
    <div className="min-h-screen w-full bg-[#100E0B] py-10 px-4 flex justify-center" style={{ fontFamily: "'Archivo', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Archivo:wght@400;500;600;700&family=Archivo+Expanded:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        .paper {
          background-color: ${PAPER};
          background-image:
            radial-gradient(ellipse at 20% 0%, rgba(154,123,45,0.07), transparent 55%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .serif-it { font-family: 'Cormorant Garamond', serif; font-style: italic; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .exp { font-family: 'Archivo Expanded', 'Archivo', sans-serif; }
        .seal-spin { animation: spin 40s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .row-h:hover { background: rgba(110,31,28,0.06); }
        .bc { display:flex; align-items:flex-end; gap:2px; height:34px; }
        .bc span { display:block; background:${INK}; }
      ` }} />

      <div className="paper w-full max-w-[1180px] text-[#16130F] shadow-[0_40px_120px_rgba(0,0,0,0.7)] border border-[#16130F]">
        {/* ===== TOP REGISTRAR BAR ===== */}
        <div className="flex items-stretch border-b border-[#16130F]">
          <div className="flex items-center gap-2 px-4 py-2 border-r border-[#16130F]">
            <Crown size={14} strokeWidth={2.2} className="text-[#6E1F1C]" />
            <span className="exp text-[11px] font-bold tracking-[0.28em]">MONARCH SUPPLY CO.</span>
          </div>
          <div className="hidden md:flex items-center px-4 py-2 border-r border-[#16130F] mono text-[10px] tracking-[0.18em] text-[#16130F]/70">
            OFFICE OF THE REGISTRAR · DEPT. OF HOLDINGS
          </div>
          <div className="flex-1" />
          <div className="flex items-center border-l border-[#16130F]">
            {['2024', '2025'].map((y) => (
              <button key={y} onClick={() => setYear(y)}
                className={`mono text-[11px] tracking-[0.15em] px-4 py-2 transition-colors ${year === y ? 'bg-[#16130F] text-[#F1EBDD]' : 'hover:bg-[#16130F]/10'}`}>
                FY {y}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center px-4 py-2 border-l border-[#16130F] mono text-[10px] tracking-[0.15em]">
            ISSUE {d.issue}
          </div>
        </div>

        {/* ===== MASTHEAD ===== */}
        <div className="grid grid-cols-12 border-b border-[#16130F]">
          <div className="col-span-12 lg:col-span-9 px-5 py-5 lg:border-r border-[#16130F]">
            <div className="mono text-[10px] tracking-[0.34em] text-[#6E1F1C] mb-2">ANNUAL HOLDER REPORT · CONFIDENTIAL · FISCAL YEAR {year}</div>
            <h1 className="exp font-bold leading-[0.92] tracking-[-0.01em]" style={{ fontSize: 'clamp(34px, 5.4vw, 72px)' }}>
              CERTIFICATE OF<br />SOVEREIGN STANDING
            </h1>
            <p className="serif-it text-[19px] md:text-[22px] mt-3 max-w-[640px] text-[#16130F]/85 leading-snug">
              “Issued under the seal of the House to certify rank, registry, and the full weight of holdings — let none dispute what is recorded here.”
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3 grid grid-rows-[auto_1fr]">
            <div className="px-5 py-3 border-b border-t lg:border-t-0 border-[#16130F]">
              <div className="mono text-[9px] tracking-[0.26em] text-[#16130F]/60 mb-1">CONFERRED UPON</div>
              <div className="exp text-[22px] font-bold leading-tight">DARIUS<br />OKONKWO-VANCE</div>
              <div className="mono text-[10px] tracking-[0.12em] mt-1.5 text-[#16130F]/70">HOLDER ID MS-1998-0427 · LAGOS / LONDON</div>
            </div>
            <div className="px-5 py-3 flex flex-col justify-between bg-[#16130F] text-[#F1EBDD]">
              <div className="mono text-[9px] tracking-[0.26em] text-[#F1EBDD]/60">STANDING CONFERRED</div>
              <div>
                <div className="exp text-[17px] font-bold leading-tight" style={{ color: '#C9A24B' }}>{d.standing}</div>
                <div className="mono text-[10px] tracking-[0.12em] mt-1 text-[#F1EBDD]/60">RATIFIED 31 DEC {year} · COUNCIL VOTE 7–0</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== METRIC STRIP ===== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-[#16130F]">
          {d.metrics.map((m, i) => (
            <div key={m.label} className={`px-4 py-3 ${i !== d.metrics.length - 1 ? 'border-r' : ''} border-[#16130F] ${i >= 2 ? 'border-t md:border-t-0' : ''} ${i >= 3 ? 'md:border-t lg:border-t-0' : ''}`}>
              <div className="mono text-[9px] tracking-[0.2em] text-[#16130F]/60">{m.label}</div>
              <div className="exp text-[26px] font-bold leading-none mt-1.5">{m.value}</div>
              <div className="text-[10.5px] mt-1 text-[#6E1F1C] font-medium">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ===== CHARTS + PULL QUOTE ===== */}
        <div className="grid grid-cols-12 border-b border-[#16130F]">
          {/* Valuation chart */}
          <div className="col-span-12 lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#16130F]">
            <div className="flex items-baseline justify-between px-4 pt-3">
              <div className="mono text-[9px] tracking-[0.22em] text-[#16130F]/60">FIG. 01 — PORTFOLIO VALUATION ($K)</div>
              <div className="mono text-[10px] font-semibold text-[#6E1F1C]">{d.valuation[11].v}K DEC</div>
            </div>
            <div className="h-[150px] px-2 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.valuation} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={OX} stopOpacity={0.32} />
                      <stop offset="100%" stopColor={OX} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fontSize: 8.5, fontFamily: 'IBM Plex Mono', fill: '#16130F99' }} axisLine={{ stroke: INK }} tickLine={false} interval={1} />
                  <YAxis tick={{ fontSize: 8.5, fontFamily: 'IBM Plex Mono', fill: '#16130F99' }} axisLine={false} tickLine={false} domain={['dataMin - 4', 'dataMax + 4']} />
                  <Tooltip contentStyle={{ background: PAPER, border: `1px solid ${INK}`, borderRadius: 0, fontSize: 11, fontFamily: 'IBM Plex Mono' }} formatter={(v) => [`$${v}K`, 'Index']} />
                  <Area type="monotone" dataKey="v" stroke={OX} strokeWidth={1.8} fill="url(#gv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pull quote */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 border-b md:border-b-0 md:border-r border-[#16130F] px-6 py-5 flex flex-col justify-center relative">
            <span className="serif-it absolute top-1 left-3 text-[64px] leading-none text-[#9A7B2D]">“</span>
            <p className="serif-it text-[24px] md:text-[27px] leading-[1.18] text-[#16130F] pl-5">
              A collection is not assembled. It is <span className="text-[#6E1F1C]">commanded</span> — pair by pair, drop by drop, until the archive answers to one name.
            </p>
            <div className="mono text-[9.5px] tracking-[0.24em] mt-4 pl-5 text-[#16130F]/60">— THE REGISTRAR GENERAL, VOL. XXVII</div>
          </div>

          {/* Acquisitions bars */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div className="px-4 pt-3 mono text-[9px] tracking-[0.22em] text-[#16130F]/60">FIG. 02 — ACQUISITIONS BY QUARTER</div>
            <div className="h-[112px] px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.quarters} margin={{ top: 14, right: 10, left: -28, bottom: 0 }}>
                  <XAxis dataKey="q" tick={{ fontSize: 9, fontFamily: 'IBM Plex Mono', fill: '#16130F99' }} axisLine={{ stroke: INK }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fontFamily: 'IBM Plex Mono', fill: '#16130F99' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(22,19,15,0.06)' }} contentStyle={{ background: PAPER, border: `1px solid ${INK}`, borderRadius: 0, fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                  <Bar dataKey="n" barSize={26}>
                    {d.quarters.map((q, i) => <Cell key={i} fill={i === 2 ? GOLD : INK} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Hairline />
            <div className="px-4 py-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 mono text-[10px]">
              {[['GRAILS', '38%'], ['COLLABS', '27%'], ['ARCHIVE', '21%'], ['GENERAL', '14%']].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#16130F]/20 pb-0.5">
                  <span className="text-[#16130F]/60 tracking-[0.12em]">{k}</span><span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== HOLDINGS LEDGER ===== */}
        <div className="border-b border-[#16130F]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#16130F] bg-[#16130F]/[0.04]">
            <div className="exp text-[12px] font-bold tracking-[0.2em]">SCHEDULE A — REGISTERED HOLDINGS OF RECORD</div>
            <div className="mono text-[9.5px] tracking-[0.16em] text-[#16130F]/60 hidden sm:block">VERIFIED BY HOUSE APPRAISER · {year}-12-31</div>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="mono text-[9px] tracking-[0.18em] text-[#16130F]/55 border-b border-[#16130F]">
                <th className="text-left font-medium px-4 py-1.5">SILHOUETTE / EDITION</th>
                <th className="text-left font-medium px-3 py-1.5 hidden md:table-cell">SERIAL</th>
                <th className="text-left font-medium px-3 py-1.5 hidden sm:table-cell">SIZE</th>
                <th className="text-right font-medium px-3 py-1.5">RETAIL</th>
                <th className="text-right font-medium px-3 py-1.5">INDEX</th>
                <th className="text-right font-medium px-4 py-1.5">Δ</th>
              </tr>
            </thead>
            <tbody className="mono">
              {d.holdings.map((h, i) => (
                <tr key={h.name} className={`row-h transition-colors ${i !== d.holdings.length - 1 ? 'border-b border-[#16130F]/30' : ''}`}>
                  <td className="px-4 py-[7px] font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>{h.name}</td>
                  <td className="px-3 py-[7px] text-[#16130F]/65 hidden md:table-cell text-[11px]">{h.ed}</td>
                  <td className="px-3 py-[7px] text-[#16130F]/65 hidden sm:table-cell text-[11px]">{h.size}</td>
                  <td className="px-3 py-[7px] text-right text-[11px] text-[#16130F]/70">{h.paid}</td>
                  <td className="px-3 py-[7px] text-right text-[11px] font-semibold">{h.index}</td>
                  <td className={`px-4 py-[7px] text-right text-[11px] font-semibold ${h.up ? 'text-[#3D5A2A]' : 'text-[#6E1F1C]'}`}>
                    <span className="inline-flex items-center gap-1">
                      {h.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{h.delta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== ATTESTATION FOOTER ===== */}
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-3 flex items-center justify-center py-5 border-b md:border-b-0 md:border-r border-[#16130F]">
            <Seal />
          </div>
          <div className="col-span-12 md:col-span-6 md:border-r border-b md:border-b-0 border-[#16130F] px-5 py-4">
            <p className="serif-it text-[17px] leading-snug text-[#16130F]/85">
              Be it known that the holder named herein has met every threshold of the First Order — and that this standing, once granted, is revoked only by decree of the full Council.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-5">
              {[['A. M. CASTELLANE', 'REGISTRAR GENERAL'], ['T. OYELARAN-WHITLOCK', 'KEEPER OF THE ARCHIVE']].map(([n, t]) => (
                <div key={n}>
                  <div className="serif-it text-[22px] leading-none mb-1.5" style={{ transform: 'rotate(-2deg)' }}>{n.split(' ')[0]} {n.split(' ').slice(1).join(' ').toLowerCase()}</div>
                  <Hairline />
                  <div className="mono text-[8.5px] tracking-[0.2em] mt-1 text-[#16130F]/60">{n} · {t}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 px-5 py-4 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#6E1F1C]" />
              <span className="mono text-[9.5px] tracking-[0.18em]">CHAIN OF CUSTODY VERIFIED</span>
            </div>
            <div>
              <div className="bc" aria-hidden="true">
                {[2,1,3,1,1,2,1,4,1,2,2,1,3,1,1,2,4,1,1,3,1,2,1,1,3,2,1,4,1,1,2,1,3,1,2,1].map((w, i) => (
                  <span key={i} style={{ width: w, height: '100%' }} />
                ))}
              </div>
              <div className="mono text-[9px] tracking-[0.3em] mt-1.5">MS·{year}·0427·SOV·001</div>
            </div>
            <div className="mono text-[8px] leading-relaxed text-[#16130F]/50 tracking-[0.04em]">
              VALUATIONS REFLECT THE HOUSE INDEX AT CLOSE OF FISCAL YEAR. THIS DOCUMENT IS NON-TRANSFERABLE. UNAUTHORIZED REPRODUCTION VOIDS STANDING. PRINTED IN AN EDITION OF 1,000.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}