import { useMemo } from 'react';
import { Link } from 'wouter';
import { Plus, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { getTradingDateKey, getTradingDateParts } from '../../lib/tradingTime';
import type { JournalMedia, JournalOption, JournalTriggerEvent, Trade } from '../../db/database';
import type { JournalSessionBundle } from '../../services/journalSessionService';
import StoredImage from '../StoredImage';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

/**
 * فقط نمایش است: هیچ چیزی در دیتابیس نمی‌نویسد و هیچ محاسبه‌ای را تغییر نمی‌دهد.
 * معامله‌های سشن را به ترتیب ساعت ورود، پشت‌سرهم نشان می‌دهد و زیر هر معامله
 * تریگرها، عکس‌ها و توضیحات خودِ همان معامله را می‌آورد.
 */

const faNumber = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 });
const faInt = new Intl.NumberFormat('fa-IR', { useGrouping: false });
// تاریخ میلادی (مثل «۲۲ اکتبر ۲۰۲۶»)؛ بر پایهٔ UTC تا با مبنای زمانی انتخاب‌شدهٔ برنامه یکی باشد.
const gregorianDate = new Intl.DateTimeFormat('fa-IR-u-ca-gregory', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

function formatTime(ts: number): string {
  const p = getTradingDateParts(ts);
  const hh = faInt.format(p.hour).padStart(2, '۰');
  const mm = faInt.format(p.minute).padStart(2, '۰');
  return `${hh}:${mm}`;
}

function formatDate(ts: number): string {
  const p = getTradingDateParts(ts);
  return gregorianDate.format(new Date(Date.UTC(p.year, p.month, p.day)));
}

function parseScreenshots(raw: string | null | undefined): { id: string; label: string; dataUrl: string }[] {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter(item => item && typeof item.dataUrl === 'string' && item.dataUrl)
      .map((item, index) => ({ id: String(item.id ?? index), label: String(item.label ?? ''), dataUrl: item.dataUrl }));
  } catch {
    return [];
  }
}

function resultLabel(trade: Trade): string {
  if (trade.status === 'open') return 'باز';
  if (trade.result === 'win' || trade.result === 'partial-win') return 'سود';
  if (trade.result === 'loss' || trade.result === 'partial-loss') return 'زیان';
  if (trade.result === 'cancelled') return 'لغوشده';
  return 'سر به سر';
}

const TRIGGER_STATUS_LABEL: Record<JournalTriggerEvent['status'], string> = {
  pending: 'در انتظار',
  ignored: 'نادیده‌گرفته‌شده',
  invalid: 'نامعتبر',
  converted: 'تبدیل‌شده به معامله',
};

function MediaGrid({ items }: { items: JournalMedia[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map(item => (
        <div key={item.id} className="relative aspect-video overflow-hidden rounded-md border border-border/70 bg-background">
          {item.mimeType.startsWith('image/')
            ? <StoredImage source={item.blob} enableViewer showDownload filename={item.fileName} alt={item.caption || item.fileName} className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">{item.fileName}</div>}
        </div>
      ))}
    </div>
  );
}

function NoteLine({ label, text }: { label: string; text: string | null | undefined }) {
  const value = (text ?? '').trim();
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p>
    </div>
  );
}

export function SessionTradesLog({
  bundle, onStartTrade,
}: {
  bundle: JournalSessionBundle;
  onStartTrade?: () => void;
}) {
  const optionLabel = useMemo(() => {
    const map = new Map<string, JournalOption>();
    bundle.options.forEach(option => map.set(option.id, option));
    return (id: string | null | undefined) => (id ? map.get(id)?.label ?? '' : '');
  }, [bundle.options]);

  const trades = useMemo(
    () => [...bundle.trades].sort((a, b) => a.openedAt - b.openedAt),
    [bundle.trades],
  );

  return (
    <section className="space-y-3" aria-labelledby="linked-trades-heading">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium tracking-[0.18em] text-primary">EXECUTION LOG</p>
          <h2 id="linked-trades-heading" className="mt-1 text-xl font-semibold">معاملات سشن</h2>
        </div>
        <Badge variant="outline" data-testid="text-linked-trade-count">{faInt.format(trades.length)} معامله</Badge>
      </div>

      {trades.length === 0 ? (
        <Card className="border-dashed bg-card/50" data-testid="empty-linked-trades">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <Target className="h-7 w-7 text-muted-foreground/70" />
            <h3 className="font-semibold">هنوز معامله‌ای به این سشن وصل نیست</h3>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">وقتی آمادهٔ اجرا هستید، فرم ثبت معامله را از اینجا باز کنید تا پیوند سشن حفظ شود.</p>
            {onStartTrade && (
              <Button onClick={onStartTrade} className="gap-2" data-testid="button-first-linked-trade"><Plus className="h-4 w-4" />شروع ثبت معامله</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trades.map((trade, index) => {
            const triggers = bundle.triggers
              .filter(trigger => trigger.linkedTradeId === trade.id)
              .sort((a, b) => a.createdAt - b.createdAt);
            const tradeMedia = bundle.media.filter(item => item.tradeId === trade.id);
            const legacyShots = parseScreenshots(trade.screenshots);
            const pnl = trade.profitLoss;
            const isLong = trade.direction === 'long';
            const previous = index > 0 ? trades[index - 1] : null;
            const newDay = !previous || getTradingDateKey(previous.openedAt) !== getTradingDateKey(trade.openedAt);
            const hasNotes = [trade.entryReason, trade.notes, trade.managementReason, trade.reasonForExit, trade.emotionNotes, trade.adherenceNotes, trade.lesson]
              .some(value => (value ?? '').trim());

            return (
              <div key={trade.id} className="space-y-2">
                {newDay && index > 0 && (
                  <p className="pt-2 text-xs font-medium text-muted-foreground">{formatDate(trade.openedAt)}</p>
                )}
                <Card className="tradermind-card overflow-hidden" data-testid={`row-linked-trade-${trade.id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isLong ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'}`}>
                        {isLong ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 font-semibold">
                          <span>معامله {faInt.format(index + 1)}</span>
                          <span className="text-muted-foreground">·</span>
                          <span dir="ltr">{trade.symbol}</span>
                          <Badge variant="outline" className="text-[10px]">{isLong ? 'خرید' : 'فروش'}</Badge>
                          <Badge variant={trade.status === 'open' ? 'secondary' : 'outline'} className="text-[10px]">{resultLabel(trade)}</Badge>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          ساعت {formatTime(trade.openedAt)} — {formatDate(trade.openedAt)}
                          {trade.rMultiple != null ? ` · ${faNumber.format(trade.rMultiple)}R` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm font-semibold ${pnl == null ? 'text-muted-foreground' : pnl >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`} dir="ltr">
                        {pnl == null ? '—' : faNumber.format(pnl)}
                      </span>
                      <Link href={`/journal/trades/${trade.id}`} className="rounded-md border px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5" data-testid={`link-linked-trade-${trade.id}`}>جزئیات</Link>
                      <Link href={`/journal/trades/${trade.id}/journal`} className="rounded-md border px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5" data-testid={`link-trade-review-${trade.id}`}>مرور ژورنال</Link>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-4 sm:p-5">
                    {triggers.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-primary">تریگرها</p>
                        {triggers.map(trigger => {
                          const typeName = optionLabel(trigger.triggerTypeOptionId);
                          const triggerMedia = bundle.media.filter(item => item.triggerId === trigger.id);
                          return (
                            <div key={trigger.id} className="space-y-2 rounded-lg border border-border/70 bg-muted/10 p-3">
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-xs text-muted-foreground">{formatTime(trigger.createdAt)}</span>
                                {typeName && <Badge variant="outline" className="text-[10px]">{typeName}</Badge>}
                                <Badge variant="secondary" className="text-[10px]">{TRIGGER_STATUS_LABEL[trigger.status]}</Badge>
                                {trigger.confirmed && <Badge variant="outline" className="text-[10px]">تأییدشده</Badge>}
                              </div>
                              <NoteLine label="توضیح تریگر" text={trigger.description} />
                              <NoteLine label="حرکت بازار" text={trigger.marketMovement} />
                              <NoteLine label="یادداشت" text={trigger.notes} />
                              <MediaGrid items={triggerMedia} />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(tradeMedia.length > 0 || legacyShots.length > 0) && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-primary">عکس‌های معامله</p>
                        <MediaGrid items={tradeMedia} />
                        {legacyShots.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {legacyShots.map(shot => (
                              <div key={shot.id} className="relative aspect-video overflow-hidden rounded-md border border-border/70 bg-background">
                                <StoredImage source={shot.dataUrl} enableViewer showDownload filename={shot.label || `trade-${trade.id}`} alt={shot.label || 'اسکرین‌شات معامله'} className="h-full w-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {hasNotes && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-primary">توضیحات این معامله</p>
                        <NoteLine label="دلیل ورود" text={trade.entryReason} />
                        <NoteLine label="توضیح تصمیمات مدیریت" text={trade.managementReason} />
                        <NoteLine label="دلیل خروج" text={trade.reasonForExit} />
                        <NoteLine label="یادداشت احساسی" text={trade.emotionNotes} />
                        <NoteLine label="پایبندی به استراتژی" text={trade.adherenceNotes} />
                        <NoteLine label="یادداشت" text={trade.notes} />
                        <NoteLine label="درس این معامله" text={trade.lesson} />
                      </div>
                    )}

                    {triggers.length === 0 && tradeMedia.length === 0 && legacyShots.length === 0 && !hasNotes && (
                      <p className="text-xs text-muted-foreground">برای این معامله هنوز تریگر، عکس یا توضیحی ثبت نشده است.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
