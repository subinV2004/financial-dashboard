/* ═══════════════════════════════════════════════════════════
   POCKET PILOT — Chart Renderer (Canvas API)
═══════════════════════════════════════════════════════════ */

const Charts = {

  /* ── Colour helpers ──────────────────────────────────── */
  colors: {
    green:  '#10b981',
    red:    '#ef4444',
    blue:   '#4f8ef7',
    violet: '#8b5cf6',
    gold:   '#f59e0b',
  },

  /* ── Main Line Chart: Income vs Expense ─────────────── */
  drawMainChart(canvasId, months, incomeData, expenseData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;

    ctx.clearRect(0, 0, W, H);

    const pad = { top: 20, right: 20, bottom: 40, left: 55 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top  - pad.bottom;

    const allVals = [...incomeData, ...expenseData].filter(v => v > 0);
    const maxVal  = allVals.length ? Math.max(...allVals) * 1.15 : 100000;
    const steps   = 5;

    /* Grid lines + Y labels */
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 1;
    ctx.font        = '11px Inter';
    ctx.fillStyle   = '#5a6a8a';
    ctx.textAlign   = 'right';

    for (let i = 0; i <= steps; i++) {
      const y = pad.top + cH - (i / steps) * cH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + cW, y);
      ctx.stroke();
      const label = this._formatK(maxVal * i / steps);
      ctx.fillText(label, pad.left - 8, y + 4);
    }

    /* X labels */
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5a6a8a';
    months.forEach((m, i) => {
      const x = pad.left + (i / (months.length - 1)) * cW;
      ctx.fillText(m, x, H - pad.bottom + 20);
    });

    /* Draw a smooth line */
    const drawLine = (data, color, gradTop, gradBot) => {
      if (!data.length) return;
      const points = data.map((v, i) => ({
        x: pad.left + (i / (data.length - 1)) * cW,
        y: pad.top  + cH - (v / maxVal) * cH,
      }));

      /* Gradient fill */
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
      grad.addColorStop(0,   gradTop);
      grad.addColorStop(1,   gradBot);

      ctx.beginPath();
      this._smoothCurve(ctx, points);
      ctx.lineTo(points[points.length-1].x, pad.top + cH);
      ctx.lineTo(points[0].x, pad.top + cH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      /* Line */
      ctx.beginPath();
      this._smoothCurve(ctx, points);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.lineJoin    = 'round';
      ctx.stroke();

      /* Dots */
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle   = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(8,12,24,0.8)';
        ctx.lineWidth   = 2;
        ctx.stroke();
      });
    };

    drawLine(expenseData, this.colors.red,   'rgba(239,68,68,0.25)',  'rgba(239,68,68,0.02)');
    drawLine(incomeData,  this.colors.green,  'rgba(16,185,129,0.25)', 'rgba(16,185,129,0.02)');
  },

  _smoothCurve(ctx, pts) {
    if (pts.length < 2) return;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < pts.length - 1; i++) {
      const cpX = (pts[i].x + pts[i+1].x) / 2;
      ctx.bezierCurveTo(cpX, pts[i].y, cpX, pts[i+1].y, pts[i+1].x, pts[i+1].y);
    }
  },

  _formatK(val) {
    if (val >= 100000) return '₹' + (val/100000).toFixed(1) + 'L';
    if (val >= 1000)   return '₹' + (val/1000).toFixed(0) + 'K';
    return '₹' + val.toFixed(0);
  },

  /* ── Sparkline ───────────────────────────────────────── */
  drawSparkline(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const max = Math.max(...data) || 1;
    const min = Math.min(...data);
    const range = max - min || 1;

    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * W,
      y: H - ((v - min) / range) * H * 0.8 - H * 0.1,
    }));

    /* Fill */
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '55');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    this._smoothCurve(ctx, pts);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    this._smoothCurve(ctx, pts);
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  },

  /* ── Donut Chart ─────────────────────────────────────── */
  drawDonut(canvasId, data, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2;
    const r  = Math.min(W, H) / 2 - 10;
    const ir = r * 0.6;
    ctx.clearRect(0, 0, W, H);

    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return;

    let angle = -Math.PI / 2;
    data.forEach((seg, i) => {
      const slice = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      angle += slice;
    });

    /* Inner hole */
    ctx.beginPath();
    ctx.arc(cx, cy, ir, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-2');
    ctx.fill();
  },

  /* ── Health Gauge ────────────────────────────────────── */
  drawGauge(canvasId, score) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H - 5;
    const r  = Math.min(W/2, H) - 10;
    ctx.clearRect(0, 0, W, H);

    /* Background track */
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    /* Color based on score */
    const color = score > 80 ? '#00c87a' : score > 50 ? '#f5a623' : '#ff4d6d';

    /* Value track */
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + (score/100) * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};
