/* ══════════════════════════════════════════════════════════════
   DASHBOARD DE VENDAS — app.js
   Dados brutos · gráfico SVG · métricas · produtos · tempo real
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DADOS BRUTOS ───────────────────────────────────────────── */

// Vendas por hora (R$) — hoje e ontem
const SALES_DATA = {
  hoje: [
    { hora: '08:00', valor: 420_000 },
    { hora: '09:00', valor: 680_000 },
    { hora: '10:00', valor: 530_000 },
    { hora: '11:00', valor: 790_000 },
    { hora: '12:00', valor: 940_000 },
    { hora: '13:00', valor: 710_000 },
    { hora: '14:00', valor: 850_000 },
    { hora: '15:00', valor: 1_100_000 },
    { hora: '16:00', valor: 960_000 },
    { hora: '17:00', valor: 770_000 },
  ],
  ontem: [
    { hora: '08:00', valor: 380_000 },
    { hora: '09:00', valor: 510_000 },
    { hora: '10:00', valor: 490_000 },
    { hora: '11:00', valor: 620_000 },
    { hora: '12:00', valor: 700_000 },
    { hora: '13:00', valor: 580_000 },
    { hora: '14:00', valor: 640_000 },
    { hora: '15:00', valor: 820_000 },
    { hora: '16:00', valor: 750_000 },
    { hora: '17:00', valor: 610_000 },
  ],
};

// Métricas por período
const METRICS = {
  hoje: {
    visitas:     { valor: 142_830, delta: '+8,4%' },
    compradores: { valor: 38_274,  delta: '+5,2%' },
    vendas:      { valor: 9_412,   delta: '+12,1%' },
    conversao:   { valor: '6,59%', delta: '-0,3%', neg: true },
    unidades:    { valor: 18_847,  delta: '+9,7%' },
    preco:       { valor: 928.40,  delta: '-1,2%', neg: true },
  },
  semana: {
    visitas:     { valor: 892_100, delta: '+6,1%' },
    compradores: { valor: 241_390, delta: '+4,8%' },
    vendas:      { valor: 58_022,  delta: '+10,3%' },
    conversao:   { valor: '6,50%', delta: '-0,5%', neg: true },
    unidades:    { valor: 114_700, delta: '+8,0%' },
    preco:       { valor: 945.00,  delta: '+0,8%' },
  },
  mes: {
    visitas:     { valor: 3_820_400, delta: '+11,2%' },
    compradores: { valor: 1_027_800, delta: '+9,4%' },
    vendas:      { valor: 248_610,   delta: '+15,7%' },
    conversao:   { valor: '6,51%',   delta: '+0,1%' },
    unidades:    { valor: 492_300,   delta: '+13,5%' },
    preco:       { valor: 903.20,    delta: '-2,1%', neg: true },
  },
};

// Total de vendas (R$) por período
const TOTALS = { hoje: 8_750_000, semana: 54_620_000, mes: 234_400_000 };

// Gráfico por período (multiplica dados base)
const CHART_MULTIPLIERS = { hoje: 1, semana: 6.2, mes: 26.8 };

// Produtos mais vendidos
const PRODUCTS = [
  { nome: 'Smartphone Galaxy A54', categoria: 'Eletrônicos', unidades: 1_842, receita: 2_763_000, icon: 'phone' },
  { nome: 'Tênis Nike Air Max 270', categoria: 'Esportes',    unidades: 1_204, receita: 602_000,   icon: 'shoe' },
  { nome: 'Fone Bluetooth JBL',     categoria: 'Eletrônicos', unidades: 987,   receita: 296_100,   icon: 'headphone' },
  { nome: 'Câmera Canon EOS R50',   categoria: 'Eletrônicos', unidades: 412,   receita: 1_648_000, icon: 'camera' },
  { nome: 'Mochila Samsonite 25L',  categoria: 'Acessórios',  unidades: 730,   receita: 182_500,   icon: 'bag' },
];

/* ── ESTADO ─────────────────────────────────────────────────── */
const state = {
  period: 'hoje',
  totalTarget: TOTALS.hoje,
  totalCurrent: 0,
};

/* ── HELPERS ────────────────────────────────────────────────── */
const fmt = {
  brl:  v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  brlK: v => v >= 1_000_000
    ? 'R$ ' + (v / 1_000_000).toFixed(1).replace('.', ',') + 'M'
    : 'R$ ' + (v / 1_000).toFixed(0) + 'K',
  num:  v => Number(v).toLocaleString('pt-BR'),
  pct:  v => typeof v === 'string' ? v : v.toFixed(2).replace('.', ',') + '%',
};

/* ── DOM REFS ───────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const els = {
  heroDate:     $('hero-date'),
  totalVal:     $('total-value'),
  mVisitas:     $('m-visitas'),     dVisitas:     $('d-visitas'),
  mCompradores: $('m-compradores'), dCompradores: $('d-compradores'),
  mVendas:      $('m-vendas'),      dVendas:      $('d-vendas'),
  mConversao:   $('m-conversao'),   dConversao:   $('d-conversao'),
  mUnidades:    $('m-unidades'),    dUnidades:    $('d-unidades'),
  mPreco:       $('m-preco'),       dPreco:       $('d-preco'),
  chart:        $('sales-chart'),
  chartY:       $('chart-y-labels'),
  chartX:       $('chart-x-labels'),
  tooltip:      $('chart-tooltip'),
  productsList: $('products-list'),
  filterCount:  $('filter-count'),
  periodTabs:   document.querySelectorAll('.period-tab'),
};

/* ══════════════════════════════════════════════════════════════
   RELÓGIO / DATA
   ══════════════════════════════════════════════════════════════ */
function updateClock() {
  const now  = new Date();
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  els.heroDate.textContent   = `${date}, ${time}`;
  els.heroDate.setAttribute('datetime', now.toISOString());
}

/* ══════════════════════════════════════════════════════════════
   ANIMAÇÃO DO CONTADOR (total de vendas)
   ══════════════════════════════════════════════════════════════ */
function animateCounter(target) {
  const start    = state.totalCurrent;
  const duration = 800;
  const startTs  = performance.now();

  function step(ts) {
    const progress = Math.min((ts - startTs) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current  = Math.round(start + (target - start) * ease);

    els.totalVal.textContent = current.toLocaleString('pt-BR');

    if (progress < 1) requestAnimationFrame(step);
    else state.totalCurrent = target;
  }

  requestAnimationFrame(step);
}

/* ══════════════════════════════════════════════════════════════
   MÉTRICAS
   ══════════════════════════════════════════════════════════════ */
function renderMetrics() {
  const m = METRICS[state.period];

  const fmt_metric = (val, key) => {
    if (key === 'conversao') return m.conversao.valor;
    if (key === 'preco')     return 'R$ ' + Number(m.preco.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return fmt.num(val);
  };

  const pairs = [
    ['mVisitas',     'dVisitas',     'visitas'],
    ['mCompradores', 'dCompradores', 'compradores'],
    ['mVendas',      'dVendas',      'vendas'],
    ['mConversao',   'dConversao',   'conversao'],
    ['mUnidades',    'dUnidades',    'unidades'],
    ['mPreco',       'dPreco',       'preco'],
  ];

  pairs.forEach(([valId, deltaId, key]) => {
    const item      = m[key];
    const valEl     = els[valId];
    const deltaEl   = els[deltaId];

    valEl.textContent   = fmt_metric(item.valor, key);
    deltaEl.textContent = item.delta;
    deltaEl.className   = 'metric-delta ' + (item.neg ? 'negative' : 'positive');
  });
}

/* ══════════════════════════════════════════════════════════════
   GRÁFICO SVG
   ══════════════════════════════════════════════════════════════ */
const SVG_NS = 'http://www.w3.org/2000/svg';

function buildPath(points, w, h, padX, padY) {
  const xs = points.map((_, i) => padX + (i / (points.length - 1)) * (w - padX * 2));
  const max = Math.max(...points) * 1.1;
  const ys  = points.map(v => h - padY - (v / max) * (h - padY * 2));

  // Curva suave (Bezier)
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return { d, xs, ys, max };
}

function renderChart() {
  const svg     = els.chart;
  const mult    = CHART_MULTIPLIERS[state.period];
  const todayPts  = SALES_DATA.hoje.map(p => p.valor * mult);
  const yesterPts = SALES_DATA.ontem.map(p => p.valor * mult);
  const horas     = SALES_DATA.hoje.map(p => p.hora);

  svg.innerHTML = '';

  // Aguarda layout para obter dimensões reais
  requestAnimationFrame(() => {
    const rect = svg.getBoundingClientRect();
    const W = rect.width  || 400;
    const H = rect.height || 200;
    const padX = 8, padY = 12;

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const today  = buildPath(todayPts, W, H, padX, padY);
    const yester = buildPath(yesterPts, W, H, padX, padY);
    const maxVal = Math.max(...todayPts, ...yesterPts) * 1.1;

    // ── Linhas de grade ──
    const gridLevels = 4;
    els.chartY.innerHTML = '';
    for (let i = 0; i <= gridLevels; i++) {
      const y    = padY + (i / gridLevels) * (H - padY * 2);
      const val  = maxVal * (1 - i / gridLevels);

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', padX); line.setAttribute('x2', W - padX);
      line.setAttribute('y1', y);    line.setAttribute('y2', y);
      line.classList.add('grid-line');
      svg.appendChild(line);

      const lbl = document.createElement('span');
      lbl.textContent = fmt.brlK(val);
      els.chartY.appendChild(lbl);
    }

    // ── Labels do eixo X ──
    els.chartX.innerHTML = '';
    horas.forEach(h => {
      const sp = document.createElement('span');
      sp.textContent = h;
      els.chartX.appendChild(sp);
    });

    // ── Área preenchida (hoje) ──
    const areaPath = `${today.d} L ${today.xs[today.xs.length - 1]} ${H} L ${today.xs[0]} ${H} Z`;
    const gradId   = 'grad-today';

    const defs = document.createElementNS(SVG_NS, 'defs');
    const grad = document.createElementNS(SVG_NS, 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0'); grad.setAttribute('x2', '0');
    grad.setAttribute('y1', '0'); grad.setAttribute('y2', '1');

    const s1 = document.createElementNS(SVG_NS, 'stop');
    s1.setAttribute('offset', '0%');
    s1.setAttribute('stop-color', '#3483FA');
    s1.setAttribute('stop-opacity', '0.18');

    const s2 = document.createElementNS(SVG_NS, 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', '#3483FA');
    s2.setAttribute('stop-opacity', '0');

    grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad);
    svg.appendChild(defs);

    const area = document.createElementNS(SVG_NS, 'path');
    area.setAttribute('d', areaPath);
    area.setAttribute('fill', `url(#${gradId})`);
    svg.appendChild(area);

    // ── Linha ontem ──
    const lineY = document.createElementNS(SVG_NS, 'path');
    lineY.setAttribute('d', yester.d);
    lineY.setAttribute('fill', 'none');
    lineY.setAttribute('stroke', '#E04040');
    lineY.setAttribute('stroke-width', '1.8');
    lineY.setAttribute('stroke-dasharray', '5 4');
    lineY.setAttribute('stroke-linecap', 'round');
    svg.appendChild(lineY);

    // ── Linha hoje ──
    const lineT = document.createElementNS(SVG_NS, 'path');
    lineT.setAttribute('d', today.d);
    lineT.setAttribute('fill', 'none');
    lineT.setAttribute('stroke', '#3483FA');
    lineT.setAttribute('stroke-width', '2.5');
    lineT.setAttribute('stroke-linecap', 'round');
    lineT.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(lineT);

    // ── Pontos interativos ──
    today.xs.forEach((x, i) => {
      const y    = today.ys[i];
      const hora = horas[i];
      const val  = todayPts[i];

      // Círculo de hover (área invisível maior)
      const hit = document.createElementNS(SVG_NS, 'circle');
      hit.setAttribute('cx', x); hit.setAttribute('cy', y);
      hit.setAttribute('r', '12');
      hit.setAttribute('fill', 'transparent');
      hit.style.cursor = 'pointer';

      hit.addEventListener('mouseenter', e => {
        showTooltip(x, y, `${hora} — ${fmt.brl(val)}`);
        dot.setAttribute('r', '5');
      });
      hit.addEventListener('mouseleave', () => {
        hideTooltip();
        dot.setAttribute('r', '3.5');
      });

      // Ponto visível
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', '#3483FA');
      dot.setAttribute('stroke', '#fff');
      dot.setAttribute('stroke-width', '1.5');

      svg.appendChild(dot);
      svg.appendChild(hit);
    });
  });
}

function showTooltip(x, y, text) {
  const container = els.chart.parentElement;
  const rect      = els.chart.getBoundingClientRect();
  const cRect     = container.getBoundingClientRect();
  const svgRect   = els.chart.getBoundingClientRect();

  // Converte coordenadas SVG → CSS relativo ao container
  const vb    = els.chart.viewBox.baseVal;
  const scaleX = svgRect.width  / (vb.width  || svgRect.width);
  const scaleY = svgRect.height / (vb.height || svgRect.height);

  const left = (svgRect.left - cRect.left) + x * scaleX;
  const top  = (svgRect.top  - cRect.top)  + y * scaleY;

  els.tooltip.textContent = text;
  els.tooltip.style.left  = left + 'px';
  els.tooltip.style.top   = top  + 'px';
  els.tooltip.classList.add('visible');
  els.tooltip.removeAttribute('aria-hidden');
}

function hideTooltip() {
  els.tooltip.classList.remove('visible');
  els.tooltip.setAttribute('aria-hidden', 'true');
}

/* ══════════════════════════════════════════════════════════════
   PRODUTOS MAIS VENDIDOS
   ══════════════════════════════════════════════════════════════ */

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="2"/></svg>`,
  shoe:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 18h1.5l2-7h15l1 4H4.5"/><path d="M6 11l2-7"/></svg>`,
  headphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  bag:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
};

function renderProducts() {
  const list    = els.productsList;
  list.innerHTML = '';
  const maxRec  = Math.max(...PRODUCTS.map(p => p.receita));
  const mult    = CHART_MULTIPLIERS[state.period];

  PRODUCTS.forEach((prod, i) => {
    const receita = prod.receita * mult;
    const fill    = ((prod.receita / maxRec) * 100).toFixed(1);

    const li = document.createElement('li');
    li.className = 'product-item';
    li.innerHTML = `
      <span class="product-rank">${i + 1}</span>
      <figure class="product-thumb">${ICONS[prod.icon] || ''}</figure>
      <div class="product-info">
        <p class="product-name">${prod.nome}</p>
        <p class="product-units">${fmt.num(prod.unidades * mult | 0)} unidades · ${prod.categoria}</p>
      </div>
      <span class="product-revenue">${fmt.brlK(receita)}</span>
      <div class="product-bar-wrap" style="grid-column:2/-1">
        <div class="product-bar" style="width:${fill}%"></div>
      </div>
    `;
    list.appendChild(li);
  });
}

/* ══════════════════════════════════════════════════════════════
   MUDANÇA DE PERÍODO
   ══════════════════════════════════════════════════════════════ */
function setPeriod(period) {
  state.period = period;

  els.periodTabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });

  animateCounter(TOTALS[period]);
  renderMetrics();
  renderChart();
  renderProducts();
}

/* ══════════════════════════════════════════════════════════════
   SIMULAÇÃO "AO VIVO" — incrementa o total a cada 8s
   ══════════════════════════════════════════════════════════════ */
function startLiveUpdates() {
  setInterval(() => {
    if (state.period !== 'hoje') return;
    const increment = Math.floor(Math.random() * 80_000) + 10_000;
    state.totalCurrent += increment;
    animateCounter(state.totalCurrent);
  }, 8_000);
}

/* ══════════════════════════════════════════════════════════════
   EVENTOS
   ══════════════════════════════════════════════════════════════ */
document.getElementById('period-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.period-tab');
  if (tab) setPeriod(tab.dataset.period);
});

document.getElementById('btn-expand').addEventListener('click', () => {
  // Placeholder para modal/fullscreen futuro
  console.info('Expandir dashboard');
});

/* Redimensionamento — redesenha o gráfico SVG */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderChart, 120);
});

/* ══════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ══════════════════════════════════════════════════════════════ */
function init() {
  updateClock();
  setInterval(updateClock, 1_000);

  state.totalCurrent = TOTALS.hoje;
  els.totalVal.textContent = TOTALS.hoje.toLocaleString('pt-BR');

  renderMetrics();
  renderProducts();

  // Gráfico precisa do layout pronto
  requestAnimationFrame(() => {
    requestAnimationFrame(renderChart);
  });

  startLiveUpdates();
}

init();