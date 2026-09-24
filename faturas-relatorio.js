/* =========================================================
   Faturas ARCA – Menu e Relatório A4 para o contabilista
   (carregado depois do script principal de faturas.html)
   ========================================================= */
(function () {
  const LIB_PDF = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
  const LIB_TAB = 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';
  const ORDINAL = ['1.º', '2.º', '3.º', '4.º'];
  const RGB = { t1: [18, 164, 217], t2: [34, 181, 115], t3: [245, 166, 35], t4: [230, 69, 122], arca: [30, 79, 184], ink: [22, 33, 62] };
  const TRGB = [RGB.t1, RGB.t2, RGB.t3, RGB.t4];

  /* ---------- estilos ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .menu-top{background:var(--arca);color:#fff;border-radius:var(--r-m);padding:18px;margin-bottom:14px;display:flex;gap:14px;align-items:center;width:100%;border:0;text-align:left;position:relative;overflow:hidden}
  .menu-top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,var(--t1) 0 25%,var(--t2) 25% 50%,var(--t3) 50% 75%,var(--t4) 75%)}
  .menu-top .ic{flex:none;width:54px;height:54px;border-radius:16px;background:#fff;color:var(--arca);display:flex;align-items:center;justify-content:center}
  .menu-top b{display:block;font-family:var(--disp);font-size:1.25rem;line-height:1.15}
  .menu-top span{display:block;opacity:.9;font-size:.9rem;margin-top:2px}
  .tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:14px}
  .tile{background:var(--card);border:1px solid var(--line);border-radius:var(--r-m);padding:14px 12px;text-align:left;display:flex;flex-direction:column;gap:8px;min-height:112px;position:relative}
  .tile .ic{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;background:var(--c)}
  .tile b{font-size:.98rem;line-height:1.2}
  .tile small{color:var(--ink2);font-size:.8rem;line-height:1.3}
  .tile .estado{position:absolute;top:12px;right:12px;width:10px;height:10px;border-radius:99px;background:var(--st)}
  .tile:active,.menu-top:active{transform:scale(.98)}
  .ic svg{width:24px;height:24px}
  .menu-top .ic svg{width:30px;height:30px}
  .conta-linha{font-size:.85rem;color:var(--ink2);text-align:center;margin:6px 0 4px}
  .btn-pdf-lista{display:inline-flex;align-items:center;gap:6px;border:1.5px solid var(--line);background:#fff;color:var(--ink);border-radius:99px;padding:6px 12px;font-weight:700;font-size:.84rem}
  .btn-pdf-lista svg{width:16px;height:16px}
  .rel-opcoes{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
  .rel-opcoes button{border:2px solid var(--line);background:#fff;border-radius:99px;padding:8px 14px;font-weight:700;font-size:.9rem}
  .rel-opcoes button[aria-pressed=true]{background:var(--c,var(--ink));border-color:transparent;color:#fff}
  .rel-check{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:var(--r-s);padding:12px;margin-bottom:8px;font-weight:600}
  .rel-check input{width:22px;height:22px;accent-color:var(--arca)}
  .rel-resumo{background:#fff;border:1px solid var(--line);border-left:6px solid var(--arca);border-radius:var(--r-s);padding:12px 14px;margin:14px 0}
  .rel-resumo b{font-family:var(--disp);font-size:1.3rem;display:block}
  .rel-acoes{display:grid;grid-template-columns:1fr;gap:10px}
  .rel-acoes .btn{min-height:52px;font-size:1rem}
  .btn.verde{background:var(--t2)}
  .rel-acoes .btn svg{width:22px;height:22px;flex:none}
  .envio-pc{background:#fff;border:1px solid var(--line);border-left:6px solid var(--t2);border-radius:var(--r-s);padding:14px;margin-top:12px}
  .envio-pc p{margin:0 0 10px;font-size:.92rem}
  .envio-pc .linha-btns .btn{flex:1;min-width:140px;text-decoration:none}
  #print-area{display:none}
  @media print{
    @page{size:A4 landscape;margin:9mm}
    body{background:#fff!important;overflow:visible!important}
    body>*:not(#print-area){display:none!important}
    #print-area{display:block!important;color:#000;font-family:Arial,Helvetica,sans-serif}
    #print-area h1{font-size:14pt;margin:0 0 2pt}
    #print-area .sub{font-size:9pt;margin:0 0 6pt;color:#333}
    #print-area .faixa{height:4pt;background:linear-gradient(90deg,#12A4D9 0 25%,#22B573 25% 50%,#F5A623 50% 75%,#E6457A 75%);margin-bottom:6pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    #print-area table{width:100%;border-collapse:collapse;font-size:7.4pt;table-layout:fixed}
    #print-area th{background:#1E4FB8;color:#fff;text-align:left;padding:3pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    #print-area td{border-bottom:.5pt solid #bbb;padding:2.5pt 3pt;vertical-align:top;word-wrap:break-word}
    #print-area tr{page-break-inside:avoid}
    #print-area thead{display:table-header-group}
    #print-area .sec td{background:#E9EFFB;font-weight:bold;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    #print-area .sub-t td{font-weight:bold;border-top:1pt solid #000}
    #print-area .tot td{font-weight:bold;font-size:9pt;border-top:1.5pt solid #000}
    #print-area .num{text-align:right;white-space:nowrap}
    #print-area h2{font-size:11pt;margin:12pt 0 4pt;page-break-before:always}
    #print-area .rodape{font-size:7pt;color:#555;margin-top:6pt}
  }`;
  document.head.appendChild(css);

  const svg = {
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 14h8M8 17.5h5"/></svg>',
    xls: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/></svg>',
    imp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    drive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M8 3h8l6 10-4 7H6l-4-7z"/><path d="M8 3l6 10h8M2 13h12l-4 7"/></svg>',
    app: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/></svg>',
    ref: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
    sair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 9.5c.3 2 2.2 4 4.5 4.5l1-1.3 2 .8c-.2 1.3-1.3 2-2.5 2A6 6 0 0 1 8 9.5c0-1.2.8-2.3 2-2.5l.8 2z"/></svg>',
    def: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    ajuda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 3.8"/><path d="M12 17.2h.01"/></svg>',
    prt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>'
  };

  /* ---------- menu ---------- */
  renderMais = function () {
    const tok = driveTokenValido();
    const ult = localStorage.getItem('faturas_drive_ultima');
    $('#v-mais').innerHTML = `
      <button class="menu-top" id="m-rel">
        <span class="ic">${svg.pdf}</span>
        <span><b>Relatório para o contabilista</b><span>PDF A4 com todos os dados – enviar ou imprimir</span></span>
      </button>
      <div class="tiles">
        <button class="tile" id="m-prt" style="--c:var(--t1)"><span class="ic">${svg.prt}</span><b>Imprimir</b><small>Folha A4 do trimestre ou do ano</small></button>
        <button class="tile" id="m-exp" style="--c:var(--t2)"><span class="ic">${svg.xls}</span><b>Excel ${ANO}</b><small>Igual à folha original</small></button>
        <button class="tile" id="m-drive" style="--c:var(--t3);--st:${tok ? 'var(--ok)' : 'var(--bad)'}"><span class="estado"></span><span class="ic">${svg.drive}</span><b>Google Drive</b><small>${tok ? (ult ? 'Última cópia ' + esc(ult.slice(0, 16)) : 'Ligado – gravar agora') : 'Toque para ligar'}</small></button>
        <button class="tile" id="m-imp" style="--c:var(--t4)"><span class="ic">${svg.imp}</span><b>Importar Excel</b><small>Acrescentar faturas de uma folha</small></button>
        <button class="tile" id="m-inst" style="--c:var(--arca)"><span class="ic">${svg.app}</span><b>Instalar app</b><small>${deferredInstall ? 'Pôr no ecrã principal' : 'Menu ⋮ → Instalar app'}</small></button>
        <button class="tile" id="m-pass" style="--c:#7C4DDB"><span class="ic">${svg.key}</span><b>Alterar password</b><small>Da conta da associação</small></button>
        <button class="tile" id="m-rec" style="--c:#0E8E8C"><span class="ic">${svg.ref}</span><b>Atualizar dados</b><small>Voltar a ler do Supabase</small></button>
        <button class="tile" id="m-def" style="--c:#51607A"><span class="ic">${svg.def}</span><b>Definições</b><small>Contactos para enviar os relatórios</small></button>
        <button class="tile" id="m-ajuda" style="--c:#F5A623"><span class="ic">${svg.ajuda}</span><b>Ajuda</b><small>Como usar cada parte da app</small></button>
        <button class="tile" id="m-sair" style="--c:var(--bad)"><span class="ic">${svg.sair}</span><b>Terminar sessão</b><small>Sair neste aparelho</small></button>
      </div>
      <p class="conta-linha" id="m-user"></p>`;
    sb.auth.getUser().then(({ data }) => { const el = $('#m-user'); if (el) el.textContent = 'Sessão: ' + (data.user?.email || ''); });
    $('#m-ajuda').onclick = () => abrirAjuda();
    $('#m-def').onclick = () => abrirDefinicoes();
    $('#m-rel').onclick = () => abrirRelatorio();
    $('#m-prt').onclick = () => abrirRelatorio();
    $('#m-exp').onclick = () => { XLSX.writeFile(construirExcel(ANO), `Faturas_${ANO}_ARCA.xlsx`); };
    $('#m-imp').onclick = () => $('#file-imp').click();
    $('#m-drive').onclick = () => driveGravarAgora(true);
    $('#m-inst').onclick = async () => {
      if (!deferredInstall) return toast('No Chrome: menu ⋮ → “Instalar app” ou “Adicionar ao ecrã principal”.', 5000);
      deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; renderMais();
    };
    $('#m-pass').onclick = async () => {
      const p = prompt('Nova password (mínimo 8 caracteres):'); if (!p) return;
      if (p.length < 8) return toast('A password tem de ter pelo menos 8 caracteres.');
      const { error } = await sb.auth.updateUser({ password: p });
      toast(error ? 'Erro: ' + error.message : 'Password alterada.');
    };
    $('#m-rec').onclick = () => carregar();
    $('#m-sair').onclick = async () => { if (confirm('Terminar sessão neste aparelho?')) { await sb.auth.signOut(); localStorage.removeItem('faturas_drive_tok'); } };
  };

  /* botão PDF na lista de faturas (usa os filtros atuais) */
  const renderListaOriginal = renderLista;
  renderLista = function () {
    renderListaOriginal();
    const r = document.querySelector('#v-lista .resumo');
    if (r && !r.querySelector('.btn-pdf-lista')) {
      const b = document.createElement('button');
      b.className = 'btn-pdf-lista'; b.innerHTML = svg.pdf + 'PDF';
      b.setAttribute('aria-label', 'Relatório PDF desta lista');
      b.onclick = () => abrirRelatorio('lista');
      r.insertBefore(b, r.lastElementChild);
    }
  };
  if (typeof VISTA !== 'undefined' && VISTA === 'mais') renderMais();

  /* ---------- folha do relatório ---------- */
  let REL = { per: 0, de: '', ate: '', resumo: true, notas: true, dest: undefined };
  let CONTACTOS = [];
  let libsProntas = null;
  function carregarLibs() {
    if (libsProntas) return libsProntas;
    const load = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('Sem ligação para gerar o PDF')); document.head.appendChild(s); });
    libsProntas = load(LIB_PDF).then(() => load(LIB_TAB)).catch(e => { libsProntas = null; throw e; });
    return libsProntas;
  }

  const folha = document.createElement('div');
  folha.className = 'sheet hidden'; folha.id = 'rel-sheet';
  folha.setAttribute('role', 'dialog'); folha.setAttribute('aria-modal', 'true');
  folha.innerHTML = `<div class="pane"><div class="pane-head"><h2>Relatório A4</h2><button class="x aj-q" data-aj="relatorio" aria-label="Ajuda sobre o relatório">?</button><button class="x" id="rel-x" aria-label="Fechar">×</button></div><div id="rel-corpo"></div></div>`;
  document.body.appendChild(folha);
  const printArea = document.createElement('div'); printArea.id = 'print-area'; document.body.appendChild(printArea);
  $('#rel-x').onclick = fecharRel;
  folha.addEventListener('click', e => { if (e.target === folha) fecharRel(); });
  function fecharRel() { folha.classList.add('hidden'); document.body.style.overflow = ''; }

  window.abrirRelatorio = async function (modo) {
    REL.per = modo === 'lista' ? 'lista' : (FILTRO.trim || 0);
    await carregarContactos();
    carregarLibs().catch(() => {});
    pintarRel();
    folha.classList.remove('hidden'); document.body.style.overflow = 'hidden';
  };

  function registosRel() {
    let regs;
    if (REL.per === 'lista') regs = filtradas();
    else if (REL.per === 'datas') regs = doAno().filter(f => f.data_doc && (!REL.de || f.data_doc >= REL.de) && (!REL.ate || f.data_doc <= REL.ate));
    else regs = doAno().filter(f => !REL.per || f.trimestre === REL.per);
    return regs.slice().sort((a, b) => (a.trimestre - b.trimestre) || ((a.ordem || 0) - (b.ordem || 0)));
  }
  function nomePeriodo() {
    if (REL.per === 'lista') return `Lista filtrada de ${ANO}`;
    if (REL.per === 'datas') return `De ${dPT(REL.de) || '…'} a ${dPT(REL.ate) || '…'}`;
    if (!REL.per) return `Ano ${ANO} (todos os trimestres)`;
    return `${ORDINAL[REL.per - 1]} trimestre de ${ANO} – ${TRIM_NOMES[REL.per - 1]}`;
  }
  function nomeFicheiro() {
    const p = REL.per === 'lista' ? 'lista' : REL.per === 'datas' ? `${REL.de}_a_${REL.ate}` : REL.per ? 'T' + REL.per : 'ano';
    return `ARCA_Faturas_${ANO}_${p}.pdf`;
  }

  function pintarRel() {
    const regs = registosRel();
    const tot = regs.reduce((s, f) => s + (+f.valor_doc || 0), 0);
    const ops = [[0, 'Ano todo', 'var(--ink)'], [1, TRIM_CURTO[0], TRIM_COR[0]], [2, TRIM_CURTO[1], TRIM_COR[1]], [3, TRIM_CURTO[2], TRIM_COR[2]], [4, TRIM_CURTO[3], TRIM_COR[3]], ['datas', 'Entre datas', 'var(--arca)'], ['lista', 'Lista filtrada', '#7C4DDB']];
    $('#rel-corpo').innerHTML = `
      <p style="margin:0 0 8px;font-weight:700">Período</p>
      <div class="rel-opcoes">${ops.map(([v, t, c]) => `<button data-p="${v}" aria-pressed="${String(REL.per) === String(v)}" style="--c:${c}">${t}</button>`).join('')}</div>
      ${REL.per === 'datas' ? `<div class="grid2"><label class="fld"><span>De (data do documento)</span><input type="date" id="rel-de" value="${REL.de}"></label><label class="fld"><span>Até</span><input type="date" id="rel-ate" value="${REL.ate}"></label></div>` : ''}
      <label class="fld"><span>Enviar para <button type="button" class="link" id="rel-def" style="padding:0;font-size:.82rem">(alterar contactos)</button></span><select id="rel-dest">${CONTACTOS.map(c => `<option value="${c.id}" ${c.id === destinoId() ? 'selected' : ''}>${esc(c.nome)}${c.whatsapp ? ' · ' + esc(c.whatsapp) : ''}${c.principal ? ' ★' : ''}</option>`).join('')}<option value="" ${destinoId() === '' ? 'selected' : ''}>Outro – escolher no WhatsApp / Gmail</option></select></label>
      <label class="rel-check"><input type="checkbox" id="rel-resumo" ${REL.resumo ? 'checked' : ''}> Incluir resumo por tipo de despesa</label>
      <label class="rel-check"><input type="checkbox" id="rel-notas" ${REL.notas ? 'checked' : ''}> Incluir coluna de notas</label>
      <div class="rel-resumo"><span style="color:var(--ink2);font-weight:600">${esc(nomePeriodo())}</span><b>${regs.length} documentos · ${eur(tot)}</b></div>
      <div class="rel-acoes">
        <button class="btn verde" id="rel-wa">${svg.wa} Enviar por WhatsApp (com link)</button>
        <button class="btn" id="rel-share" style="background:var(--t1)">${svg.pdf} Enviar PDF (email, outras apps…)</button>
        <button class="btn" id="rel-down">Descarregar PDF</button>
        <button class="btn ghost" id="rel-print">${svg.prt} Imprimir</button>
      </div>
      <div id="rel-envio"></div>`;
    $('#rel-corpo').querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
      const v = b.dataset.p; REL.per = (v === 'datas' || v === 'lista') ? v : +v;
      if (REL.per === 'datas' && !REL.de) { REL.de = `${ANO}-01-01`; REL.ate = new Date().toISOString().slice(0, 10); }
      pintarRel();
    });
    const de = $('#rel-de'), ate = $('#rel-ate');
    if (de) de.onchange = () => { REL.de = de.value; pintarRel(); };
    if (ate) ate.onchange = () => { REL.ate = ate.value; pintarRel(); };
    $('#rel-resumo').onchange = e => REL.resumo = e.target.checked;
    $('#rel-notas').onchange = e => REL.notas = e.target.checked;
    $('#rel-dest').onchange = e => { REL.dest = e.target.value; };
    $('#rel-def').onclick = () => abrirDefinicoes();
    $('#rel-wa').onclick = enviarWhatsApp;
    $('#rel-share').onclick = () => gerarPDF('share');
    $('#rel-down').onclick = () => gerarPDF('down');
    $('#rel-print').onclick = imprimir;
  }

  /* ---------- dados comuns ---------- */
  const pagTxt = f => [f.data_pagamento ? dPT(f.data_pagamento) : '', f.obs_pagamento || ''].filter(Boolean).join(' – ');
  function grupos(regs) {
    const g = [];
    [1, 2, 3, 4].forEach(t => { const r = regs.filter(f => f.trimestre === t); if (r.length) g.push({ t, regs: r, tot: r.reduce((s, f) => s + (+f.valor_doc || 0), 0) }); });
    return g;
  }
  function resumoDespesa(regs) {
    const m = new Map();
    regs.forEach(f => { const v = (f.tipo_despesa || '(sem tipo)').trim(); const k = norm(v); const o = m.get(k) || { nome: v, n: 0, v: 0 }; o.n++; o.v += (+f.valor_doc || 0); m.set(k, o); });
    return [...m.values()].sort((a, b) => b.v - a.v);
  }
  function resumoTipoDoc(regs) {
    const m = new Map();
    regs.forEach(f => { const k = (f.tipo_doc || '—').toUpperCase(); const o = m.get(k) || { nome: k + (TIPOS_DOC[k] ? ' – ' + TIPOS_DOC[k][0] : ''), n: 0, v: 0 }; o.n++; o.v += (+f.valor_doc || 0); m.set(k, o); });
    return [...m.values()].sort((a, b) => b.v - a.v);
  }
  const num = v => (Number(v) || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  /* ---------- PDF ---------- */
  async function gerarPDF(modo) {
    const regs = registosRel();
    if (!regs.length) return toast('Não há documentos neste período.');
    let b = modo === 'share' ? $('#rel-share') : modo === 'wa' ? $('#rel-wa') : $('#rel-down');
    const txt = b.innerHTML; b.disabled = true; b.textContent = 'A preparar o PDF…';
    try {
      await carregarLibs();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const W = 297, M = 10;
      const agora = new Date().toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' });
      const total = regs.reduce((s, f) => s + (+f.valor_doc || 0), 0);

      const cab = () => {
        TRGB.forEach((c, i) => { doc.setFillColor(...c); doc.rect(M + i * (W - 2 * M) / 4, 7, (W - 2 * M) / 4, 1.6, 'F'); });
        doc.setTextColor(...RGB.ink); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
        doc.text("ARCA d'Ajuda – Registo de faturas e despesas", M, 15);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.text(`Associação Recreativa e Cultural da Ajuda · ${nomePeriodo()}`, M, 20);
        doc.text(`Emitido em ${agora}`, W - M, 15, { align: 'right' });
        doc.text(`${regs.length} documentos · Total ${num(total)}`, W - M, 20, { align: 'right' });
      };

      const colunas = ['Tipo', 'Nº documento', 'Data doc.', 'Vencimento', 'NIF', 'Fornecedor', 'Tipo de despesa', 'Descrição', 'Valor', 'Pagamento'];
      const larg = REL.notas ? [10, 26, 16, 17, 19, 40, 30, 35, 19, 33, 32] : [11, 30, 17, 18, 20, 48, 35, 42, 20, 36];
      if (REL.notas) colunas.push('Notas');
      const nCol = colunas.length;
      const body = [];
      grupos(regs).forEach(g => {
        body.push([{ content: `${ORDINAL[g.t - 1]} trimestre – ${TRIM_NOMES[g.t - 1]}`, colSpan: nCol, styles: { fillColor: [233, 239, 251], fontStyle: 'bold', textColor: TRGB[g.t - 1].map(x => Math.round(x * .75)) } }]);
        g.regs.forEach(f => {
          const l = [f.tipo_doc || '', f.numero_doc || '', dPT(f.data_doc), dPT(f.data_vencimento), f.nif_fornecedor || '', f.nome_fornecedor || '', f.tipo_despesa || '', f.descricao || '', f.valor_doc == null ? '' : num(f.valor_doc), pagTxt(f)];
          if (REL.notas) l.push(f.notas || '');
          body.push(l);
        });
        body.push([{ content: `Subtotal ${ORDINAL[g.t - 1]} trimestre (${g.regs.length} documentos)`, colSpan: 8, styles: { fontStyle: 'bold', halign: 'right' } }, { content: num(g.tot), styles: { fontStyle: 'bold', halign: 'right' } }, { content: '', colSpan: nCol - 9 }]);
      });
      body.push([{ content: `TOTAL (${regs.length} documentos)`, colSpan: 8, styles: { fontStyle: 'bold', halign: 'right', fontSize: 9 } }, { content: num(total), styles: { fontStyle: 'bold', halign: 'right', fontSize: 9 } }, { content: '', colSpan: nCol - 9 }]);

      const colStyles = {}; larg.forEach((w, i) => colStyles[i] = { cellWidth: w });
      colStyles[8].halign = 'right';
      doc.autoTable({
        head: [colunas], body, startY: 24, margin: { left: M, right: M, top: 24, bottom: 12 },
        styles: { font: 'helvetica', fontSize: 7, cellPadding: 1.3, overflow: 'linebreak', textColor: RGB.ink, lineColor: [210, 216, 228], lineWidth: .1 },
        headStyles: { fillColor: RGB.arca, textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [247, 249, 252] },
        columnStyles: colStyles, showHead: 'everyPage',
        didDrawPage: cab
      });

      if (REL.resumo) {
        doc.addPage();
        const meia = (W - 2 * M - 8) / 2;
        const rd = resumoDespesa(regs), rt = resumoTipoDoc(regs), linhasMax = Math.max(rd.length, rt.length);
        const tab = (titulo, linhas, x) => doc.autoTable({
          head: [[titulo, 'Nº', 'Valor']],
          body: [...linhas.map(o => [o.nome, o.n, num(o.v)]), [{ content: 'Total', styles: { fontStyle: 'bold' } }, { content: regs.length, styles: { fontStyle: 'bold' } }, { content: num(total), styles: { fontStyle: 'bold' } }]],
          startY: 30, margin: { left: x, right: W - x - meia, top: 24, bottom: 12 }, tableWidth: meia,
          styles: { fontSize: linhasMax > 40 ? 6.5 : 8, cellPadding: linhasMax > 40 ? .7 : 1.4, textColor: RGB.ink }, headStyles: { fillColor: RGB.arca },
          columnStyles: { 1: { halign: 'center', cellWidth: 14 }, 2: { halign: 'right', cellWidth: 30 } },
          didDrawPage: cab
        });
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...RGB.ink);
        doc.text('Resumo', M, 27);
        const pag0 = doc.internal.getNumberOfPages();
        tab('Tipo de despesa', rd, M);
        doc.setPage(pag0);
        tab('Tipo de documento', rt, M + meia + 8);
      }

      const n = doc.internal.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(90);
        doc.text(`Página ${i} de ${n}`, W - M, 205, { align: 'right' });
        doc.text('Gerado pela app Faturas ARCA', M, 205);
      }

      const nome = nomeFicheiro();
      const blob = doc.output('blob');
      if (modo === 'wa') return { blob, nome };
      const file = new File([blob], nome, { type: 'application/pdf' });
      if (modo === 'share' && !eTelemovel()) {
        descarregar(blob, nome);
        mostrarEnvioPC(nome);
      } else if (modo === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: nome, text: `Faturas ARCA d'Ajuda – ${nomePeriodo()}` });
          toast('PDF enviado.');
        } catch (e) { if (e.name !== 'AbortError') { descarregar(blob, nome); toast('Não deu para partilhar; o PDF foi descarregado.', 4000); } }
      } else {
        descarregar(blob, nome);
        toast(modo === 'share' ? 'Este aparelho não partilha ficheiros; o PDF foi descarregado.' : 'PDF descarregado.', 4000);
      }
    } catch (e) {
      toast('Erro ao gerar o PDF: ' + e.message, 5000);
    } finally { b.disabled = false; b.innerHTML = txt; }
  }
  function eTelemovel() {
    return (navigator.userAgentData && navigator.userAgentData.mobile) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  function mostrarEnvioPC(nome) {
    const para = destino()?.email || '';
    const assunto = `Faturas ARCA d'Ajuda – ${nomePeriodo()}`;
    const corpo = `Bom dia,\n\nEnvio em anexo o registo de faturas da ARCA d'Ajuda (${nomePeriodo()}).\n\nCumprimentos,\nARCA d'Ajuda`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(para)}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    const el = $('#rel-envio');
    el.innerHTML = `<div class="envio-pc" role="status">
      <p><b>O PDF foi descarregado</b> para a pasta Transferências com o nome <b>${esc(nome)}</b>.</p>
      <p>Escolha por onde enviar e depois <b>anexe esse ficheiro</b> (clipe 📎 ou arrastar da pasta Transferências):</p>
      <div class="linha-btns">
        <a class="btn" href="${gmail}" target="_blank" rel="noopener">Abrir Gmail</a>
        <a class="btn verde" href="https://web.whatsapp.com/" target="_blank" rel="noopener">Abrir WhatsApp Web</a>
      </div></div>`;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function descarregar(blob, nome) {
    const u = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = u; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 10000);
  }

  /* ---------- Impressão direta ---------- */
  function imprimir() {
    const regs = registosRel();
    if (!regs.length) return toast('Não há documentos neste período.');
    const total = regs.reduce((s, f) => s + (+f.valor_doc || 0), 0);
    const nCol = REL.notas ? 11 : 10;
    const larg = REL.notas ? [4, 9, 6, 6, 7, 14, 11, 12, 7, 12, 12] : [4, 10, 6, 7, 7, 17, 12, 15, 8, 14];
    let h = `<div class="faixa"></div><h1>ARCA d'Ajuda – Registo de faturas e despesas</h1>
      <p class="sub">${esc(nomePeriodo())} · ${regs.length} documentos · Total ${num(total)} · Emitido em ${new Date().toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}</p>
      <table><colgroup>${larg.map(w => `<col style="width:${w}%">`).join('')}</colgroup>
      <thead><tr><th>Tipo</th><th>Nº documento</th><th>Data doc.</th><th>Vencim.</th><th>NIF</th><th>Fornecedor</th><th>Tipo de despesa</th><th>Descrição</th><th class="num">Valor</th><th>Pagamento</th>${REL.notas ? '<th>Notas</th>' : ''}</tr></thead><tbody>`;
    grupos(regs).forEach(g => {
      h += `<tr class="sec"><td colspan="${nCol}">${ORDINAL[g.t - 1]} trimestre – ${esc(TRIM_NOMES[g.t - 1])}</td></tr>`;
      g.regs.forEach(f => {
        h += `<tr><td>${esc(f.tipo_doc)}</td><td>${esc(f.numero_doc)}</td><td>${dPT(f.data_doc)}</td><td>${dPT(f.data_vencimento)}</td><td>${esc(f.nif_fornecedor)}</td><td>${esc(f.nome_fornecedor)}</td><td>${esc(f.tipo_despesa)}</td><td>${esc(f.descricao)}</td><td class="num">${f.valor_doc == null ? '' : num(f.valor_doc)}</td><td>${esc(pagTxt(f))}</td>${REL.notas ? `<td>${esc(f.notas)}</td>` : ''}</tr>`;
      });
      h += `<tr class="sub-t"><td colspan="8" class="num">Subtotal ${ORDINAL[g.t - 1]} trimestre (${g.regs.length})</td><td class="num">${num(g.tot)}</td><td colspan="${nCol - 9}"></td></tr>`;
    });
    h += `<tr class="tot"><td colspan="8" class="num">TOTAL (${regs.length} documentos)</td><td class="num">${num(total)}</td><td colspan="${nCol - 9}"></td></tr></tbody></table>`;
    if (REL.resumo) {
      const t = (tit, arr) => `<table style="width:49%;display:inline-table;margin-right:1%"><thead><tr><th>${tit}</th><th class="num">Nº</th><th class="num">Valor</th></tr></thead><tbody>${arr.map(o => `<tr><td>${esc(o.nome)}</td><td class="num">${o.n}</td><td class="num">${num(o.v)}</td></tr>`).join('')}<tr class="tot"><td>Total</td><td class="num">${regs.length}</td><td class="num">${num(total)}</td></tr></tbody></table>`;
      h += `<h2>Resumo – ${esc(nomePeriodo())}</h2>${t('Tipo de despesa', resumoDespesa(regs))}${t('Tipo de documento', resumoTipoDoc(regs))}`;
    }
    h += `<p class="rodape">Gerado pela app Faturas ARCA d'Ajuda</p>`;
    printArea.innerHTML = h;
    fecharRel();
    setTimeout(() => window.print(), 80);
  }

  /* ---------- Envio por WhatsApp com link ---------- */
  function numeroWA(v) {
    let d = String(v || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.length === 9) d = '351' + d;
    return d;
  }
  async function enviarWhatsApp() {
    const regs = registosRel();
    if (!regs.length) return toast('Não há documentos neste período.');
    const num = numeroWA(destino()?.whatsapp);
    const janela = window.open('about:blank', '_blank'); /* abre já, para o browser não bloquear */
    try {
      const r = await gerarPDF('wa');
      if (!r) { if (janela) janela.close(); return; }
      const caminho = `${ANO}/${Date.now()}_${r.nome}`;
      const up = await sb.storage.from('faturas-pdf').upload(caminho, r.blob, { contentType: 'application/pdf', upsert: true });
      if (up.error) throw up.error;
      const sg = await sb.storage.from('faturas-pdf').createSignedUrl(caminho, 60 * 60 * 24 * 30, { download: r.nome });
      if (sg.error) throw sg.error;
      const texto = `Bom dia,\nSegue o registo de faturas da ARCA d'Ajuda – ${nomePeriodo()} (${regs.length} documentos).\n\nPDF: ${sg.data.signedUrl}\n\n(O link é válido durante 30 dias.)`;
      const url = `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
      if (janela) { janela.location.href = url; }
      else { location.href = url; }
      $('#rel-envio').innerHTML = `<div class="envio-pc" role="status"><p><b>Pronto.</b> O WhatsApp abriu com a mensagem e o link do PDF – só falta carregar em <b>Enviar</b>.</p><p>Se não abriu: <a href="${url}" target="_blank" rel="noopener">abrir o WhatsApp</a>.</p></div>`;
    } catch (e) {
      if (janela) janela.close();
      toast('Não foi possível preparar o envio: ' + (e.message || e), 6000);
    }
  }

  /* ---------- AJUDA ---------- */
  const AJUDA = [
    ['entrar', 'Entrar e password', `
      <p>Entre com o email <b>${EMAIL_ARCA}</b> e a password da associação.</p>
      <ul><li><b>Esqueci-me da password:</b> no ecrã de entrada, toque em “Esqueci-me da password”. Chega um email a ${EMAIL_ARCA} com um link; abra-o no mesmo aparelho e escolha a nova password.</li>
      <li><b>Mudar a password:</b> Menu → Alterar password (mínimo 8 caracteres).</li>
      <li><b>Sair:</b> Menu → Terminar sessão. Faça-o sempre num computador que não seja seu.</li></ul>`],
    ['painel', 'Painel', `
      <p>Resumo do ano escolhido no canto superior direito (ex.: 2026).</p>
      <ul><li><b>Valor total</b> – soma de todos os documentos do ano.</li>
      <li><b>Barra colorida</b> – uma cor por trimestre (azul, verde, amarelo, rosa). Toque num trimestre para ver as faturas dele.</li>
      <li><b>Sem pagamento registado</b> – documentos sem data nem forma de pagamento.</li>
      <li><b>Já vencidos por pagar</b> – passaram a data de vencimento e não têm pagamento.</li>
      <li><b>Tipos de despesa</b> – toque numa linha para ver só essas faturas.</li></ul>`],
    ['faturas', 'Lista de faturas e pesquisa', `
      <ul><li>Os botões <b>Todo o ano / Jan–Mar / …</b> escolhem o trimestre.</li>
      <li>A <b>pesquisa</b> procura em fornecedor, NIF, nº do documento, descrição, notas e valor (ex.: “MEO”, “511010435”, “587,88”).</li>
      <li>Os filtros permitem escolher o <b>tipo de documento</b>, o <b>tipo de despesa</b> e o <b>estado do pagamento</b>.</li>
      <li>A <b>cor à esquerda</b> de cada fatura indica o tipo de documento (FT azul, FR verde, FS laranja, recibos roxo, NC/DEV vermelho).</li>
      <li>O botão <b>PDF</b> ao lado do total gera o relatório só com o que está a ver.</li>
      <li>Toque numa fatura para a <b>ver, corrigir ou apagar</b>.</li></ul>`],
    ['nova', 'Registar uma nova fatura', `
      <ol><li>Toque no botão rosa <b>+</b> (em baixo à direita).</li>
      <li>Confirme o <b>trimestre</b> (é escolhido pela data do documento, mas pode mudar).</li>
      <li>Preencha os campos (veja “Campos da fatura”).</li>
      <li>Toque em <b>Guardar</b>. Fica logo gravada no Supabase e, com o Drive ligado, copiada para o Google Drive.</li></ol>
      <p>Se o nº do documento já existir para o mesmo fornecedor, a app avisa antes de gravar em duplicado.</p>`],
    ['campos', 'Campos da fatura', `
      <ul><li><b>Tipo de documento</b> – FT fatura · FR fatura-recibo · FS fatura simplificada · R/REC/RC recibo · NC nota de crédito · DEV devolução · PE pagamento ao Estado · RV recibo de vencimento · CA cartão alimentação · FA fatura (FA).</li>
      <li><b>Nº do documento</b> – tal como está impresso (ex.: FT 2026/24).</li>
      <li><b>Data do documento / Data de vencimento</b> – toque no campo para escolher no calendário.</li>
      <li><b>NIF do fornecedor</b> – ao escrever um NIF já usado, o nome e o tipo de despesa aparecem sozinhos. Se aparecer “NIF com formato invulgar”, confirme os 9 algarismos.</li>
      <li><b>Valor (€)</b> – use vírgula para os cêntimos (ex.: 1250,50).</li>
      <li><b>Nome do fornecedor, Tipo de despesa, Descrição</b> – ao escrever, a app sugere o que já foi usado antes; escolha a sugestão para manter tudo igual.</li>
      <li><b>Notas</b> – qualquer informação extra (reclamações, pagamentos parciais, etc.).</li></ul>`],
    ['pagamento', 'Pagamento', `
      <ul><li><b>Data de pagamento</b> – quando foi pago (aparece “Pago dd/mm” a verde na lista).</li>
      <li><b>Forma / observação</b> – débito direto, numerário, cartão, transferência, “Pago pelos atletas”…</li>
      <li>Se ambos ficarem vazios, a fatura conta como <b>sem pagamento</b>; se a data de vencimento já passou, aparece “Vencida” a vermelho.</li></ul>`],
    ['fornecedores', 'Fornecedores', `
      <p>Lista de todos os fornecedores do ano, do maior para o menor valor, com o nº de documentos e quantos estão sem pagamento. Toque num fornecedor para ver as faturas dele.</p>`],
    ['relatorio', 'Relatório para o contabilista (PDF / imprimir)', `
      <ol><li>Menu → <b>Relatório para o contabilista</b>.</li>
      <li>Escolha o <b>período</b>: ano todo, um trimestre, entre datas, ou a lista filtrada.</li>
      <li>Escolha se quer o <b>resumo por tipo de despesa</b> e a <b>coluna de notas</b>.</li>
      <li>Escolha como enviar:
        <ul><li><b>Enviar por WhatsApp (com link)</b> – ver “Enviar por WhatsApp”.</li>
        <li><b>Enviar PDF</b> – no telemóvel abre a partilha (Gmail, WhatsApp, etc.) com o PDF anexado; no computador descarrega o PDF e abre o Gmail já preenchido, só falta anexar o ficheiro da pasta Transferências.</li>
        <li><b>Descarregar PDF</b> – guarda o ficheiro no aparelho.</li>
        <li><b>Imprimir</b> – abre a janela de impressão em A4 horizontal (também pode escolher “Guardar como PDF”).</li></ul></li></ol>
      <p>O PDF tem todos os campos da folha original, subtotais por trimestre, total geral e página de resumo.</p>`],
    ['whatsapp', 'Enviar por WhatsApp', `
      <ol><li>Em <b>Menu → Definições</b>, registe os contactos (ex.: Contabilista, ARCA) com o número de WhatsApp. O contacto marcado com ★ fica escolhido por defeito.</li>
      <li>No relatório, confirme em <b>Enviar para</b> a quem vai o PDF.</li>
      <li>Toque em <b>Enviar por WhatsApp (com link)</b>.</li>
      <li>A app cria o PDF, guarda-o em segurança no Supabase e abre o WhatsApp (Web no computador, app no telemóvel) com a mensagem e o link já escritos.</li>
      <li>Só falta carregar em <b>Enviar</b>. O link funciona durante <b>30 dias</b>.</li></ol>
      <p>Se escolher “Outro”, o WhatsApp deixa escolher o contacto.</p>`],
    ['definicoes', 'Definições (contactos de envio)', `
      <ul><li>Menu → <b>Definições</b> mostra os contactos para onde são enviados os relatórios.</li>
      <li><b>+ Novo contacto</b> – nome (ex.: Contabilista), nº de WhatsApp e email.</li>
      <li><b>Editar</b> – muda o número ou o email quando for preciso. <b>Apagar</b> – remove o contacto.</li>
      <li><b>★ Principal</b> – o contacto que aparece escolhido por defeito no relatório.</li>
      <li>Os contactos ficam guardados no Supabase: são os mesmos no telemóvel e no computador.</li></ul>
      <p><b>Pessoas com acesso:</b> em <b>+ Dar acesso a uma pessoa</b> escreva o nome, o email e uma password criada por si – a pessoa passa logo a poder entrar na app com esse email e essa password. Pode <b>mudar a password</b> ou <b>remover o acesso</b> a qualquer momento. Se o email já tiver conta na ARCA (ex.: backoffice do site), só é dado o acesso e a pessoa usa a password que já tem.</p>`],
    ['excel', 'Excel (exportar e importar)', `
      <ul><li><b>Menu → Excel</b> descarrega o ano no mesmo formato da folha original (uma folha por trimestre).</li>
      <li><b>Menu → Importar Excel</b> acrescenta faturas de uma folha com as mesmas colunas. As que já existem são ignoradas automaticamente; a app mostra quantas vai acrescentar antes de gravar.</li></ul>`],
    ['drive', 'Cópia no Google Drive', `
      <ul><li>Toque em <b>Drive: ligar</b> (em cima) ou Menu → Google Drive, e entre com <b>${EMAIL_ARCA}</b>.</li>
      <li>Depois disso, a cada alteração a app grava um Excel atualizado na pasta “${esc(DRIVE_PASTA)}”.</li>
      <li>A ligação ao Google dura cerca de 1 hora; depois, na próxima gravação, o Google pode pedir para confirmar de novo – é normal.</li></ul>`],
    ['instalar', 'Instalar no telemóvel (app / APK)', `
      <ul><li><b>Android:</b> abra a app no Chrome → menu ⋮ → <b>Instalar app</b>. Fica com ícone no ecrã principal.</li>
      <li><b>iPhone:</b> no Safari → Partilhar → <b>Adicionar ao ecrã principal</b>.</li>
      <li><b>Ficheiro APK:</b> em pwabuilder.com, cole o endereço da app → Package for stores → Android.</li></ul>`],
    ['estados', 'O que significam os sinais no topo', `
      <ul><li><b>Dados ✓</b> (verde) – tudo gravado no Supabase. <b>Dados: erro</b> (vermelho) – falhou; toque para tentar de novo.</li>
      <li><b>Drive ✓</b> – cópia no Google Drive em dia. <b>Drive: ligar</b> – toque para ligar. <b>Drive ↑</b> – a gravar.</li>
      <li><b>Sem internet</b> – as alterações não são gravadas até voltar a ligação.</li>
      <li>O <b>ano</b> (ex.: 2026) escolhe que ano está a ver. Um ano novo aparece automaticamente.</li></ul>`],
    ['seguranca', 'Segurança dos dados (sem internet, cópias)', `
      <ul><li><b>Cada fatura é gravada no Supabase</b> no momento em que toca em Guardar (sinal <b>Dados ✓</b>).</li>
      <li><b>Sem internet?</b> A fatura fica guardada no aparelho e o sinal mostra <b>⏳ N por enviar</b>. Assim que voltar a ligação, a app envia tudo sozinha (pode tocar no sinal para enviar já). Não feche o separador enquanto houver lançamentos por enviar – a app avisa.</li>
      <li><b>Rascunho:</b> se fechar uma fatura nova a meio, ao tocar outra vez em + os dados voltam a aparecer.</li>
      <li><b>Histórico:</b> todas as alterações e eliminações ficam registadas no Supabase, com data e utilizador – é possível recuperar qualquer fatura.</li>
      <li><b>Cópia diária</b> automática de todas as faturas no Supabase (guardada 120 dias), além da cópia em Excel no Google Drive.</li></ul>`],
    ['problemas', 'Problemas comuns', `
      <ul><li><b>Não vejo uma fatura acabada de registar</b> – confirme o ano e o trimestre escolhidos e limpe a pesquisa.</li>
      <li><b>Os dados parecem desatualizados</b> – Menu → Atualizar dados.</li>
      <li><b>O PDF não abre para enviar no computador</b> – use “Descarregar PDF” e anexe o ficheiro da pasta Transferências.</li>
      <li><b>“Email ou password errados”</b> – use “Esqueci-me da password”.</li></ul>`]
  ];
  const cssAj = document.createElement('style');
  cssAj.textContent = `
  .aj-q{font-weight:800;font-size:1.05rem;color:var(--arca);margin-right:6px}
  .aj-top{border:0;background:rgba(255,255,255,.18);color:#fff;border-radius:99px;width:30px;height:30px;font-weight:800;font-size:1rem;flex:none}
  #aj-sheet details{scroll-margin-top:72px;background:#fff;border:1px solid var(--line);border-radius:var(--r-s);margin-bottom:8px}
  #aj-sheet summary{cursor:pointer;padding:13px 14px;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:10px}
  #aj-sheet summary::-webkit-details-marker{display:none}
  #aj-sheet summary::after{content:"+";font-size:1.2rem;color:var(--arca);line-height:1}
  #aj-sheet details[open] summary::after{content:"–"}
  #aj-sheet details[open] summary{border-bottom:1px solid var(--line)}
  #aj-sheet .aj-c{padding:4px 16px 12px;font-size:.93rem;line-height:1.5}
  #aj-sheet .aj-c li{margin:5px 0}
  #aj-sheet .aj-c ul,#aj-sheet .aj-c ol{padding-left:20px;margin:8px 0}`;
  document.head.appendChild(cssAj);
  const ajS = document.createElement('div');
  ajS.className = 'sheet hidden'; ajS.id = 'aj-sheet';
  ajS.setAttribute('role', 'dialog'); ajS.setAttribute('aria-modal', 'true'); ajS.setAttribute('aria-label', 'Ajuda');
  ajS.innerHTML = `<div class="pane"><div class="pane-head"><h2>Ajuda</h2><button class="x" id="aj-x" aria-label="Fechar">×</button></div>
    ${AJUDA.map(([id, t, c]) => `<details id="aj-${id}"><summary>${t}</summary><div class="aj-c">${c}</div></details>`).join('')}
    <p class="meta" style="text-align:center">Dúvidas que não estejam aqui: fale com o Diretor Desportivo.</p></div>`;
  document.body.appendChild(ajS);
  function fecharAj() { ajS.classList.add('hidden'); if ($('#sheet').classList.contains('hidden') && folha.classList.contains('hidden')) document.body.style.overflow = ''; }
  $('#aj-x').onclick = fecharAj;
  ajS.addEventListener('click', e => { if (e.target === ajS) fecharAj(); });
  window.abrirAjuda = function (sec) {
    ajS.querySelectorAll('details').forEach(d => d.open = !!sec && d.id === 'aj-' + sec);
    ajS.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    if (sec) setTimeout(() => { const d = $('#aj-' + sec); if (d) d.scrollIntoView({ block: 'start' }); }, 50);
  };
  /* botões "?" */
  const hdr = document.querySelector('header.top');
  if (hdr && !hdr.querySelector('.aj-top')) {
    const q = document.createElement('button'); q.className = 'aj-top'; q.textContent = '?'; q.setAttribute('aria-label', 'Ajuda');
    q.onclick = () => abrirAjuda({ painel: 'painel', lista: 'faturas', fornec: 'fornecedores', mais: '' }[VISTA] || '');
    hdr.insertBefore(q, hdr.querySelector('.chips-sync'));
  }
  const shHead = document.querySelector('#sheet .pane-head');
  if (shHead && !shHead.querySelector('.aj-q')) {
    const q = document.createElement('button'); q.className = 'x aj-q'; q.type = 'button'; q.textContent = '?'; q.setAttribute('aria-label', 'Ajuda sobre os campos');
    q.onclick = () => abrirAjuda('campos');
    shHead.insertBefore(q, $('#sh-x'));
  }
  const lg = document.querySelector('.login-box');
  if (lg && !lg.querySelector('.aj-login')) {
    const q = document.createElement('button'); q.className = 'link aj-login'; q.type = 'button'; q.textContent = 'Ajuda para entrar';
    q.style.display = 'block'; q.onclick = () => abrirAjuda('entrar'); lg.appendChild(q);
  }
  document.addEventListener('click', e => { const t = e.target.closest('[data-aj]'); if (t) abrirAjuda(t.dataset.aj); });

  /* ---------- DEFINIÇÕES: contactos de envio ---------- */
  function destinoId() {
    if (REL.dest !== undefined) return REL.dest;
    const pr = CONTACTOS.find(c => c.principal) || CONTACTOS[0];
    return pr ? pr.id : '';
  }
  function destino() { const id = destinoId(); return CONTACTOS.find(c => c.id === id) || null; }
  async function carregarContactos() {
    const { data, error } = await sb.from('faturas_contactos').select('*').order('principal', { ascending: false }).order('nome');
    if (!error) CONTACTOS = data || [];
    if (REL.dest && !CONTACTOS.some(c => c.id === REL.dest)) REL.dest = undefined;
  }
  const defS = document.createElement('div');
  defS.className = 'sheet hidden'; defS.id = 'def-sheet';
  defS.setAttribute('role', 'dialog'); defS.setAttribute('aria-modal', 'true'); defS.setAttribute('aria-label', 'Definições');
  defS.innerHTML = `<div class="pane"><div class="pane-head"><h2>Definições</h2><button class="x aj-q" data-aj="definicoes" aria-label="Ajuda">?</button><button class="x" id="def-x" aria-label="Fechar">×</button></div><div id="def-corpo"></div></div>`;
  document.body.appendChild(defS);
  const cssDef = document.createElement('style');
  cssDef.textContent = `
  .ct{background:#fff;border:1px solid var(--line);border-left:6px solid var(--t2);border-radius:var(--r-s);padding:12px 14px;margin-bottom:8px}
  .ct.pr{border-left-color:var(--t3)}
  .ct b{display:block;font-size:1rem}
  .ct small{display:block;color:var(--ink2);font-size:.86rem;margin-top:2px;word-break:break-all}
  .ct .linha-btns{margin-top:10px}
  .ct-form{background:#fff;border:2px solid var(--arca);border-radius:var(--r-s);padding:14px 14px 4px;margin-bottom:12px}
  .def-sub{font-family:var(--disp);font-size:1.05rem;margin:4px 0 10px}
  #aj-sheet{z-index:70}`;
  document.head.appendChild(cssDef);
  $('#def-x').onclick = () => { defS.classList.add('hidden'); if (folha.classList.contains('hidden')) document.body.style.overflow = ''; else pintarRel(); };
  defS.addEventListener('click', e => { if (e.target === defS) $('#def-x').click(); });
  let EDIT_CT = null;
  window.abrirDefinicoes = async function () {
    EDIT_CT = null;
    defS.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    $('#def-corpo').innerHTML = '<p class="meta">A carregar…</p>';
    await carregarContactos(); pintarDef();
  };
  function pintarDef() {
    const f = EDIT_CT;
    $('#def-corpo').innerHTML = `
      <p class="def-sub">Contactos para enviar os relatórios</p>
      ${f ? `<div class="ct-form">
        <label class="fld"><span>Nome (ex.: Contabilista, ARCA)</span><input id="ct-nome" value="${esc(f.nome || '')}"></label>
        <label class="fld"><span>WhatsApp (ex.: 912345678)</span><input id="ct-wa" type="tel" inputmode="tel" value="${esc(f.whatsapp || '')}"></label>
        <label class="fld"><span>Email</span><input id="ct-email" type="email" value="${esc(f.email || '')}"></label>
        <label class="rel-check"><input type="checkbox" id="ct-pr" ${f.principal ? 'checked' : ''}> ★ Contacto principal (escolhido por defeito)</label>
        <div class="acoes" style="margin-bottom:10px"><button class="btn ghost" id="ct-cancel">Cancelar</button><button class="btn" id="ct-save">Guardar contacto</button></div>
      </div>` : `<button class="btn full" id="ct-novo" style="margin-bottom:12px">+ Novo contacto</button>`}
      ${CONTACTOS.length ? CONTACTOS.map(c => `<div class="ct ${c.principal ? 'pr' : ''}"><b>${esc(c.nome)}${c.principal ? ' ★' : ''}</b>
        <small>WhatsApp: ${esc(c.whatsapp || '—')}</small><small>Email: ${esc(c.email || '—')}</small>
        <div class="linha-btns"><button class="btn ghost small" data-ed="${c.id}">Editar</button>${c.principal ? '' : `<button class="btn ghost small" data-pr="${c.id}">★ Tornar principal</button>`}<button class="btn ghost small" data-del="${c.id}" style="color:var(--bad)">Apagar</button></div></div>`).join('')
        : '<p class="vazio" style="padding:20px">Ainda não há contactos. Toque em “+ Novo contacto”.</p>'}`;
    const nv = $('#ct-novo'); if (nv) nv.onclick = () => { EDIT_CT = { principal: !CONTACTOS.length }; pintarDef(); setTimeout(() => $('#ct-nome').focus(), 50); };
    const cc = $('#ct-cancel'); if (cc) cc.onclick = () => { EDIT_CT = null; pintarDef(); };
    const sv = $('#ct-save'); if (sv) sv.onclick = guardarCt;
    $('#def-corpo').querySelectorAll('[data-ed]').forEach(b => b.onclick = () => { EDIT_CT = { ...CONTACTOS.find(c => c.id === b.dataset.ed) }; pintarDef(); });
    $('#def-corpo').querySelectorAll('[data-pr]').forEach(b => b.onclick = () => tornarPrincipal(b.dataset.pr));
    $('#def-corpo').querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      const c = CONTACTOS.find(x => x.id === b.dataset.del);
      if (!confirm(`Apagar o contacto “${c.nome}”?`)) return;
      const { error } = await sb.from('faturas_contactos').delete().eq('id', c.id);
      if (error) return toast('Erro: ' + error.message, 5000);
      toast('Contacto apagado.'); await carregarContactos(); pintarDef();
    });
  }
  async function tornarPrincipal(id) {
    const r1 = await sb.from('faturas_contactos').update({ principal: false }).neq('id', id);
    const r2 = await sb.from('faturas_contactos').update({ principal: true }).eq('id', id);
    if (r1.error || r2.error) return toast('Erro: ' + (r1.error || r2.error).message, 5000);
    REL.dest = undefined; await carregarContactos(); pintarDef();
  }
  async function guardarCt() {
    const reg = { nome: $('#ct-nome').value.trim(), whatsapp: $('#ct-wa').value.trim() || null, email: $('#ct-email').value.trim() || null, principal: $('#ct-pr').checked };
    if (!reg.nome) return toast('Escreva o nome do contacto.');
    if (!reg.whatsapp && !reg.email) return toast('Indique pelo menos o WhatsApp ou o email.');
    if (reg.whatsapp && numeroWA(reg.whatsapp).length < 11) return toast('O número de WhatsApp parece incompleto.');
    if (reg.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) return toast('O email não parece válido.');
    const b = $('#ct-save'); b.disabled = true;
    const res = EDIT_CT.id ? await sb.from('faturas_contactos').update(reg).eq('id', EDIT_CT.id).select().single()
                           : await sb.from('faturas_contactos').insert(reg).select().single();
    b.disabled = false;
    if (res.error) return toast('Erro: ' + res.error.message, 5000);
    if (reg.principal) { await sb.from('faturas_contactos').update({ principal: false }).neq('id', res.data.id); REL.dest = undefined; }
    toast('Contacto guardado.'); EDIT_CT = null; await carregarContactos(); pintarDef();
  }

  /* =========================================================
     GRAVAÇÃO SEGURA: fila offline, cópia local e rascunho
     ========================================================= */
  const FILA_K = 'faturas_fila_v1', CACHE_K = 'faturas_cache_v1', RASC_K = 'faturas_rascunho_v1';
  const novoUUID = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
  const lerFila = () => { try { return JSON.parse(localStorage.getItem(FILA_K) || '[]'); } catch { return []; } };
  function gravarFila(f) { localStorage.setItem(FILA_K, JSON.stringify(f)); estadoFila(); }
  const erroDeRede = e => !navigator.onLine || /fetch|network|load failed|timeout|ECONN/i.test(String((e && (e.message || e.details)) || e));
  function estadoFila() {
    const n = lerFila().length;
    if (n) estadoSB(`⏳ ${n} por enviar`, 'warn');
  }
  function aplicarFila(lista) {
    const porId = new Map(lista.map(f => [f.id, f]));
    lerFila().forEach(it => {
      if (it.op === 'save') porId.set(it.reg.id, { ...(porId.get(it.reg.id) || {}), ...it.reg, _pendente: true });
      else if (it.op === 'del') porId.delete(it.id);
    });
    return [...porId.values()];
  }
  function guardarCache() { try { localStorage.setItem(CACHE_K, JSON.stringify(TODAS.filter(f => !f._pendente))); } catch (e) {} }

  carregar = async function (silencioso) {
    if (!silencioso) estadoSB('Dados…', 'warn');
    const todas = []; let de = 0, falhou = null;
    while (true) {
      const { data, error } = await sb.from('faturas').select('*').order('ano').order('trimestre').order('ordem').order('criado_em').range(de, de + 999);
      if (error) { falhou = error; break; }
      todas.push(...data); if (data.length < 1000) break; de += 1000;
    }
    if (falhou) {
      let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_K) || 'null'); } catch (e) {}
      if (cache) { TODAS = aplicarFila(cache); estadoSB('Sem ligação · cópia local', 'warn'); }
      else { estadoSB('Dados: erro', 'bad'); toast('Sem ligação ao Supabase. Tente de novo quando tiver internet.', 5000); return; }
    } else {
      TODAS = todas; guardarCache(); TODAS = aplicarFila(TODAS);
      estadoSB('Dados ✓', 'ok'); estadoFila();
    }
    montarAnos(); montarListas(); render();
  };

  function porNaFila(item, localAplicar) {
    const f = lerFila(); f.push({ ...item, t: Date.now() }); gravarFila(f);
    localAplicar();
    montarAnos(); montarListas(); render();
    toast('Sem internet: ficou guardado neste aparelho e será enviado automaticamente quando houver ligação.', 5000);
  }

  guardarRegisto = async function (reg, id) {
    const registo = { ...reg, id: id || novoUUID() };
    const local = () => {
      const i = TODAS.findIndex(f => f.id === registo.id);
      const agora = new Date().toISOString();
      const r = { ...(i >= 0 ? TODAS[i] : { criado_em: agora }), ...registo, atualizado_em: agora, _pendente: true };
      if (i >= 0) TODAS[i] = r; else TODAS.push(r);
    };
    if (!navigator.onLine) { porNaFila({ op: 'save', reg: registo }, local); limparRascunho(id); return registo; }
    estadoSB('A gravar…', 'warn');
    const res = id ? await sb.from('faturas').update(reg).eq('id', id).select().single()
                   : await sb.from('faturas').upsert(registo, { onConflict: 'id' }).select().single();
    if (res.error) {
      if (erroDeRede(res.error)) { porNaFila({ op: 'save', reg: registo }, local); limparRascunho(id); return registo; }
      estadoSB('Dados: erro', 'bad'); throw res.error;
    }
    const i = TODAS.findIndex(f => f.id === res.data.id);
    if (i >= 0) TODAS[i] = res.data; else TODAS.push(res.data);
    guardarCache(); limparRascunho(id);
    estadoSB('Dados ✓', 'ok'); estadoFila();
    alterado();
    return res.data;
  };

  apagarRegisto = async function (id) {
    const local = () => { TODAS = TODAS.filter(f => f.id !== id); };
    if (!navigator.onLine) return porNaFila({ op: 'del', id }, local);
    estadoSB('A apagar…', 'warn');
    const { error } = await sb.from('faturas').delete().eq('id', id);
    if (error) {
      if (erroDeRede(error)) return porNaFila({ op: 'del', id }, local);
      estadoSB('Dados: erro', 'bad'); throw error;
    }
    local(); guardarCache(); estadoSB('Dados ✓', 'ok'); estadoFila();
    alterado();
  };

  let aSincronizar = false;
  async function sincronizar() {
    const fila = lerFila();
    if (!fila.length || aSincronizar || !navigator.onLine) return;
    const { data: { session } } = await sb.auth.getSession(); if (!session) return;
    aSincronizar = true; estadoSB(`⏳ A enviar ${fila.length}…`, 'warn');
    let enviados = 0;
    try {
      while (lerFila().length) {
        const it = lerFila()[0];
        const r = it.op === 'save'
          ? await sb.from('faturas').upsert(Object.fromEntries(Object.entries(it.reg).filter(([k]) => !k.startsWith('_'))), { onConflict: 'id' })
          : await sb.from('faturas').delete().eq('id', it.id);
        if (r.error) {
          if (erroDeRede(r.error)) break;
          const errs = JSON.parse(localStorage.getItem('faturas_fila_erros') || '[]'); errs.push({ ...it, erro: r.error.message });
          localStorage.setItem('faturas_fila_erros', JSON.stringify(errs));
          toast('Um lançamento não foi aceite pelo Supabase: ' + r.error.message, 6000);
        } else enviados++;
        gravarFila(lerFila().slice(1));
      }
    } finally { aSincronizar = false; }
    if (enviados) { toast(`${enviados} ${enviados === 1 ? 'alteração enviada' : 'alterações enviadas'} para o Supabase.`); await carregar(true); driveAgendar(); }
    else estadoFila();
  }
  window.addEventListener('online', () => setTimeout(sincronizar, 1500));
  setInterval(sincronizar, 30000);
  setTimeout(sincronizar, 4000);
  $('#st-sb').onclick = () => { if (lerFila().length) sincronizar(); else carregar(); };
  window.addEventListener('beforeunload', e => { if (lerFila().length) { e.preventDefault(); e.returnValue = ''; } });

  /* rascunho automático da nova fatura */
  function limparRascunho(id) { if (!id) localStorage.removeItem(RASC_K); }
  $('#f-fat').addEventListener('input', () => {
    if (EDITAR) return;
    const d = {}; CAMPOS.forEach(c => d[c] = $('#c-' + c).value); d._trim = TRIM_FORM;
    localStorage.setItem(RASC_K, JSON.stringify(d));
  });
  const abrirFormOriginal = abrirForm;
  abrirForm = function (f) {
    abrirFormOriginal(f);
    if (f) return;
    let d = null; try { d = JSON.parse(localStorage.getItem(RASC_K) || 'null'); } catch (e) {}
    if (d && CAMPOS.some(c => c !== 'data_doc' && d[c])) {
      CAMPOS.forEach(c => { if (d[c] != null) $('#c-' + c).value = d[c]; });
      if (d._trim) { TRIM_FORM = d._trim; trimManual = true; pintarTrimPick(); }
      verNif();
      toast('Rascunho recuperado – continue onde ficou.');
    }
  };
  $('#fab').onclick = () => abrirForm(null);
  if (typeof TODAS !== 'undefined' && TODAS.length) guardarCache();

  /* ---------- DEFINIÇÕES: pessoas com acesso à app ---------- */
  const cssAc = document.createElement('style');
  cssAc.textContent = `
  .ac-sep{border:0;border-top:2px dashed var(--line);margin:22px 0 14px}
  .ac{background:#fff;border:1px solid var(--line);border-left:6px solid var(--arca);border-radius:var(--r-s);padding:12px 14px;margin-bottom:8px}
  .ac.eu{border-left-color:var(--t2)}
  .ac b{display:block;word-break:break-all}
  .ac small{display:block;color:var(--ink2);font-size:.84rem;margin-top:2px}
  .ac .linha-btns{margin-top:10px}
  .pw-linha{display:flex;gap:8px}
  .pw-linha input{flex:1}
  .pw-linha button{flex:none;border:1.5px solid var(--line);background:#fff;border-radius:var(--r-s);padding:0 12px;font-weight:700}`;
  document.head.appendChild(cssAc);
  let ACESSOS = [], FORM_AC = false, EU = '';
  async function carregarAcessos() {
    const [{ data }, u] = await Promise.all([sb.rpc('faturas_utilizadores'), sb.auth.getUser()]);
    ACESSOS = data || []; EU = (u.data.user?.email || '').toLowerCase();
  }
  const dataCurta = d => d ? new Date(d).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : 'nunca';
  function pintarAcessos() {
    const box = document.createElement('div');
    box.id = 'ac-box';
    box.innerHTML = `<hr class="ac-sep"><p class="def-sub">Pessoas com acesso à app</p>
      ${FORM_AC ? `<div class="ct-form">
        <label class="fld"><span>Nome</span><input id="ac-nome" placeholder="Ex.: Tesoureiro"></label>
        <label class="fld"><span>Email (é com este email que a pessoa entra)</span><input id="ac-email" type="email" autocomplete="off"></label>
        <label class="fld"><span>Password criada por si (mínimo 8 caracteres)</span><span class="pw-linha"><input id="ac-pass" type="password" autocomplete="new-password"><button type="button" id="ac-ver">Ver</button></span></label>
        <p class="meta" style="margin:-4px 0 12px">Se o email já tiver conta na ARCA (por exemplo, do backoffice do site), só é dado o acesso: a pessoa entra com a password que já usa.</p>
        <div class="acoes" style="margin-bottom:10px"><button class="btn ghost" id="ac-cancel">Cancelar</button><button class="btn" id="ac-save">Dar acesso</button></div>
      </div>` : `<button class="btn full" id="ac-novo" style="margin-bottom:12px">+ Dar acesso a uma pessoa</button>`}
      ${ACESSOS.map(a => { const eu = a.email.toLowerCase() === EU; return `<div class="ac ${eu ? 'eu' : ''}"><b>${esc(a.nome || a.email)}${eu ? ' (você)' : ''}</b>
        <small>${esc(a.email)}</small>
        <small>${a.tem_conta ? 'Último acesso: ' + dataCurta(a.ultimo_acesso) : 'Ainda sem conta criada'}</small>
        <div class="linha-btns">${a.pode_mudar_password && a.tem_conta ? `<button class="btn ghost small" data-acpw="${esc(a.email)}">Mudar password</button>` : ''}${eu ? '' : `<button class="btn ghost small" data-acdel="${esc(a.email)}" style="color:var(--bad)">Remover acesso</button>`}</div></div>`; }).join('')}`;
    const velho = $('#ac-box'); if (velho) velho.remove();
    $('#def-corpo').appendChild(box);
    const nv = $('#ac-novo'); if (nv) nv.onclick = () => { FORM_AC = true; pintarDef(); setTimeout(() => { const n = $('#ac-nome'); if (n) { n.scrollIntoView({ block: 'center' }); n.focus(); } }, 60); };
    const cc = $('#ac-cancel'); if (cc) cc.onclick = () => { FORM_AC = false; pintarDef(); };
    const vr = $('#ac-ver'); if (vr) vr.onclick = () => { const p = $('#ac-pass'); p.type = p.type === 'password' ? 'text' : 'password'; vr.textContent = p.type === 'password' ? 'Ver' : 'Ocultar'; };
    const sv = $('#ac-save'); if (sv) sv.onclick = async () => {
      const nome = $('#ac-nome').value.trim(), email = $('#ac-email').value.trim().toLowerCase(), pass = $('#ac-pass').value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Escreva um email válido.');
      if (ACESSOS.some(a => a.email.toLowerCase() === email)) return toast('Esta pessoa já tem acesso.');
      sv.disabled = true;
      const { data, error } = await sb.rpc('faturas_dar_acesso', { p_email: email, p_nome: nome, p_password: pass });
      sv.disabled = false;
      if (error) return toast('Não foi possível: ' + error.message, 6000);
      toast(data === 'criado' ? `Acesso criado. ${email} já pode entrar com a password que escolheu.` : `Acesso dado. ${email} já tinha conta e entra com a password que já usa.`, 6000);
      FORM_AC = false; await carregarAcessos(); pintarDef();
    };
    $('#def-corpo').querySelectorAll('[data-acpw]').forEach(b => b.onclick = async () => {
      const p = prompt(`Nova password para ${b.dataset.acpw} (mínimo 8 caracteres):`); if (!p) return;
      if (p.length < 8) return toast('A password tem de ter pelo menos 8 caracteres.');
      const { error } = await sb.rpc('faturas_mudar_password', { p_email: b.dataset.acpw, p_password: p });
      toast(error ? 'Não foi possível: ' + error.message : 'Password alterada.', 5000);
    });
    $('#def-corpo').querySelectorAll('[data-acdel]').forEach(b => b.onclick = async () => {
      if (!confirm(`Retirar o acesso de ${b.dataset.acdel} à app das faturas?`)) return;
      const { error } = await sb.rpc('faturas_remover_acesso', { p_email: b.dataset.acdel });
      if (error) return toast('Não foi possível: ' + error.message, 5000);
      toast('Acesso removido.'); await carregarAcessos(); pintarDef();
    });
  }
  const pintarDefOriginal = pintarDef;
  pintarDef = function () { pintarDefOriginal(); pintarAcessos(); };
  const abrirDefOriginal = window.abrirDefinicoes;
  window.abrirDefinicoes = async function () { FORM_AC = false; await carregarAcessos(); return abrirDefOriginal(); };
})();
