/* ══════════════════════════════════════════════════════════════
   DASHBOARD DE VENDAS — app.js
   Dados brutos · gráfico SVG · métricas · produtos · tempo real
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DADOS DO GRÁFICO POR PERÍODO ───────────────────────────── */
// Cada período tem seus próprios pontos — série "atual" e "anterior"
const CHART_DATA = {
  hoje: {
    labelEixoX: 'Horário',
    labelSerie1: 'Hoje',
    labelSerie2: 'Ontem',
    serie1: [
      { label: '08h', valor: 420_000 },
      { label: '09h', valor: 680_000 },
      { label: '10h', valor: 530_000 },
      { label: '11h', valor: 790_000 },
      { label: '12h', valor: 940_000 },
      { label: '13h', valor: 710_000 },
      { label: '14h', valor: 850_000 },
      { label: '15h', valor: 1_100_000 },
      { label: '16h', valor: 960_000 },
      { label: '17h', valor: 770_000 },
    ],
    serie2: [
      { label: '08h', valor: 380_000 },
      { label: '09h', valor: 510_000 },
      { label: '10h', valor: 490_000 },
      { label: '11h', valor: 620_000 },
      { label: '12h', valor: 700_000 },
      { label: '13h', valor: 580_000 },
      { label: '14h', valor: 640_000 },
      { label: '15h', valor: 820_000 },
      { label: '16h', valor: 750_000 },
      { label: '17h', valor: 610_000 },
    ],
  },
  semana: {
    labelEixoX: 'Dia',
    labelSerie1: 'Esta semana',
    labelSerie2: 'Semana passada',
    serie1: [
      { label: 'Seg', valor: 6_800_000 },
      { label: 'Ter', valor: 7_400_000 },
      { label: 'Qua', valor: 9_100_000 },
      { label: 'Qui', valor: 8_300_000 },
      { label: 'Sex', valor: 11_200_000 },
      { label: 'Sáb', valor: 7_600_000 },
      { label: 'Dom', valor: 4_220_000 },
    ],
    serie2: [
      { label: 'Seg', valor: 5_900_000 },
      { label: 'Ter', valor: 6_700_000 },
      { label: 'Qua', valor: 8_200_000 },
      { label: 'Qui', valor: 7_800_000 },
      { label: 'Sex', valor: 10_100_000 },
      { label: 'Sáb', valor: 6_900_000 },
      { label: 'Dom', valor: 3_800_000 },
    ],
  },
  mes: {
    labelEixoX: 'Semana',
    labelSerie1: 'Este mês',
    labelSerie2: 'Mês passado',
    serie1: [
      { label: 'S1',  valor: 52_000_000 },
      { label: 'S2',  valor: 61_000_000 },
      { label: 'S3',  valor: 58_000_000 },
      { label: 'S4',  valor: 63_400_000 },
    ],
    serie2: [
      { label: 'S1',  valor: 44_000_000 },
      { label: 'S2',  valor: 53_000_000 },
      { label: 'S3',  valor: 51_000_000 },
      { label: 'S4',  valor: 55_000_000 },
    ],
  },
};

/* ── MÉTRICAS POR PERÍODO ───────────────────────────────────── */
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

/* ── TOTAIS E PRODUTOS ──────────────────────────────────────── */
const TOTALS = { hoje: 8_750_000, semana: 54_620_000, mes: 234_400_000 };

const PRODUCTS = {
  hoje: [
    { nome: 'Smartphone Galaxy A54', categoria: 'Eletrônicos', unidades: 1_842, receita: 2_763_000, icon: 'phone' },
    { nome: 'Tênis Nike Air Max 270', categoria: 'Esportes',   unidades: 1_204, receita: 602_000,   icon: 'shoe' },
    { nome: 'Fone Bluetooth JBL',    categoria: 'Eletrônicos', unidades: 987,   receita: 296_100,   icon: 'headphone' },
    { nome: 'Câmera Canon EOS R50',  categoria: 'Eletrônicos', unidades: 412,   receita: 1_648_000, icon: 'camera' },
    { nome: 'Mochila Samsonite 25L', categoria: 'Acessórios',  unidades: 730,   receita: 182_500,   icon: 'bag' },
  ],
  semana: [
    { nome: 'Smartphone Galaxy A54', categoria: 'Eletrônicos', unidades: 11_430, receita: 17_145_000, icon: 'phone' },
    { nome: 'Câmera Canon EOS R50',  categoria: 'Eletrônicos', unidades: 2_890,  receita: 11_560_000, icon: 'camera' },
    { nome: 'Tênis Nike Air Max 270', categoria: 'Esportes',   unidades: 8_200,  receita: 4_100_000,  icon: 'shoe' },
    { nome: 'Fone Bluetooth JBL',    categoria: 'Eletrônicos', unidades: 6_540,  receita: 1_962_000,  icon: 'headphone' },
    { nome: 'Mochila Samsonite 25L', categoria: 'Acessórios',  unidades: 4_810,  receita: 1_202_500,  icon: 'bag' },
  ],
  mes: [
    { nome: 'Smartphone Galaxy A54', categoria: 'Eletrônicos', unidades: 48_200, receita: 72_300_000, icon: 'phone' },
    { nome: 'Câmera Canon EOS R50',  categoria: 'Eletrônicos', unidades: 12_100, receita: 48_400_000, icon: 'camera' },
    { nome: 'Tênis Nike Air Max 270', categoria: 'Esportes',   unidades: 34_700, receita: 17_350_000, icon: 'shoe' },
    { nome: 'Fone Bluetooth JBL',    categoria: 'Eletrônicos', unidades: 27_400, receita: 8_220_000,  icon: 'headphone' },
    { nome: 'Mochila Samsonite 25L', categoria: 'Acessórios',  unidades: 20_300, receita: 5_075_000,  icon: 'bag' },
  ],
};

/* ── ESTADO ─────────────────────────────────────────────────── */
const state = {
  period: 'hoje',
  totalCurrent: 0,
};

/* ── HELPERS ────────────────────────────────────────────────── */
const fmt = {
  brl:  v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  brlK: v => v >= 1_000_000_000
    ? 'R$ ' + (v / 1_000_000_000).toFixed(2).replace('.', ',') + 'Bi'
    : v >= 1_000_000
    ? 'R$ ' + (v / 1_000_000).toFixed(1).replace('.', ',') + 'M'
    : 'R$ ' + (v / 1_000).toFixed(0) + 'K',
  num: v => Number(v).toLocaleString('pt-BR'),
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
  chartLegend:  $('chart-legend'),
  productsList: $('products-list'),
  periodTabs:   document.querySelectorAll('.period-tab'),
};

/* ══════════════════════════════════════════════════════════════
   RELÓGIO / DATA
   ══════════════════════════════════════════════════════════════ */
function updateClock() {
  const now  = new Date();
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  els.heroDate.textContent = `${date}, ${time}`;
  els.heroDate.setAttribute('datetime', now.toISOString());
}

/* ══════════════════════════════════════════════════════════════
   CONTADOR ANIMADO
   ══════════════════════════════════════════════════════════════ */
function animateCounter(target) {
  const start    = state.totalCurrent;
  const duration = 700;
  const startTs  = performance.now();

  function step(ts) {
    const progress = Math.min((ts - startTs) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
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

  const fmtVal = (item, key) => {
    if (key === 'conversao') return item.valor;
    if (key === 'preco')     return 'R$ ' + Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return fmt.num(item.valor);
  };

  [
    ['mVisitas',     'dVisitas',     'visitas'],
    ['mCompradores', 'dCompradores', 'compradores'],
    ['mVendas',      'dVendas',      'vendas'],
    ['mConversao',   'dConversao',   'conversao'],
    ['mUnidades',    'dUnidades',    'unidades'],
    ['mPreco',       'dPreco',       'preco'],
  ].forEach(([valId, deltaId, key]) => {
    const item = m[key];
    els[valId].textContent   = fmtVal(item, key);
    els[deltaId].textContent = item.delta;
    els[deltaId].className   = 'metric-delta ' + (item.neg ? 'negative' : 'positive');
  });
}

/* ══════════════════════════════════════════════════════════════
   GRÁFICO SVG
   ══════════════════════════════════════════════════════════════ */
const SVG_NS = 'http://www.w3.org/2000/svg';

// Constrói o path SVG com curva suave a partir de pontos e escala unificada
function buildPath(values, maxVal, W, H, padX, padY) {
  const n  = values.length;
  const xs = values.map((_, i) => padX + (i / (n - 1)) * (W - padX * 2));
  const ys = values.map(v => padY + (1 - v / maxVal) * (H - padY * 2));

  let d = `M ${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
  for (let i = 1; i < n; i++) {
    const cpx = ((xs[i - 1] + xs[i]) / 2).toFixed(2);
    d += ` C ${cpx} ${ys[i - 1].toFixed(2)}, ${cpx} ${ys[i].toFixed(2)}, ${xs[i].toFixed(2)} ${ys[i].toFixed(2)}`;
  }
  return { d, xs, ys };
}

function renderChart() {
  const svg = els.chart;
  svg.innerHTML = '';

  const period  = state.period;              // captura o período no momento da chamada
  const data    = CHART_DATA[period];
  const pts1    = data.serie1.map(p => p.valor);
  const pts2    = data.serie2.map(p => p.valor);
  const labels  = data.serie1.map(p => p.label);

  // ── Escala unificada para as duas séries ──
  const maxVal = Math.max(...pts1, ...pts2) * 1.15;

  // Atualiza legenda com os nomes corretos do período
  els.chartLegend.innerHTML = `
    <span class="legend-dot today"></span><span>${data.labelSerie1}</span>
    <span class="legend-dot yesterday"></span><span>${data.labelSerie2}</span>
  `;

  // Aguarda o SVG ter dimensões reais no DOM
  requestAnimationFrame(() => {
    const rect = svg.getBoundingClientRect();
    const W    = rect.width  || 400;
    const H    = rect.height || 180;
    const padX = 8, padY = 10;

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const path1 = buildPath(pts1, maxVal, W, H, padX, padY);
    const path2 = buildPath(pts2, maxVal, W, H, padX, padY);

    // ── Labels eixo Y ──
    const gridLevels = 4;
    els.chartY.innerHTML = '';
    for (let i = 0; i <= gridLevels; i++) {
      const ratio = 1 - i / gridLevels;
      const y     = padY + (i / gridLevels) * (H - padY * 2);
      const val   = maxVal * ratio;

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', padX); line.setAttribute('x2', W - padX);
      line.setAttribute('y1', y.toFixed(2));
      line.setAttribute('y2', y.toFixed(2));
      line.classList.add('grid-line');
      svg.appendChild(line);

      const lbl = document.createElement('span');
      lbl.textContent = fmt.brlK(val);
      els.chartY.appendChild(lbl);
    }

    // ── Labels eixo X ──
    els.chartX.innerHTML = '';
    labels.forEach(l => {
      const sp = document.createElement('span');
      sp.textContent = l;
      els.chartX.appendChild(sp);
    });

    // ── Gradiente ──
    const gradId = 'grad-serie1';
    const defs   = document.createElementNS(SVG_NS, 'defs');
    const grad   = document.createElementNS(SVG_NS, 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0'); grad.setAttribute('x2', '0');
    grad.setAttribute('y1', '0'); grad.setAttribute('y2', '1');
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('y1', '0'); grad.setAttribute('y2', String(H));

    [['0%', '0.16'], ['100%', '0']].forEach(([offset, opacity]) => {
      const stop = document.createElementNS(SVG_NS, 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', '#3483FA');
      stop.setAttribute('stop-opacity', opacity);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    // ── Área preenchida série 1 ──
    const lastX = path1.xs[path1.xs.length - 1];
    const area  = document.createElementNS(SVG_NS, 'path');
    area.setAttribute('d', `${path1.d} L ${lastX.toFixed(2)} ${H} L ${padX} ${H} Z`);
    area.setAttribute('fill', `url(#${gradId})`);
    svg.appendChild(area);

    // ── Linha série 2 (anterior) ──
    const line2 = document.createElementNS(SVG_NS, 'path');
    line2.setAttribute('d', path2.d);
    line2.setAttribute('fill', 'none');
    line2.setAttribute('stroke', '#E04040');
    line2.setAttribute('stroke-width', '1.8');
    line2.setAttribute('stroke-dasharray', '5 4');
    line2.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line2);

    // ── Linha série 1 (atual) ──
    const line1 = document.createElementNS(SVG_NS, 'path');
    line1.setAttribute('d', path1.d);
    line1.setAttribute('fill', 'none');
    line1.setAttribute('stroke', '#3483FA');
    line1.setAttribute('stroke-width', '2.5');
    line1.setAttribute('stroke-linecap', 'round');
    line1.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(line1);

    // ── Pontos interativos série 1 ──
    path1.xs.forEach((x, i) => {
      const y   = path1.ys[i];
      const lbl = labels[i];
      const val = pts1[i];

      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', x.toFixed(2));
      dot.setAttribute('cy', y.toFixed(2));
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', '#3483FA');
      dot.setAttribute('stroke', '#fff');
      dot.setAttribute('stroke-width', '1.5');
      svg.appendChild(dot);

      // Área de hit maior (invisível)
      const hit = document.createElementNS(SVG_NS, 'circle');
      hit.setAttribute('cx', x.toFixed(2));
      hit.setAttribute('cy', y.toFixed(2));
      hit.setAttribute('r', '14');
      hit.setAttribute('fill', 'transparent');
      hit.style.cursor = 'pointer';

      hit.addEventListener('mouseenter', () => {
        dot.setAttribute('r', '5');
        showTooltip(x, y, W, H, `${lbl}: ${fmt.brl(val)}`);
      });
      hit.addEventListener('mouseleave', () => {
        dot.setAttribute('r', '3.5');
        hideTooltip();
      });
      svg.appendChild(hit);
    });
  });
}

function showTooltip(svgX, svgY, svgW, svgH, text) {
  const svgRect = els.chart.getBoundingClientRect();
  const cRect   = els.chart.parentElement.getBoundingClientRect();

  // Escala coordenada SVG → pixel da tela
  const scaleX = svgRect.width  / svgW;
  const scaleY = svgRect.height / svgH;

  const left = (svgRect.left - cRect.left) + svgX * scaleX;
  const top  = (svgRect.top  - cRect.top)  + svgY * scaleY;

  els.tooltip.textContent = text;
  els.tooltip.style.left  = `${left}px`;
  els.tooltip.style.top   = `${top}px`;
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
  phone:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="2"/></svg>`,
  shoe:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 18h1.5l2-7h15l1 4H4.5"/><path d="M6 11l2-7"/></svg>`,
  headphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
  camera:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  bag:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
};

function renderProducts() {
  const list  = els.productsList;
  list.innerHTML = '';

  const prods  = PRODUCTS[state.period];
  const maxRec = Math.max(...prods.map(p => p.receita));

  prods.forEach((prod, i) => {
    const fill = ((prod.receita / maxRec) * 100).toFixed(1);
    const li   = document.createElement('li');
    li.className = 'product-item';
    li.innerHTML = `
      <span class="product-rank">${i + 1}</span>
      <figure class="product-thumb">${ICONS[prod.icon] || ''}</figure>
      <div class="product-info">
        <p class="product-name">${prod.nome}</p>
        <p class="product-units">${fmt.num(prod.unidades)} unidades · ${prod.categoria}</p>
      </div>
      <span class="product-revenue">${fmt.brlK(prod.receita)}</span>
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

  // Tabs
  els.periodTabs.forEach(btn =>
    btn.classList.toggle('active', btn.dataset.period === period)
  );

  // Atualiza tudo com os dados do novo período
  animateCounter(TOTALS[period]);
  renderMetrics();
  renderProducts();
  renderChart();       // redesenha com CHART_DATA[period]
}

/* ══════════════════════════════════════════════════════════════
   SIMULAÇÃO AO VIVO — incrementa total a cada 8s (só em "hoje")
   ══════════════════════════════════════════════════════════════ */
function startLiveUpdates() {
  setInterval(() => {
    if (state.period !== 'hoje') return;
    const inc = Math.floor(Math.random() * 80_000) + 10_000;
    state.totalCurrent += inc;
    animateCounter(state.totalCurrent);
  }, 8_000);
}

/* ══════════════════════════════════════════════════════════════
   EVENTOS
   ══════════════════════════════════════════════════════════════ */
document.getElementById('period-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.period-tab');
  if (tab && tab.dataset.period !== state.period) setPeriod(tab.dataset.period);
});

document.getElementById('btn-expand').addEventListener('click', () => {
  console.info('Expandir dashboard — a implementar');
});

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

  // Gráfico precisa do layout pintado para ter dimensões reais
  requestAnimationFrame(() => requestAnimationFrame(renderChart));

  startLiveUpdates();
}

init();