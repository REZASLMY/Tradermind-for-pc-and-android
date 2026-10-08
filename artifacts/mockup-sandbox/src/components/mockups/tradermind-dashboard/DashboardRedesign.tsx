import {
  Activity,
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Database,
  FileText,
  GitBranch,
  LayoutDashboard,
  Menu,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "داشبورد", icon: LayoutDashboard, active: true },
  { label: "استراتژی‌ها", icon: GitBranch },
  { label: "تحلیل", icon: Activity },
  { label: "معاملات", icon: Wallet },
  { label: "سشن‌های معاملاتی", icon: CalendarDays },
  { label: "تحلیل ژورنال", icon: BarChart3 },
  { label: "ژورنال روزانه", icon: BookOpen },
  { label: "گزارش‌ها", icon: FileText },
];

function QuietEmpty({ icon: Icon, title, detail }: { icon: typeof BarChart3; title: string; detail: string }) {
  return (
    <div className="flex min-h-[170px] flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[#e8eee8] text-[#668174]">
        <Icon className="h-5 w-5" strokeWidth={1.7} />
      </div>
      <p className="text-sm font-semibold text-[#33453e]">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-6 text-[#83918a]">{detail}</p>
    </div>
  );
}

export function DashboardRedesign() {
  return (
    <main dir="rtl" className="min-h-[100dvh] bg-[#f3f4ee] text-[#263932] [font-family:Vazirmatn,'Tahoma',sans-serif]">
      <style>{`
        @keyframes tm-arrive { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tm-arrive { animation: tm-arrive .55s cubic-bezier(.2,.7,.2,1) both; }
        .tm-arrive-2 { animation-delay: .09s; }
        .tm-arrive-3 { animation-delay: .16s; }
        @media (prefers-reduced-motion: reduce) { .tm-arrive { animation: none; } }
      `}</style>
      <div className="mx-auto flex min-h-[100dvh] max-w-[1600px]">
        <aside className="hidden w-[252px] shrink-0 border-l border-[#dfe5dc] bg-[#f8f9f4] px-4 py-6 md:flex md:flex-col">
          <div className="flex items-center gap-3 px-3">
            <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#24473b] text-[#e5b978]">
              <Activity className="h-[19px] w-[19px]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight text-[#20372e]">TraderMind</div>
              <div className="mt-0.5 text-[10px] tracking-[.18em] text-[#87958c]">PRIVATE TRADE JOURNAL</div>
            </div>
          </div>

          <div className="mt-10 px-3 text-[10px] font-semibold tracking-[.12em] text-[#9aa69e]">فضای کاری</div>
          <nav className="mt-3 space-y-1">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button key={label} className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-right text-[13px] transition-colors ${active ? "bg-[#e8eee7] font-semibold text-[#28513f]" : "text-[#697a71] hover:bg-[#edf1eb] hover:text-[#33483d]"}`}>
                <Icon className={`h-[17px] w-[17px] ${active ? "text-[#416c55]" : "text-[#91a097]"}`} strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {active && <ChevronLeft className="h-4 w-4 text-[#78917f]" />}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-[#e2e7df] bg-[#f2f5ef] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52675b]">
              <ShieldCheck className="h-4 w-4 text-[#668773]" /> داده‌ها روی دستگاه شما
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[#89968e]">ژورنال شما خصوصی و آفلاین در دسترس است.</p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#829188]">
              <Database className="h-3.5 w-3.5" /> همگام‌سازی ابری خاموش
            </div>
          </div>
          <button className="mt-4 flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] text-[#718077] hover:bg-[#edf1eb]">
            <Settings2 className="h-[17px] w-[17px]" /> تنظیمات
          </button>
        </aside>

        <section className="min-w-0 flex-1 px-4 pb-10 pt-5 sm:px-7 md:px-10 md:pt-9">
          <header className="tm-arrive flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button aria-label="منو" className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfe5dc] bg-[#fafbf7] text-[#68796f] md:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-[#89968e]">
                  <span>فضای کاری شخصی</span><span className="h-1 w-1 rounded-full bg-[#b5c0b7]" /><span>داشبورد</span>
                </div>
                <h1 className="mt-2 text-[25px] font-bold tracking-tight text-[#243a30] sm:text-[30px]">سلام، خوش اومدی</h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-[#dce4da] bg-[#f8faf5] px-3 py-2 text-[11px] text-[#6c8073] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#789b7d]" />
              فضای خصوصی شما
            </div>
          </header>

          <div className="tm-arrive tm-arrive-2 mt-6 flex flex-col gap-4 rounded-[24px] border border-[#dce5da] bg-[#eaf0e7] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#dce8dc] text-[#52745b]">
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-[#6b8772]">از همین‌جا شروع کن</div>
                <h2 className="mt-1 text-[17px] font-bold text-[#2c4638] sm:text-[19px]">یک تصمیم خوب، قبل از هر معامله</h2>
                <p className="mt-1 max-w-xl text-[12px] leading-6 text-[#728579]">استراتژی‌ات را تعریف کن، بعد با آرامش تحلیل و دلیل تصمیم‌هایت را ثبت کن.</p>
              </div>
            </div>
            <button className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#315844] px-4 text-[12px] font-semibold text-[#f6f5ec] shadow-[0_5px_14px_rgba(48,83,63,.12)] transition hover:bg-[#274b38]">
              ایجاد اولین استراتژی <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="tm-arrive tm-arrive-2 mt-5 grid gap-4 lg:grid-cols-[1.08fr_.92fr]">
            <article className="overflow-hidden rounded-[22px] border border-[#e0e5dc] bg-[#fbfcf8]">
              <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f5eee0] text-[#a5824f]"><CalendarDays className="h-[17px] w-[17px]" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-[#33483d]">وضعیت امروز</h3>
                    <p className="mt-0.5 text-[10px] text-[#99a39b]">مروری کوتاه بر حال و برنامه‌ات</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f4f2e9] px-2.5 py-1 text-[10px] text-[#8c8067]">امروز</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3 rounded-2xl border border-[#eee8d9] bg-[#faf8f0] p-4">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#ad9060]" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#665c47]">ژورنال امروز هنوز ثبت نشده</p>
                    <p className="mt-1 text-[11px] leading-5 text-[#968a70]">چند خط درباره‌ی حال، تمرکز یا برنامه‌ات بنویس؛ لازم نیست معامله‌ای انجام داده باشی.</p>
                  </div>
                </div>
                <button className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9e2d8] bg-[#f8faf5] text-[12px] font-semibold text-[#52715c] transition hover:bg-[#eef4ec]">
                  <Plus className="h-4 w-4" /> ثبت ژورنال روزانه
                </button>
              </div>
            </article>

            <article className="rounded-[22px] border border-[#e0e5dc] bg-[#fbfcf8] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e9edf0] text-[#6d8290]"><Activity className="h-[17px] w-[17px]" /></div>
                <div>
                  <h3 className="text-sm font-bold text-[#33483d]">تحلیل پیش از معامله</h3>
                  <p className="mt-0.5 text-[10px] text-[#99a39b]">با چک‌لیست خودت، نه با عجله</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#f2f5f2] p-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#dce4dc] bg-[#fafbf8] text-[#829287]"><span className="text-xs">۱</span></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#52645a]">اولین استراتژی هنوز ساخته نشده</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#8c9990]">برای شروع تحلیل، ابتدا یک استراتژی تعریف کن.</p>
                </div>
                <ArrowUpLeft className="h-4 w-4 shrink-0 text-[#a0ada3]" />
              </div>
              <button className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#314f40] text-[12px] font-semibold text-[#f7f7f0] transition hover:bg-[#294535]">
                <Plus className="h-4 w-4" /> شروع تحلیل جدید
              </button>
            </article>
          </div>

          <section className="tm-arrive tm-arrive-3 mt-5 overflow-hidden rounded-[22px] border border-[#e0e5dc] bg-[#fbfcf8]">
            <div className="flex flex-col gap-3 border-b border-[#edf0e9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h3 className="text-sm font-bold text-[#33483d]">خلاصه‌ی عملکرد</h3>
                <p className="mt-1 text-[10px] text-[#99a39b]">وقتی معامله‌ای ثبت کنی، اینجا الگوها را مرور می‌کنیم.</p>
              </div>
              <div className="flex w-fit rounded-xl bg-[#f1f3ee] p-1 text-[10px]">
                {["امروز", "این هفته", "این ماه", "بازه دلخواه"].map((item, i) => (
                  <button key={item} className={`rounded-lg px-3 py-2 transition ${i === 1 ? "bg-[#fbfcf8] font-semibold text-[#4d6a56] shadow-sm" : "text-[#929d94] hover:text-[#596e60]"}`}>{item}</button>
                ))}
              </div>
            </div>
            <div className="grid lg:grid-cols-[1.35fr_.65fr]">
              <div className="flex min-h-[230px] flex-col justify-center border-b border-[#edf0e9] px-5 py-5 lg:border-b-0 lg:border-l lg:px-7">
                <div className="mb-3 flex items-center justify-between text-[10px] text-[#a0aaa1]">
                  <span>روند معاملات بسته‌شده</span><span>بدون داده</span>
                </div>
                <div className="relative flex min-h-[145px] items-center justify-center overflow-hidden rounded-2xl bg-[#f6f8f3]">
                  <div className="absolute inset-x-6 top-1/2 border-t border-dashed border-[#dfe6dc]" />
                  <div className="absolute inset-x-6 top-[30%] border-t border-dashed border-[#e8ede6]" />
                  <div className="absolute inset-x-6 top-[70%] border-t border-dashed border-[#e8ede6]" />
                  <div className="relative flex flex-col items-center text-center">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-[#e0e7df] bg-[#fbfcf8] text-[#8ba08f]"><BarChart3 className="h-[18px] w-[18px]" /></div>
                    <p className="mt-2 text-xs font-semibold text-[#5c7062]">هنوز معامله‌ای ثبت نشده</p>
                    <p className="mt-1 text-[10px] text-[#98a39a]">نمودار فقط بر پایه‌ی داده‌های واقعی ژورنال نمایش داده می‌شود.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[#edf0e9] lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
                <div className="p-4 sm:p-5">
                  <div className="text-[10px] text-[#96a198]">تعداد معاملات</div>
                  <div className="mt-3 flex items-end gap-2"><span className="text-[24px] font-semibold leading-none text-[#526459]">—</span><span className="pb-0.5 text-[10px] text-[#a1aaa2]">در این بازه</span></div>
                  <div className="mt-2 text-[10px] text-[#a1aaa2]">پس از ثبت اولین معامله نمایش داده می‌شود</div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[10px] text-[#96a198]">نرخ پایبندی</div>
                  <div className="mt-3 flex items-end gap-2"><span className="text-[24px] font-semibold leading-none text-[#526459]">—</span><span className="pb-0.5 text-[10px] text-[#a1aaa2]">این هفته</span></div>
                  <div className="mt-2 text-[10px] text-[#a1aaa2]">برای محاسبه، دست‌کم دو معامله لازم است</div>
                </div>
              </div>
            </div>
          </section>

          <div className="tm-arrive tm-arrive-3 mt-5 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[22px] border border-[#e0e5dc] bg-[#fbfcf8]">
              <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#edf0e9] text-[#72877a]"><Wallet className="h-4 w-4" /></div>
                  <div><h3 className="text-[13px] font-bold text-[#394d41]">آخرین معاملات</h3><p className="mt-0.5 text-[10px] text-[#9aa49b]">ثبت‌های معاملاتی تو</p></div>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-semibold text-[#69816f]">همه <ChevronLeft className="h-3.5 w-3.5" /></button>
              </div>
              <QuietEmpty icon={Wallet} title="هنوز معامله‌ای ثبت نشده" detail="پس از ثبت، جزئیات و نتیجه‌ی معاملاتت در این بخش دیده می‌شود." />
              <div className="border-t border-[#edf0e9] px-5 py-3">
                <button className="flex min-h-9 items-center gap-2 text-[11px] font-semibold text-[#68806e]"><Plus className="h-3.5 w-3.5" /> ثبت اولین معامله</button>
              </div>
            </article>
            <article className="rounded-[22px] border border-[#e0e5dc] bg-[#fbfcf8]">
              <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#f2eee5] text-[#9b855e]"><BookOpen className="h-4 w-4" /></div>
                  <div><h3 className="text-[13px] font-bold text-[#394d41]">آخرین ژورنال‌های روزانه</h3><p className="mt-0.5 text-[10px] text-[#9aa49b]">یادداشت‌ها و مرورهای تو</p></div>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-semibold text-[#69816f]">همه <ChevronLeft className="h-3.5 w-3.5" /></button>
              </div>
              <QuietEmpty icon={BookOpen} title="هنوز ژورنالی ثبت نشده" detail="ثبت حال و تمرکز روزانه کمک می‌کند تصمیم‌هایت را صادقانه‌تر مرور کنی." />
              <div className="border-t border-[#edf0e9] px-5 py-3">
                <button className="flex min-h-9 items-center gap-2 text-[11px] font-semibold text-[#68806e]"><Plus className="h-3.5 w-3.5" /> ثبت ژورنال امروز</button>
              </div>
            </article>
          </div>

          <footer className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-[#e1e6de] pt-4 text-[10px] text-[#9aa59c] sm:flex-row sm:items-center">
            <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#809783]" /> این صفحه فقط داده‌های ثبت‌شده‌ی خودت را نشان می‌دهد.</div>
            <button className="flex items-center gap-1.5 hover:text-[#64786a]"><CircleHelp className="h-3.5 w-3.5" /> راهنمای داشبورد</button>
          </footer>
        </section>
      </div>
    </main>
  );
}
