import { useMemo } from 'react';
import App from './App';

const HOLDER_ID = 'MS-1998-0427';

function makeQrMatrix(text: string) {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserve = (row: number, col: number, value = false) => {
    if (row >= 0 && row < size && col >= 0 && col < size) {
      matrix[row][col] = value;
      reserved[row][col] = true;
    }
  };

  const finder = (top: number, left: number) => {
    for (let row = -1; row <= 7; row += 1) {
      for (let col = -1; col <= 7; col += 1) {
        const r = top + row;
        const c = left + col;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inFinder = row >= 0 && row <= 6 && col >= 0 && col <= 6;
        const dark = inFinder && (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4));
        reserve(r, c, dark);
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) reserve(18 + i - 2, 18 + j - 2, Math.max(Math.abs(i - 2), Math.abs(j - 2)) !== 1);
  }
  for (let i = 8; i < size - 8; i += 1) {
    reserve(6, i, i % 2 === 0);
    reserve(i, 6, i % 2 === 0);
  }

  const bytes = Array.from(new TextEncoder().encode(text));
  const bits: number[] = [];
  const appendBits = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
  };
  appendBits(4, 4);
  appendBits(bytes.length, 8);
  bytes.forEach((byte) => appendBits(byte, 8));
  for (let i = 0; i < 4 && bits.length < 272; i += 1) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((value, bit) => (value << 1) | bit, 0));
  }
  for (let pad = 0; data.length < 34; pad += 1) data.push(pad % 2 === 0 ? 0xec : 0x11);

  const multiply = (x: number, y: number) => {
    let result = 0;
    for (let i = 7; i >= 0; i -= 1) {
      result = (result << 1) ^ ((result >>> 7) * 0x11d);
      result ^= ((y >>> i) & 1) * x;
    }
    return result;
  };
  const generator = [1];
  let root = 1;
  for (let i = 0; i < 10; i += 1) {
    const next = Array(generator.length + 1).fill(0);
    generator.forEach((coefficient, index) => {
      next[index] ^= coefficient;
      next[index + 1] ^= multiply(coefficient, root);
    });
    generator.splice(0, generator.length, ...next);
    root = multiply(root, 2);
  }
  const remainder = Array(10).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ remainder.shift()!;
    remainder.push(0);
    for (let i = 0; i < 10; i += 1) remainder[i] ^= multiply(generator[i + 1], factor);
  });
  const codewords = [...data, ...remainder];
  const payload = codewords.flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >>> (7 - bit)) & 1));

  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let step = 0; step < size; step += 1) {
      const row = upward ? size - 1 - step : step;
      for (let offset = 0; offset < 2; offset += 1) {
        const col = right - offset;
        if (reserved[row][col]) continue;
        const raw = payload[bitIndex++] ?? 0;
        matrix[row][col] = Boolean(raw ^ ((row + col) % 2 === 0 ? 1 : 0));
      }
    }
    upward = !upward;
  }

  const formatData = (1 << 3) | 0;
  let remainderBits = formatData << 10;
  for (let bit = 14; bit >= 10; bit -= 1) {
    if (((remainderBits >>> bit) & 1) !== 0) remainderBits ^= 0x537 << (bit - 10);
  }
  const format = ((formatData << 10) | remainderBits) ^ 0x5412;
  const formatBit = (index: number) => Boolean((format >>> index) & 1);
  for (let i = 0; i <= 5; i += 1) matrix[i][8] = formatBit(i);
  matrix[7][8] = formatBit(6);
  matrix[8][8] = formatBit(7);
  matrix[8][7] = formatBit(8);
  for (let i = 9; i < 15; i += 1) matrix[8][14 - i] = formatBit(i);
  for (let i = 0; i < 8; i += 1) matrix[8][size - 1 - i] = formatBit(i);
  for (let i = 8; i < 15; i += 1) matrix[size - 15 + i][8] = formatBit(i);
  matrix[size - 8][8] = true;
  return matrix;
}

function QrCode() {
  const matrix = useMemo(() => makeQrMatrix(HOLDER_ID), []);
  const modules = matrix.flatMap((row, y) => row.map((dark, x) => dark ? `M${x + 4} ${y + 4}h1v1h-1z` : '').filter(Boolean)).join('');
  return (
    <svg className="vr-qr" viewBox="0 0 33 33" role="img" aria-label={`QR code for holder ${HOLDER_ID}`} shapeRendering="crispEdges">
      <rect width="33" height="33" fill="#f1ebdd" />
      <path d={modules} fill="#16130f" />
    </svg>
  );
}

export default function VintageSneakerVerificationRibbon() {
  return (
    <div className="verification-variant">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=IBM+Plex+Mono:wght@400;500;600&family=Archivo:wght@400;500;600;700&display=swap');
        .verification-variant { min-height:100dvh; position:relative; background:#100e0b; }
        .verification-variant > .min-h-screen { width:calc(100% - 190px); min-height:100dvh; }
        .vr-ribbon {
          position:absolute; z-index:5; top:40px; right:max(48px, calc((100vw - 1306px) / 2)); bottom:40px; width:158px; min-height:0;
          box-sizing:border-box; display:flex; flex-direction:column; align-items:center; padding:18px 12px 16px;
          color:#16130f; border:1px solid #6e1f1c; background-color:#f1ebdd;
          background-image:radial-gradient(ellipse at 20% 0%,rgba(154,123,45,.08),transparent 60%);
          box-shadow:0 24px 60px rgba(0,0,0,.35); font-family:'IBM Plex Mono',monospace;
        }
        .vr-ribbon:before { content:""; position:absolute; left:-1px; top:0; bottom:0; border-left:1px dashed rgba(110,31,28,.65); }
        .vr-title { writing-mode:vertical-rl; transform:rotate(180deg); letter-spacing:.32em; font-size:10px; line-height:1; color:#6e1f1c; margin:0 0 16px; }
        .vr-mark { width:100%; height:1px; background:#16130f; opacity:.75; margin:0 0 15px; }
        .vr-qr-frame { padding:6px; border:1px solid #16130f; background:#f1ebdd; width:100%; }
        .vr-qr { width:100%; height:auto; display:block; }
        .vr-kicker { font-size:7px; letter-spacing:.16em; color:rgba(22,19,15,.62); text-align:center; margin-top:13px; }
        .vr-holder { font-size:9px; line-height:1.5; font-weight:600; text-align:center; overflow-wrap:anywhere; margin-top:4px; }
        .vr-issue { font-size:8px; line-height:1.6; text-align:center; margin-top:14px; padding:7px 0; width:100%; border-top:1px solid rgba(22,19,15,.5); border-bottom:1px solid rgba(22,19,15,.5); letter-spacing:.06em; }
        .vr-micro { font-size:7px; line-height:1.55; letter-spacing:.035em; text-align:center; margin-top:12px; color:rgba(22,19,15,.74); }
        .vr-base { width:100%; margin-top:auto; padding-top:16px; text-align:center; }
        .vr-signature { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:24px; line-height:1; color:#6e1f1c; transform:rotate(-7deg); white-space:nowrap; }
        .vr-sign-line { height:1px; background:#16130f; margin-top:7px; }
        .vr-sign-label { font-size:6.5px; letter-spacing:.1em; line-height:1.5; margin-top:6px; }
        .vr-seal { margin-top:13px; width:28px; height:28px; border:1px solid #6e1f1c; border-radius:50%; color:#6e1f1c; display:grid; place-items:center; font-family:'Cormorant Garamond',serif; font-size:17px; }
        @media (max-width:900px) {
          .verification-variant > .min-h-screen { width:100%; }
          .vr-ribbon { position:relative; top:auto; right:auto; bottom:auto; width:calc(100% - 32px); min-height:0; margin:0 16px 24px; padding:15px; display:grid; grid-template-columns:25px 100px 1fr 1fr; gap:12px; align-items:center; }
          .vr-ribbon:before { top:-5px; left:0; right:0; bottom:auto; border-left:0; border-top:1px dashed rgba(110,31,28,.7); }
          .vr-title { margin:0; grid-column:1; grid-row:1 / span 3; }
          .vr-mark { display:none; }
          .vr-qr-frame { grid-column:2; grid-row:1 / span 3; }
          .vr-kicker,.vr-holder,.vr-issue,.vr-micro { margin:0; text-align:left; }
          .vr-kicker { grid-column:3; grid-row:1; }
          .vr-holder { grid-column:3; grid-row:2; }
          .vr-issue { grid-column:3; grid-row:3; width:auto; padding:4px 0; }
          .vr-micro { grid-column:4; grid-row:1; }
          .vr-base { grid-column:4; grid-row:2 / span 2; margin:0; padding:0; }
          .vr-signature { font-size:20px; }
          .vr-seal { display:none; }
        }
        @media (max-width:560px) {
          .vr-ribbon { grid-template-columns:22px 82px 1fr; gap:9px; }
          .vr-title { font-size:8px; }
          .vr-micro { grid-column:3; grid-row:3; }
          .vr-base { grid-column:3; grid-row:4; text-align:left; }
          .vr-sign-line { max-width:190px; }
          .vr-holder { font-size:8px; }
        }
      `}</style>
      <App />
      <aside className="vr-ribbon" aria-label="Verification certificate stub">
        <div className="vr-title">VERIFICATION</div>
        <div className="vr-mark" />
        <div className="vr-qr-frame"><QrCode /></div>
        <div className="vr-kicker">HOLDER ID</div>
        <div className="vr-holder">{HOLDER_ID}</div>
        <div className="vr-issue">ISSUE N°<br />0427 / 1000</div>
        <div className="vr-micro">Verified by House Appraiser — 2025-12-31</div>
        <div className="vr-base">
          <div className="vr-signature">A. M. Castellane</div>
          <div className="vr-sign-line" />
          <div className="vr-sign-label">REGISTRAR GENERAL</div>
          <div className="vr-seal">M</div>
        </div>
      </aside>
    </div>
  );
}
