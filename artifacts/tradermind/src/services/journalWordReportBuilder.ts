import type {
  Account, JournalOption, JournalSession, JournalSessionAnalysis, JournalTriggerEvent, Strategy, Trade,
} from '../db/database';
import { describeSessionMoment, formatCompactMoment, localDayKey } from '../lib/sessionDateTime';
import { triggerAnalysisIds } from '../lib/triggerAnalysis';
import {
  buildDocxParts, CONTENT_WIDTH, imageParagraph, LABEL_FILL, paragraph, table,
  type DocxImagePart, type TableCell,
} from '../lib/ooxml';
import {
  parseAnalysisFieldSelections,
  type AnalysisFieldLayouts,
  type AnalysisFlexibleFieldKey,
  type JournalAnalysisFieldLabels,
} from './journalAnalysisFieldLabels';

/** تصویر آمادهٔ درج در Word (JPEG یا PNG). */
export interface ReportImage {
  fileName: string;
  bytes: Uint8Array;
  width: number;
  height: number;
}

export interface ReportMedia {
  id: string;
  analysisId: string | null;
  triggerId: string | null;
  tradeId?: string | null;
  image: ReportImage;
}

export interface JournalReportInput {
  sessions: JournalSession[];
  options: JournalOption[];
  strategies: Strategy[];
  accounts: Account[];
  analyses: JournalSessionAnalysis[];
  triggers: JournalTriggerEvent[];
  trades: Trade[];
  media: ReportMedia[];
  labels: JournalAnalysisFieldLabels;
  layouts: AnalysisFieldLayouts;
  generatedAt: number;
}

const MAX_IMAGE_WIDTH_EMU = 5_940_000; // ۱۶٫۵ سانتی‌متر
const MAX_IMAGE_HEIGHT_EMU = 7_200_000; // ۲۰ سانتی‌متر

const DIRECTION_LABELS: Record<Trade['direction'], string> = { long: 'خرید', short: 'فروش' };
const RESULT_LABELS: Record<Trade['result'], string> = {
  win: 'سود', loss: 'زیان', breakeven: 'سر به سر', 'partial-win': 'سود جزئی',
  'partial-loss': 'زیان جزئی', open: 'باز', cancelled: 'لغوشده',
};
const TRIGGER_STATUS_LABELS: Record<JournalTriggerEvent['status'], string> = {
  pending: 'در انتظار', ignored: 'نادیده', invalid: 'نامعتبر', converted: 'متصل به معامله',
};

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6, useGrouping: false });
const pnlFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, useGrouping: false });

const price = (value: number | null | undefined) => (value == null || !Number.isFinite(value) ? '—' : numberFormatter.format(value));
const pnlText = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return '—';
  return `${value > 0 ? '+' : ''}${pnlFormatter.format(value)}`;
};

function parseIds(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** بدنهٔ XML سند و فهرست تصاویر را می‌سازد. */
export function buildJournalReportParts(input: JournalReportInput): Record<string, string | Uint8Array> {
  const optionLabel = new Map(input.options.map(option => [option.id, option.label]));
  const label = (id: string | null | undefined, fallback = '—') => (id ? optionLabel.get(id) ?? fallback : fallback);
  const strategyName = new Map(input.strategies.map(item => [item.id, item.name]));
  const accountName = new Map(input.accounts.map(item => [item.id, item.name]));
  const tradeById = new Map(input.trades.map(trade => [trade.id, trade]));

  const images: DocxImagePart[] = [];
  let imageCounter = 0;
  const imageXml = (media: ReportMedia): string => {
    imageCounter += 1;
    const relationshipId = `rIdImg${imageCounter}`;
    const extension = media.image.fileName.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
    images.push({ fileName: `image${imageCounter}.${extension}`, relationshipId, bytes: media.image.bytes });
    const widthEmu = media.image.width * 9525;
    const heightEmu = media.image.height * 9525;
    const scale = Math.min(1, MAX_IMAGE_WIDTH_EMU / widthEmu, MAX_IMAGE_HEIGHT_EMU / heightEmu);
    const cx = Math.max(1, Math.round(widthEmu * scale));
    const cy = Math.max(1, Math.round(heightEmu * scale));
    return imageParagraph(relationshipId, imageCounter, media.image.fileName, cx, cy);
  };
  const mediaFor = (target: { analysisId?: string; triggerId?: string; tradeId?: string }) => input.media.filter(item => {
    if (target.analysisId) return item.analysisId === target.analysisId;
    if (target.triggerId) return item.triggerId === target.triggerId;
    // عکس‌های مخصوص معامله (نه تحلیل و نه تریگر)
    return Boolean(target.tradeId) && item.tradeId === target.tradeId && !item.analysisId && !item.triggerId;
  });

  // ── گروه‌بندی سشن‌ها بر اساس روز ──
  const sessionsSorted = [...input.sessions].sort((a, b) => a.startTime - b.startTime);
  const days = new Map<string, JournalSession[]>();
  for (const session of sessionsSorted) {
    const key = localDayKey(session.startTime);
    days.set(key, [...(days.get(key) ?? []), session]);
  }

  const body: string[] = [];
  const generated = describeSessionMoment(input.generatedAt);
  body.push(paragraph('گزارش ژورنال معاملاتی TraderMind', { style: 'Heading1' }));
  body.push(paragraph(`تاریخ تهیه: ${generated ? `${generated.weekday} ${generated.jalali} — ${generated.gregorian} — ${generated.time}` : '—'}`));
  body.push(paragraph(`تعداد روزهای معاملاتی: ${days.size.toLocaleString('fa-IR')} | تعداد سشن‌ها: ${sessionsSorted.length.toLocaleString('fa-IR')}`));
  if (days.size === 0) body.push(paragraph('در بازهٔ انتخاب‌شده سشنی ثبت نشده است.', { bold: true }));

  let dayIndex = 0;
  for (const [, daySessions] of days) {
    const first = daySessions[0];
    const moment = describeSessionMoment(first.startTime);
    const dayTrades = daySessions
      .flatMap(session => input.trades.filter(trade => trade.journalSessionId === session.id))
      .sort((a, b) => a.openedAt - b.openedAt);
    const closedPnl = dayTrades.reduce((sum, trade) => sum + (trade.profitLoss ?? 0), 0);
    const wins = dayTrades.filter(trade => trade.result === 'win' || trade.result === 'partial-win').length;
    const losses = dayTrades.filter(trade => trade.result === 'loss' || trade.result === 'partial-loss').length;

    body.push(paragraph(`روز معاملاتی: ${moment?.weekday ?? ''} ${moment?.jalali ?? ''}`, { style: 'Heading1', pageBreakBefore: dayIndex > 0 }));
    body.push(paragraph(`تاریخ میلادی: ${moment?.gregorian ?? '—'}`));
    body.push(paragraph(`ساعت شروع معاملاتی (اولین سشن روز): ${moment?.time ?? '—'}`, { bold: true }));
    body.push(paragraph(`تعداد سشن: ${daySessions.length.toLocaleString('fa-IR')} | معاملات: ${dayTrades.length.toLocaleString('fa-IR')} | برد: ${wins.toLocaleString('fa-IR')} | باخت: ${losses.toLocaleString('fa-IR')} | مجموع سود/زیان: ${pnlText(closedPnl)}`));
    dayIndex += 1;

    for (const session of daySessions) {
      const sessionMoment = describeSessionMoment(session.startTime);
      let symbols: string[] = [];
      try { const parsed: unknown = JSON.parse(session.symbols); symbols = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []; } catch { symbols = []; }
      const heading = [
        `سشن ${symbols.join(' / ') || '—'}`,
        session.sessionTypeOptionId ? label(session.sessionTypeOptionId) : '',
        sessionMoment?.time ?? '',
      ].filter(Boolean).join(' · ');
      body.push(paragraph(heading, { style: 'Heading2', before: 360 }));
      const overview: Array<[string, string]> = [
        ['نماد', symbols.join(' / ')],
        ['نوع سشن', label(session.sessionTypeOptionId, '')],
        ['بازار', label(session.marketOptionId, '')],
        ['حساب', accountName.get(session.accountId) ?? ''],
        ['استراتژی', strategyName.get(session.strategyId) ?? ''],
        ['زمان شروع', sessionMoment ? `${sessionMoment.weekday} ${sessionMoment.jalali} — ${sessionMoment.gregorian} — ${sessionMoment.time}` : ''],
        ['زمان پایان', session.endTime ? formatCompactMoment(session.endTime).replace('\n', ' ') : ''],
        ['یادداشت زمینهٔ سشن', session.notes?.trim() ?? ''],
        ['روان‌شناسی پیش از معامله', session.preTradePsychology?.trim() ?? ''],
        ['درس‌های آموخته‌شده', session.lessonsLearned?.trim() ?? ''],
        ['مرور اشتباه‌ها', session.mistakesReview?.trim() ?? ''],
        ['مرور روان‌شناختی', session.psychologicalReview?.trim() ?? ''],
        ['مشاهدات استراتژی', session.strategyObservations?.trim() ?? ''],
        ['پیشنهاد تغییر استراتژی', session.strategyChangeProposal?.trim() ?? ''],
        ['بازتاب نهایی', session.finalReflection?.trim() ?? ''],
      ];
      body.push(paragraph('توضیحات کلی سشن', { style: 'Heading3', keepNext: true }));
      const overviewRows: TableCell[][] = overview.filter(([, value]) => value).map(([name, value]) => [{ text: name, bold: true, fill: LABEL_FILL }, { text: value }]);
      body.push(overviewRows.length ? table(overviewRows, [2600, CONTENT_WIDTH - 2600], { fontSize: 20 }) : paragraph('توضیحی برای این سشن ثبت نشده است.'));

      // ۲) تحلیل‌های چندبازه‌ای
      const analyses = input.analyses.filter(item => item.sessionId === session.id).sort((a, b) => a.createdAt - b.createdAt);
      body.push(paragraph('رویدادهای تحلیل چندبازه‌ای', { style: 'Heading3' }));
      if (analyses.length === 0) body.push(paragraph('تحلیلی ثبت نشده است.'));
      for (const analysis of analyses) {
        const selections = parseAnalysisFieldSelections(analysis.fieldSelections);
        const flexible = (key: AnalysisFlexibleFieldKey, text: string | undefined): string => {
          const layout = input.layouts[key];
          if (layout.kind === 'checkbox') {
            const selected = (selections[key] ?? []).map(id => label(id, 'گزینهٔ حذف‌شده')).join('، ');
            return [selected, text?.trim() ? `متن قبلی: ${text.trim()}` : ''].filter(Boolean).join('\n');
          }
          return text?.trim() ?? '';
        };
        const tradeSummary = (id: string | null | undefined) => {
          const trade = id ? tradeById.get(id) : undefined;
          return trade ? `${trade.symbol} · ${formatCompactMoment(trade.openedAt).replace('\n', ' ')}` : '';
        };
        const L = input.labels;
        const fields: Array<[string, string]> = [
          [L.analysisText, flexible('analysisText', analysis.analysisText)],
          [L.marketContext, flexible('marketContext', analysis.marketContext)],
          [L.momentumText, flexible('momentumText', analysis.momentumText)],
          [L.pricePositionText, flexible('pricePositionText', analysis.pricePositionText)],
          [L.expectedDirectionOptionId, label(analysis.expectedDirectionOptionId, '')],
          [L.directionLogicText, flexible('directionLogicText', analysis.directionLogicText)],
          [L.scenario, flexible('scenario', analysis.scenario)],
          [L.triggerContext, flexible('triggerContext', analysis.triggerContext)],
          [L.zones, flexible('zones', analysis.zones)],
          [L.notes, analysis.notes?.trim() ?? ''],
          ['نتیجهٔ سناریو', [label(analysis.scenarioOutcomeOptionId, ''), analysis.scenarioOutcomeNote?.trim() ?? ''].filter(Boolean).join('\n')],
          [L.previousTradeId, tradeSummary(analysis.previousTradeId)],
          [L.nextTradeId, tradeSummary(analysis.nextTradeId)],
          [L.tags, parseIds(analysis.tags).join('، ')],
        ];
        // مقادیر قدیمی (جهت بازار، ساختار بازار، زمینهٔ نقدینگی) فقط اگر قبلاً پر شده باشند.
        if (analysis.directionOptionId) fields.push([`${L.directionOptionId} (ثبت قبلی)`, label(analysis.directionOptionId)]);
        if (analysis.marketStructureOptionId) fields.push([`${L.marketStructureOptionId} (ثبت قبلی)`, label(analysis.marketStructureOptionId)]);
        const legacyLiquidity = parseIds(analysis.liquidityContextOptionIds);
        if (legacyLiquidity.length) fields.push([`${L.liquidityContextOptionIds} (ثبت قبلی)`, legacyLiquidity.map(id => label(id)).join('، ')]);

        body.push(paragraph(`تایم‌فریم: ${label(analysis.timeframeOptionId, 'تایم‌فریم حذف‌شده')}`, { style: 'Heading3', keepNext: true }));
        const rows: TableCell[][] = fields.map(([name, value]) => [{ text: name, bold: true, fill: LABEL_FILL }, { text: value || '—' }]);
        body.push(table(rows, [2600, CONTENT_WIDTH - 2600], { fontSize: 20 }));
        for (const media of mediaFor({ analysisId: analysis.id })) body.push(imageXml(media));
      }

      // ۳) معاملات ثبت‌شده همراه تریگر
      const triggers = input.triggers.filter(item => item.sessionId === session.id).sort((a, b) => a.createdAt - b.createdAt);
      const sessionTrades = input.trades.filter(trade => trade.journalSessionId === session.id).sort((a, b) => a.openedAt - b.openedAt);
      const triggerOfTrade = (trade: Trade) => triggers.find(item => item.linkedTradeId === trade.id)
        ?? triggers.find(item => item.id === trade.journalTriggerEventId);
      const analysisTimeframe = new Map(analyses.map(item => [item.id, label(item.timeframeOptionId)]));
      const rowsOf = (pairs: Array<[string, string]>): TableCell[][] =>
        pairs.filter(([, value]) => value && value !== '—').map(([name, value]) => [{ text: name, bold: true, fill: LABEL_FILL }, { text: value }]);
      const triggerPairs = (trigger: JournalTriggerEvent | undefined): Array<[string, string]> => {
        if (!trigger) return [['تریگر', 'برای این معامله تریگری ثبت نشده است.']];
        const related = triggerAnalysisIds(trigger).map(id => analysisTimeframe.get(id)).filter(Boolean).join('، ');
        return [
          ['تایم‌فریم تریگر', label(trigger.timeframeOptionId, '')],
          ['نوع تریگر', label(trigger.triggerTypeOptionId, '')],
          ['جهت تریگر', label(trigger.directionOptionId, '')],
          ['شرح تریگر', trigger.description?.trim() ?? ''],
          ['حرکت قیمت و واکنش بازار', trigger.marketMovement?.trim() ?? ''],
          ['یادداشت تریگر', trigger.notes?.trim() ?? ''],
          ['تحلیل‌های مرتبط', related],
          ['وضعیت تریگر', TRIGGER_STATUS_LABELS[trigger.status] ?? ''],
        ];
      };

      body.push(paragraph('معاملات و تریگر هر معامله', { style: 'Heading3', before: 240 }));
      if (sessionTrades.length === 0) body.push(paragraph('معامله‌ای در این سشن ثبت نشده است.'));
      sessionTrades.forEach((trade, index) => {
        const trigger = triggerOfTrade(trade);
        body.push(paragraph(`معامله ${(index + 1).toLocaleString('fa-IR')} — ${trade.symbol} · ${DIRECTION_LABELS[trade.direction] ?? ''} · ${formatCompactMoment(trade.openedAt).replace('\n', ' ')}`, { style: 'Heading3', keepNext: true, before: 240 }));
        const pairs: Array<[string, string]> = [
          ...triggerPairs(trigger),
          ['نتیجهٔ معامله', RESULT_LABELS[trade.result] ?? ''],
          ['سود/زیان', trade.profitLoss != null ? pnlText(trade.profitLoss) : ''],
        ];
        body.push(table(rowsOf(pairs), [2600, CONTENT_WIDTH - 2600], { fontSize: 20 }));
        // عکس‌ها زیر جدول همین معامله: اول عکس تریگر، بعد عکس‌های خود معامله
        if (trigger) for (const media of mediaFor({ triggerId: trigger.id })) body.push(imageXml(media));
        for (const media of mediaFor({ tradeId: trade.id })) body.push(imageXml(media));
      });

      // تریگرهای بدون معامله: همان قالب، جدول و بعد عکس‌ها
      const linkedIds = new Set(sessionTrades.map(trade => triggerOfTrade(trade)?.id).filter(Boolean));
      const unlinked = triggers.filter(trigger => !linkedIds.has(trigger.id));
      unlinked.forEach((trigger, index) => {
        body.push(paragraph(`تریگر بدون معامله ${(index + 1).toLocaleString('fa-IR')} — ${formatCompactMoment(trigger.createdAt).replace('\n', ' ')}`, { style: 'Heading3', keepNext: true, before: 240 }));
        body.push(table(rowsOf(triggerPairs(trigger)), [2600, CONTENT_WIDTH - 2600], { fontSize: 20 }));
        for (const media of mediaFor({ triggerId: trigger.id })) body.push(imageXml(media));
      });
    }
  }

  return buildDocxParts(body.join(''), images);
}
