# بازسازی رابط TraderMind بر پایه‌ی تصویر مرجع

تگ‌های git: `phase0-baseline` (قبل از تغییر) → `phase1` … `phase5`.

## معماری
مونوریپوی pnpm؛ اپ در `artifacts/tradermind` (React + Vite + Tailwind v4 + Zustand + Dexie).
ویندوز: Electron (`desktop/main.cjs`). اندروید: Capacitor 7 روی همان بیلد وب. کدبیس مشترک.

## چه چیزی اضافه شد
- تم سوم «نئون ۳D» (کلاس `neon` + `dark`)؛ انتخابگر ۵ رنگ روی هر سه تم کار می‌کند.
- توکن‌ها و سطوح شیشه‌ای: انتهای `src/index.css` (`--tm-*`, `.tm-panel`, `.tm-kpi`, `.tm-nav-item`).
- کامپوننت‌های مشترک: `src/components/ds/` (Panel, KpiCard, DataPlaceholder)، `src/components/charts/TmCharts.tsx`.
- Shell: `src/components/shell/` (NavRail، AppHeader، MoreNavPanel)؛ منو در `src/navigation/navConfig.ts`.
- داشبورد: `components/dashboard/DashboardOverview.tsx` + `services/dashboardOverview.ts` (مبنای P/L خالص، بدون عدد فرضی).
- تحلیل پیشرفته: فیلتر نماد/استراتژی/جهت/نتیجه + `components/analytics/AdvancedOverview.tsx`.
- فرم ثبت معامله: پنل‌های شیشه‌ای؛ ۲ ستون در xl و ۳ ستون در 2xl (منطق فرم دست‌نخورده).
- تنظیمات ظاهری: «شفافیت شیشه‌ای» و «انیمیشن‌های نرم» (`glassEffects`, `softAnimations` در store).

## ساخت
- وب: `pnpm --filter @workspace/tradermind run build:web`
- اندروید/ویندوز: `BUILDING.md` یا GitHub Actions (`.github/workflows/build-native.yml`).

## مشکلات شناخته‌شده / انجام‌نشده
- APK و نصب‌کننده‌ی ویندوز در محیط توسعه ساخته نشد (SDK/Wine موجود نبود)؛ فقط بیلد وب حالت بومی و بارگذاری آن از `file://` تست شد.
- فرم ژورنال: ضبط تحلیل صوتی و پنل پیوست مرجع در کد وجود ندارد و اضافه نشد.
- کارت تصویری کوهستان و «نمایش جزئیات بیشتر» عمداً اضافه نشد (تزئینی / بدون رفتار تعریف‌شده).
- در مرجع نوار ناوبری سمت چپ است؛ طبق متن دستور (RTL) سمت راست گذاشته شد.
- فونت‌ها از Google Fonts بارگذاری می‌شوند؛ بدون اینترنت به فونت سیستم برمی‌گردند (از قبل وجود داشت).
- خطای کنسول ثبت ServiceWorker در `file://` از قبل وجود داشت و بی‌ضرر است.
