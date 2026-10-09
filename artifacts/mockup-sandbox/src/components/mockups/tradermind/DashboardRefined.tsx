import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Command,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import "./dashboardrefined.css";

type Trade = {
  symbol: string;
  name: string;
  direction: "خرید" | "فروش";
  time: string;
  setup: string;
  pnl: number;
  result: string;
};

const initialTrades: Trade[] = [
  { symbol: "EUR/USD", name: "یورو / دلار", direction: "خرید", time: "۱۰:۴۲", setup: "شکست ساختار", pnl: 184.5, result: "بسته‌شده" },
  { symbol: "XAU/USD", name: "طلا", direction: "فروش", time: "۰۹:۱۸", setup: "بازگشت به ارزش", pnl: -62.0, result: "بسته‌شده" },
  { symbol: "NAS100", name: "نزدک ۱۰۰", direction: "خرید", time: "دیروز", setup: "ادامه روند", pnl: 326.2, result: "بسته‌شده" },
];

const rangeSets = {
  روز: { pnl: "+۴۸۲٫۶۰", change: "+۱۲٫۴٪", chart: [22, 32, 28, 42, 38, 52, 45, 58, 54, 69, 65, 81, 76, 92] },
  هفته: { pnl: "+۲٬۸۴۰٫۵۰", change: "+۸٫۷٪", chart: [22, 26, 23, 39, 35, 44, 40, 57, 50, 68, 62, 76, 71, 91] },
  ماه: { pnl: "+۸٬۳۱۶٫۲۰", change: "+۶٫۲٪", chart: [17, 29, 25, 33, 31, 46, 41, 55, 49, 63, 60, 72, 68, 90] },
};

const navGroups = [
  {
    title: "فضای کار",
    items: [
      { label: "داشبورد", icon: LayoutDashboard },
      { label: "معاملات", icon: Wallet },
      { label: "ژورنال روزانه", icon: BookOpen },
    ],
  },
  {
    title: "تحلیل و رشد",
    items: [
      { label: "تحلیل‌ها", icon: Activity },
      { label: "عملکرد", icon: BarChart3 },
      { label: "استراتژی‌ها", icon: Target },
    ],
  },
];

function makeLine(values: number[], width: number, height: number) {
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - (value / 100) * height;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function makeArea(values: number[], width: number, height: number) {
  return `${makeLine(values, width, height)} L ${width} ${height} L 0 ${height} Z`;
}

export default function DashboardRefined() {
  const [range, setRange] = useState<keyof typeof rangeSets>("هفته");
  const [trades, setTrades] = useState(initialTrades);
  const [activeNav, setActiveNav] = useState("داشبورد");
  const [dialog, setDialog] = useState<"trade" | "analysis" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState<"خرید" | "فروش">("خرید");
  const currentRange = rangeSets[range];
  const line = useMemo(() => makeLine(currentRange.chart, 700, 180), [currentRange]);
  const area = useMemo(() => makeArea(currentRange.chart, 700, 180), [currentRange]);

  function saveTrade(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) return;
    setTrades((items) => [
      { symbol: cleanSymbol, name: "معامله جدید", direction, time: "همین حالا", setup: "ثبت سریع", pnl: 0, result: "باز" },
      ...items,
    ]);
    setSymbol("");
    setDialog(null);
    setNotice("معامله به ژورنال امروز اضافه شد");
  }

  function saveAnalysis(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDialog(null);
    setNotice("تحلیل جدید در فضای کار ذخیره شد");
  }

  return (
    <div className="tmv" dir="rtl">
      <aside className={`tmv-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="tmv-brand">
          <div className="tmv-mark"><Activity size={19} strokeWidth={2.4} /></div>
          <div className="tmv-brand-copy"><b>TraderMind</b><span>ژورنال معاملاتی</span></div>
          <button className="tmv-icon-button tmv-mobile-close" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X size={18} /></button>
        </div>

        <button className="tmv-workspace" onClick={() => setNotice("فضای کار شخصی شما فعال است")}>
          <span className="tmv-workspace-avatar">ن</span>
          <span className="tmv-workspace-copy"><b>فضای شخصی</b><small>حساب اصلی · دمو</small></span>
          <ChevronDown size={15} />
        </button>

        <nav className="tmv-nav" aria-label="ناوبری اصلی">
          {navGroups.map((group) => (
            <div className="tmv-nav-group" key={group.title}>
              <p className="tmv-nav-title">{group.title}</p>
              {group.items.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className={`tmv-nav-link ${activeNav === label ? "is-active" : ""}`}
                  onClick={() => { setActiveNav(label); setMenuOpen(false); }}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{label}</span>
                  {label === "معاملات" && <span className="tmv-nav-count">{trades.length}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="tmv-sidebar-bottom">
          <div className="tmv-streak">
            <div className="tmv-streak-icon"><ShieldCheck size={17} /></div>
            <div><b>ریتم این هفته</b><span>۳ روز پایبندی</span></div>
            <span className="tmv-streak-value">۳/۵</span>
            <div className="tmv-streak-track"><i /></div>
          </div>
          <button className="tmv-nav-link tmv-settings" onClick={() => setNotice("تنظیمات فضای کار آماده است")}>
            <Settings2 size={17} /><span>تنظیمات</span><ChevronLeft className="tmv-nav-chevron" size={15} />
          </button>
          <div className="tmv-sidebar-footer"><span className="tmv-online-dot" /> داده‌ها روی دستگاه شما ذخیره می‌شوند</div>
        </div>
      </aside>

      {menuOpen && <button className="tmv-scrim" onClick={() => setMenuOpen(false)} aria-label="بستن منو" />}

      <main className="tmv-main">
        <header className="tmv-topbar">
          <div className="tmv-mobile-brand">
            <button className="tmv-icon-button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو"><Menu size={20} /></button>
            <span className="tmv-mark tmv-mark-small"><Activity size={15} /></span><b>TraderMind</b>
          </div>
          <div className="tmv-breadcrumb"><span>فضای کار</span><ChevronLeft size={13} /><b>{activeNav}</b></div>
          <div className="tmv-top-actions">
            <button className="tmv-search" onClick={() => setNotice("جستجو را با میانبر / باز کنید")}><Search size={16} /><span>جستجو در ژورنال</span><kbd><Command size={11} /> K</kbd></button>
            <button className="tmv-icon-button tmv-notification" onClick={() => setNotice("همه‌چیز آرام است؛ اعلان تازه‌ای ندارید")} aria-label="اعلان‌ها"><Bell size={18} /><i /></button>
            <button className="tmv-avatar" onClick={() => setNotice("حساب نیما · نسخه شخصی")} aria-label="پروفایل">ن</button>
          </div>
        </header>

        <div className="tmv-content">
          <div className="tmv-page-heading">
            <div>
              <div className="tmv-date-line"><CalendarDays size={14} /><span>دوشنبه، ۲۴ شهریور ۱۴۰۴</span><span className="tmv-date-dot">•</span><span>هفته ۳۷</span></div>
              <h1>صبح بخیر، نیما <span>؛</span></h1>
              <p>یک نگاه روشن به تصمیم‌های این هفته‌ات.</p>
            </div>
            <div className="tmv-heading-actions">
              <button className="tmv-button tmv-button-soft" onClick={() => setDialog("analysis")}><FileText size={16} /> تحلیل جدید</button>
              <button className="tmv-button tmv-button-primary" onClick={() => setDialog("trade")}><Plus size={17} /> ثبت معامله</button>
            </div>
          </div>

          {notice && (
            <div className="tmv-notice" role="status"><span><Check size={15} /></span>{notice}<button onClick={() => setNotice("")} aria-label="بستن پیام"><X size={14} /></button></div>
          )}

          <section className="tmv-overview">
            <div className="tmv-performance">
              <div className="tmv-performance-head">
                <div><span className="tmv-kicker">عملکرد خالص</span><span className="tmv-period-caption">در بازه انتخابی</span></div>
                <div className="tmv-ranges" role="group" aria-label="بازه زمانی">
                  {(Object.keys(rangeSets) as Array<keyof typeof rangeSets>).map((item) => (
                    <button key={item} className={range === item ? "is-selected" : ""} onClick={() => setRange(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="tmv-performance-value-row">
                <strong className="tmv-performance-value" dir="ltr">{currentRange.pnl}<span> $</span></strong>
                <span className="tmv-change"><TrendingUp size={14} /> {currentRange.change} <small>نسبت به دوره قبل</small></span>
              </div>
              <div className="tmv-chart-wrap" aria-label="نمودار عملکرد خالص">
                <div className="tmv-chart-axis"><span>۳٬۰۰۰</span><span>۲٬۰۰۰</span><span>۱٬۰۰۰</span><span>۰</span></div>
                <svg className="tmv-chart" viewBox="0 0 700 180" preserveAspectRatio="none" role="img" aria-label="روند افزایشی عملکرد">
                  <defs><linearGradient id="tmvArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5777d9" stopOpacity=".21" /><stop offset="100%" stopColor="#5777d9" stopOpacity="0" /></linearGradient></defs>
                  {[0, 60, 120, 180].map((y) => <line key={y} x1="0" y1={y} x2="700" y2={y} className="tmv-chart-grid" />)}
                  <path d={area} fill="url(#tmvArea)" />
                  <path d={line} className="tmv-chart-line" />
                  <circle cx="700" cy={180 - (currentRange.chart[currentRange.chart.length - 1] / 100) * 180} r="4.5" className="tmv-chart-point" />
                </svg>
                <div className="tmv-chart-labels"><span>شنبه</span><span>یکشنبه</span><span>دوشنبه</span><span>سه‌شنبه</span><span>چهارشنبه</span><span>پنجشنبه</span><span>جمعه</span></div>
              </div>
              <div className="tmv-chart-foot"><span><i className="tmv-legend-dot" /> سود خالص</span><span>منبع: معاملات بسته‌شده</span></div>
            </div>

            <aside className="tmv-discipline">
              <div className="tmv-discipline-heading">
                <div className="tmv-icon-tile"><ShieldCheck size={18} /></div>
                <div><span className="tmv-kicker">کیفیت تصمیم</span><h2>این هفته، با برنامه</h2></div>
                <button className="tmv-icon-button tmv-more" onClick={() => setNotice("جزئیات پایبندی در بخش عملکرد") } aria-label="گزینه‌های کیفیت تصمیم"><MoreHorizontal size={18} /></button>
              </div>
              <div className="tmv-score">
                <div className="tmv-score-ring"><div><b>۸۶</b><small>از ۱۰۰</small></div></div>
                <div className="tmv-score-copy"><b>پایبندی خوب</b><span>از میان ۱۲ معامله</span><small><TrendingUp size={13} /> ۶ امتیاز بهتر از هفته قبل</small></div>
              </div>
              <div className="tmv-discipline-divider" />
              <div className="tmv-discipline-label"><span>اجرای پلن</span><b>۱۰ از ۱۲</b></div>
              <div className="tmv-meter"><span style={{ width: "83%" }} /></div>
              <div className="tmv-discipline-note"><Sparkles size={15} /><span>بیشترین پیشرفتت: <b>ورود با تأیید</b></span></div>
              <button className="tmv-text-link" onClick={() => setActiveNav("عملکرد")}>دیدن گزارش کامل <ArrowLeft size={14} /></button>
            </aside>
          </section>

          <section className="tmv-metrics" aria-label="خلاصه شاخص‌ها">
            <div className="tmv-metric">
              <div className="tmv-metric-top"><span>نرخ برد</span><span className="tmv-metric-icon tmv-green"><Target size={16} /></span></div>
              <div className="tmv-metric-main"><b>۶۶٫۷٪</b><span className="tmv-mini-change positive"><TrendingUp size={12} /> ۴٫۲٪</span></div>
              <small>۸ برد <i /> ۴ باخت</small>
            </div>
            <div className="tmv-metric">
              <div className="tmv-metric-top"><span>معاملات بسته‌شده</span><span className="tmv-metric-icon tmv-blue"><BarChart3 size={16} /></span></div>
              <div className="tmv-metric-main"><b>۱۲</b><span className="tmv-mini-change neutral">این هفته</span></div>
              <small>میانگین روزانه ۲٫۴ معامله</small>
            </div>
            <div className="tmv-metric">
              <div className="tmv-metric-top"><span>میانگین ریسک / بازده</span><span className="tmv-metric-icon tmv-amber"><Activity size={16} /></span></div>
              <div className="tmv-metric-main"><b>۱ : ۲٫۱</b><span className="tmv-mini-change positive"><TrendingUp size={12} /> ۰٫۳</span></div>
              <small>هدف شخصی: ۱ : ۲</small>
            </div>
            <div className="tmv-metric">
              <div className="tmv-metric-top"><span>میانگین حال ذهنی</span><span className="tmv-metric-icon tmv-rose"><Sparkles size={16} /></span></div>
              <div className="tmv-metric-main"><b>۷٫۸<span className="tmv-out-of"> / ۱۰</span></b><span className="tmv-mini-change positive"><TrendingUp size={12} /> ۰٫۶</span></div>
              <small>ثبت‌شده در ۴ روز از ۵ روز</small>
            </div>
          </section>

          <section className="tmv-lower-grid">
            <div className="tmv-panel tmv-trades-panel">
              <div className="tmv-panel-heading">
                <div><h2>معاملات اخیر</h2><p>آخرین ثبت‌ها از ژورنال تو</p></div>
                <div className="tmv-panel-actions"><button className="tmv-filter-button" onClick={() => setNotice("نمایش معاملات این هفته")}><Filter size={14} /> این هفته<ChevronDown size={13} /></button><button className="tmv-icon-button tmv-panel-more" onClick={() => setNotice("نمایش همه معاملات")} aria-label="گزینه‌های معاملات"><MoreHorizontal size={19} /></button></div>
              </div>
              <div className="tmv-table-scroll">
                <table className="tmv-trades-table">
                  <thead><tr><th>نماد</th><th>نوع</th><th>الگو</th><th>زمان</th><th>سود / زیان</th><th><span className="tmv-visually-hidden">باز کردن</span></th></tr></thead>
                  <tbody>{trades.slice(0, 4).map((trade, index) => (
                    <tr key={`${trade.symbol}-${index}`}>
                      <td><div className="tmv-symbol-cell"><span className={`tmv-symbol-icon ${trade.symbol.startsWith("X") ? "gold" : trade.symbol === "NAS100" ? "nas" : ""}`}>{trade.symbol.startsWith("X") ? "Au" : trade.symbol === "NAS100" ? "N" : "€"}</span><span><b dir="ltr">{trade.symbol}</b><small>{trade.name}</small></span></div></td>
                      <td><span className={`tmv-direction ${trade.direction === "خرید" ? "buy" : "sell"}`}>{trade.direction === "خرید" ? <ArrowUpLeft size={12} /> : <ArrowDownLeft size={12} />}{trade.direction}</span></td>
                      <td className="tmv-setup-cell">{trade.setup}</td><td className="tmv-time-cell"><Clock3 size={12} />{trade.time}</td>
                      <td><span className={`tmv-pnl ${trade.pnl > 0 ? "positive" : trade.pnl < 0 ? "negative" : "flat"}`} dir="ltr">{trade.pnl > 0 ? "+" : ""}{trade.pnl.toFixed(2)} $</span></td>
                      <td><button className="tmv-row-open" onClick={() => setNotice(`جزئیات ${trade.symbol} آماده نمایش است`)} aria-label={`جزئیات ${trade.symbol}`}><ArrowUpRight size={14} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <button className="tmv-view-all" onClick={() => setActiveNav("معاملات")}>رفتن به دفتر معاملات <ArrowLeft size={14} /></button>
            </div>

            <div className="tmv-panel tmv-journal-panel">
              <div className="tmv-panel-heading">
                <div><h2>شروع روزت</h2><p>یک مرور کوتاه، قبل از بازار</p></div>
                <span className="tmv-journal-date">امروز · ۲۴ شهریور</span>
              </div>
              <div className="tmv-journal-status">
                <div className="tmv-journal-status-icon"><BookOpen size={17} /></div>
                <div><b>ژورنال صبحگاهی</b><span>چند دقیقه برای وضوح بیشتر</span></div>
                <span className="tmv-status-pending">در انتظارت</span>
              </div>
              <div className="tmv-prompt">
                <span className="tmv-prompt-label">پرسش امروز</span>
                <p>امروز چه چیزی باعث می‌شود از برنامه‌ات خارج شوی؟</p>
                <button onClick={() => setDialog("analysis")}>ثبت فکر روز <ArrowLeft size={14} /></button>
              </div>
              <div className="tmv-journal-footer"><span><Clock3 size={13} /> حدود ۲ دقیقه</span><span><span className="tmv-tiny-check"><Check size={10} /></span> تداوم، مهم‌تر از کمال</span></div>
            </div>
          </section>

          <footer className="tmv-footer-note"><span>آخرین همگام‌سازی: همین لحظه</span><span><CircleHelp size={13} /> داده‌ها خصوصی و محلی باقی می‌مانند</span></footer>
        </div>
      </main>

      {dialog && (
        <div className="tmv-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <form className="tmv-modal" onSubmit={dialog === "trade" ? saveTrade : saveAnalysis}>
            <div className="tmv-modal-head"><div><span className="tmv-kicker">{dialog === "trade" ? "ژورنال معاملات" : "فضای تحلیل"}</span><h2>{dialog === "trade" ? "ثبت معامله" : "تحلیل تازه"}</h2></div><button type="button" className="tmv-icon-button" onClick={() => setDialog(null)} aria-label="بستن"><X size={18} /></button></div>
            {dialog === "trade" ? (
              <>
                <label className="tmv-field-label" htmlFor="tmv-symbol">نماد معاملاتی</label>
                <input id="tmv-symbol" className="tmv-input" value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="مثلاً EUR/USD" dir="ltr" autoFocus required />
                <label className="tmv-field-label">جهت معامله</label>
                <div className="tmv-direction-select">
                  {(["خرید", "فروش"] as const).map((item) => <button type="button" key={item} className={direction === item ? "is-chosen" : ""} onClick={() => setDirection(item)}>{item === "خرید" ? <TrendingUp size={15} /> : <TrendingDown size={15} />}{item}</button>)}
                </div>
                <p className="tmv-modal-hint">جزئیات ورود و خروج را بعداً در صفحه معامله کامل کن.</p>
              </>
            ) : (
              <>
                <label className="tmv-field-label" htmlFor="tmv-analysis-title">موضوع تحلیل</label>
                <input id="tmv-analysis-title" className="tmv-input" placeholder="مثلاً بررسی ستاپ EUR/USD" autoFocus required />
                <label className="tmv-field-label" htmlFor="tmv-analysis-note">یادداشت شروع</label>
                <textarea id="tmv-analysis-note" className="tmv-input tmv-textarea" placeholder="چه چیزی توجهت را جلب کرد؟" rows={3} />
              </>
            )}
            <div className="tmv-modal-actions"><button type="button" className="tmv-button tmv-button-soft" onClick={() => setDialog(null)}>انصراف</button><button type="submit" className="tmv-button tmv-button-primary"><Check size={15} />{dialog === "trade" ? "افزودن معامله" : "ذخیره تحلیل"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
