const STORAGE_KEY_LANCAMENTOS = 'ecoreciclagem_historico_lancamentos';

let periodoAtivo = 'diario'; // 'diario' | 'semanal' | 'mensal'

// Elementos da DOM
const kpiTotalCompras = document.getElementById('kpiTotalCompras');
const kpiTotalVendas = document.getElementById('kpiTotalVendas');
const kpiPesoComprado = document.getElementById('kpiPesoComprado');
const kpiPesoVendido = document.getElementById('kpiPesoVendido');
const kpiPesoTotal = document.getElementById('kpiPesoTotal');
const kpiQtdLancamentos = document.getElementById('kpiQtdLancamentos');
const subtotalComprasBadge = document.getElementById('subtotalComprasBadge');
const subtotalVendasBadge = document.getElementById('subtotalVendasBadge');

const tabelaConsolidadoComprasBody = document.querySelector('#tabelaConsolidadoCompras tbody');
const tabelaConsolidadoVendasBody = document.querySelector('#tabelaConsolidadoVendas tbody');
const containerLista = document.getElementById('listaLancamentosContainer');
const buscaInput = document.getElementById('buscaLancamento');
const tituloHistorico = document.getElementById('tituloHistorico');

// Modal de Edição
const modalEditar = document.getElementById('modalEditarItem');
const btnFecharModal = document.getElementById('btnFecharModalEdicao');
const btnCancelarModal = document.getElementById('btnCancelarEdicaoItem');
const formEdicao = document.getElementById('formEdicaoItemLancamento');
const editLancamentoId = document.getElementById('editLancamentoId');
const editItemIndex = document.getElementById('editItemIndex');
const editMaterialNome = document.getElementById('editMaterialNome');
const editPeso = document.getElementById('editPeso');
const editPreco = document.getElementById('editPreco');

function carregarImagemBase64(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function obterLancamentos() {
  const dados = localStorage.getItem(STORAGE_KEY_LANCAMENTOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarLancamentos(lista) {
  localStorage.setItem(STORAGE_KEY_LANCAMENTOS, JSON.stringify(lista));
}

function formatarData(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatarMoeda(v) {
  return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pertenceAoPeriodo(isoString) {
  const data = new Date(isoString);
  const agora = new Date();

  if (periodoAtivo === 'diario') {
    return data.toDateString() === agora.toDateString();
  }

  if (periodoAtivo === 'semanal') {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(agora.getDate() - 7);
    return data >= seteDiasAtras && data <= agora;
  }

  if (periodoAtivo === 'mensal') {
    return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
  }

  return true;
}

window.trocarPeriodo = function(periodo) {
  periodoAtivo = periodo;
  document.querySelectorAll('.btn-periodo').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.periodo === periodo);
  });

  const titulos = {
    diario: 'Lançamentos Detalhados (Hoje)',
    semanal: 'Lançamentos Detalhados (Últimos 7 Dias)',
    mensal: 'Lançamentos Detalhados (Mês Atual)'
  };
  if (tituloHistorico) tituloHistorico.textContent = titulos[periodo] || 'Lançamentos Detalhados';

  carregarDashboard(buscaInput ? buscaInput.value : '');
};

function processarConsolidado(lancamentos) {
  const comprasMap = {};
  const vendasMap = {};

  lancamentos.forEach(l => {
    const mapAlvo = l.operacao === 'compra' ? comprasMap : vendasMap;

    l.itens.forEach(item => {
      if (!mapAlvo[item.nome]) {
        mapAlvo[item.nome] = { peso: 0, total: 0, unidade: item.unidade || 'KG' };
      }
      mapAlvo[item.nome].peso += item.peso;
      mapAlvo[item.nome].total += item.total;
    });
  });

  return { comprasMap, vendasMap };
}

function renderizarTabelaConsolidada(tbody, mapa, totalBadge) {
  tbody.innerHTML = '';
  const chaves = Object.keys(mapa);
  let somaTotal = 0;

  if (chaves.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Nenhum item movimentado neste período.</td></tr>`;
    if (totalBadge) totalBadge.textContent = 'R$ 0,00';
    return;
  }

  chaves.sort().forEach(nome => {
    const dado = mapa[nome];
    somaTotal += dado.total;
    const precoMedio = dado.peso > 0 ? (dado.total / dado.peso) : 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${nome}</strong></td>
      <td>${dado.peso.toFixed(3).replace('.', ',')} ${dado.unidade}</td>
      <td>R$ ${formatarMoeda(precoMedio)}</td>
      <td><strong>R$ ${formatarMoeda(dado.total)}</strong></td>
    `;
    tbody.appendChild(tr);
  });

  if (totalBadge) totalBadge.textContent = `R$ ${formatarMoeda(somaTotal)}`;
}

function carregarDashboard(filtro = '') {
  const lista = obterLancamentos();
  const termo = filtro.toLowerCase().trim();

  const lancamentosPeriodo = lista.filter(l => pertenceAoPeriodo(l.dataHora));

  let comprasTotal = 0;
  let vendasTotal = 0;
  let pesoComprado = 0;
  let pesoVendido = 0;

  lancamentosPeriodo.forEach(l => {
    if (l.operacao === 'compra') {
      comprasTotal += l.valorFinal;
      pesoComprado += l.totalPeso;
    } else {
      vendasTotal += l.valorFinal;
      pesoVendido += l.totalPeso;
    }
  });

  const pesoTotal = pesoComprado + pesoVendido;

  if (kpiTotalCompras) kpiTotalCompras.textContent = `R$ ${formatarMoeda(comprasTotal)}`;
  if (kpiTotalVendas) kpiTotalVendas.textContent = `R$ ${formatarMoeda(vendasTotal)}`;
  if (kpiPesoComprado) kpiPesoComprado.textContent = `${pesoComprado.toFixed(3).replace('.', ',')} kg`;
  if (kpiPesoVendido) kpiPesoVendido.textContent = `${pesoVendido.toFixed(3).replace('.', ',')} kg`;
  if (kpiPesoTotal) kpiPesoTotal.textContent = `${pesoTotal.toFixed(3).replace('.', ',')} kg`;
  if (kpiQtdLancamentos) kpiQtdLancamentos.textContent = lancamentosPeriodo.length;

  const { comprasMap, vendasMap } = processarConsolidado(lancamentosPeriodo);
  renderizarTabelaConsolidada(tabelaConsolidadoComprasBody, comprasMap, subtotalComprasBadge);
  renderizarTabelaConsolidada(tabelaConsolidadoVendasBody, vendasMap, subtotalVendasBadge);

  const filtrados = lancamentosPeriodo.filter(l => 
    l.id.toLowerCase().includes(termo) ||
    l.fornecedor.nome.toLowerCase().includes(termo) ||
    l.operacao.toLowerCase().includes(termo)
  );

  containerLista.innerHTML = '';

  if (filtrados.length === 0) {
    containerLista.innerHTML = `<div class="card text-center text-muted" style="padding: 30px;">Nenhum lançamento encontrado para os filtros selecionados.</div>`;
    return;
  }

  filtrados.forEach(l => {
    const card = document.createElement('div');
    card.className = 'lancamento-card';

    card.innerHTML = `
      <div class="lancamento-header" onclick="toggleAccordion('${l.id}')">
        <div class="lancamento-info-principal">
          <span class="badge-id">${l.id}</span>
          <span class="badge-tipo ${l.operacao}">${l.operacao}</span>
          <strong>${l.fornecedor.codigo} - ${l.fornecedor.nome}</strong>
          <small class="text-muted"><i class="fa-regular fa-clock"></i> ${formatarData(l.dataHora)}</small>
        </div>
        <div class="lancamento-header-actions">
          <span class="lancamento-valor-final">R$ ${formatarMoeda(l.valorFinal)}</span>
          <button type="button" class="btn-icon btn-remove" onclick="excluirLancamentoCompleto(event, '${l.id}')" title="Excluir Lançamento Completo">
            <i class="fa-solid fa-trash"></i>
          </button>
          <i class="fa-solid fa-chevron-down text-muted" id="icon-${l.id}"></i>
        </div>
      </div>

      <div class="lancamento-corpo" id="corpo-${l.id}">
        <table class="data-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Peso Líquido</th>
              <th>Preço Aplicado</th>
              <th>Subtotal</th>
              <th style="width: 100px; text-align: center;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${l.itens.map((item, idx) => `
              <tr>
                <td><strong>${item.nome}</strong></td>
                <td>${item.peso.toFixed(3).replace('.', ',')} ${item.unidade}</td>
                <td>R$ ${formatarMoeda(item.precoUnitario)}</td>
                <td><strong>R$ ${formatarMoeda(item.total)}</strong></td>
                <td>
                  <div class="table-actions-cell">
                    <button type="button" class="btn-icon edit" onclick="abrirModalEdicao('${l.id}', ${idx})" title="Editar Item">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="btn-icon btn-remove" onclick="excluirItemLancamento('${l.id}', ${idx})" title="Excluir Item">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="lancamento-footer-totais">
          <span>Peso Total: <strong>${l.totalPeso.toFixed(3).replace('.', ',')} kg</strong></span>
          <span>Descontos: <strong>R$ ${formatarMoeda(l.totalDescontos)}</strong></span>
          <span>Total Líquido: <strong class="lancamento-valor-final">R$ ${formatarMoeda(l.valorFinal)}</strong></span>
        </div>
      </div>
    `;

    containerLista.appendChild(card);
  });
}

window.toggleAccordion = function(id) {
  const corpo = document.getElementById(`corpo-${id}`);
  const icone = document.getElementById(`icon-${id}`);
  if (corpo) {
    const aberto = corpo.classList.toggle('aberto');
    if (icone) icone.className = aberto ? 'fa-solid fa-chevron-up text-muted' : 'fa-solid fa-chevron-down text-muted';
  }
};

window.abrirModalEdicao = function(lancamentoId, itemIndex) {
  const lista = obterLancamentos();
  const lanc = lista.find(l => l.id === lancamentoId);
  if (!lanc || !lanc.itens[itemIndex]) return;

  const item = lanc.itens[itemIndex];
  editLancamentoId.value = lancamentoId;
  editItemIndex.value = itemIndex;
  editMaterialNome.value = item.nome;
  editPeso.value = item.peso.toFixed(3).replace('.', ',');
  editPreco.value = `R$ ${formatarMoeda(item.precoUnitario)}`;

  modalEditar.classList.remove('hidden');
};

function fecharModal() {
  modalEditar.classList.add('hidden');
}

btnFecharModal.addEventListener('click', fecharModal);
btnCancelarModal.addEventListener('click', fecharModal);

formEdicao.addEventListener('submit', (e) => {
  e.preventDefault();
  const lancId = editLancamentoId.value;
  const itemIdx = parseInt(editItemIndex.value, 10);

  const pesoNum = parseFloat(editPeso.value.replace(/\D/g, '')) / 1000;
  const precoNum = parseFloat(editPreco.value.replace(/\D/g, '')) / 100;

  if (pesoNum <= 0 || precoNum <= 0) {
    alert('Informe peso e preço válidos.');
    return;
  }

  let lista = obterLancamentos();
  const lanc = lista.find(l => l.id === lancId);
  if (!lanc) return;

  lanc.itens[itemIdx].peso = pesoNum;
  lanc.itens[itemIdx].precoUnitario = precoNum;
  lanc.itens[itemIdx].total = pesoNum * precoNum;

  lanc.totalPeso = lanc.itens.reduce((acc, i) => acc + i.peso, 0);
  lanc.totalBruto = lanc.itens.reduce((acc, i) => acc + i.total, 0);
  lanc.valorFinal = Math.max(0, lanc.totalBruto - lanc.totalDescontos);

  salvarLancamentos(lista);
  fecharModal();
  carregarDashboard(buscaInput.value);
});

window.excluirItemLancamento = function(lancamentoId, itemIndex) {
  let lista = obterLancamentos();
  const lanc = lista.find(l => l.id === lancamentoId);
  if (!lanc) return;

  if (lanc.itens.length <= 1) {
    if (confirm('Este é o único item do lançamento. Excluir este item removerá o lançamento completo. Deseja continuar?')) {
      lista = lista.filter(l => l.id !== lancamentoId);
      salvarLancamentos(lista);
      carregarDashboard(buscaInput ? buscaInput.value : '');
    }
    return;
  }

  if (confirm(`Deseja remover o item "${lanc.itens[itemIndex].nome}" deste lançamento?`)) {
    lanc.itens.splice(itemIndex, 1);

    lanc.totalPeso = lanc.itens.reduce((acc, i) => acc + i.peso, 0);
    lanc.totalBruto = lanc.itens.reduce((acc, i) => acc + i.total, 0);
    lanc.valorFinal = Math.max(0, lanc.totalBruto - lanc.totalDescontos);

    salvarLancamentos(lista);
    carregarDashboard(buscaInput ? buscaInput.value : '');
  }
};

window.excluirLancamentoCompleto = function(event, lancamentoId) {
  event.stopPropagation();
  
  if (confirm(`Tem certeza que deseja excluir o lançamento [${lancamentoId}] permanentemente?`)) {
    let lista = obterLancamentos();
    lista = lista.filter(l => l.id !== lancamentoId);
    salvarLancamentos(lista);
    carregarDashboard(buscaInput ? buscaInput.value : '');
  }
};

async function gerarPDFRelatorioPeriodo() {
  const jsPdfLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPdfLib) {
    alert('Biblioteca jsPDF não carregada.');
    return;
  }

  const lista = obterLancamentos();
  const lancamentosPeriodo = lista.filter(l => pertenceAoPeriodo(l.dataHora));

  if (lancamentosPeriodo.length === 0) {
    alert('Não há lançamentos registrados neste período para gerar o relatório em PDF.');
    return;
  }

  const doc = new jsPdfLib({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const titulosPeriodo = {
    diario: 'RELATÓRIO CONSOLIDADO DIÁRIO (HOJE)',
    semanal: 'RELATÓRIO CONSOLIDADO SEMANAL (ÚLTIMOS 7 DIAS)',
    mensal: 'RELATÓRIO CONSOLIDADO MENSAL (MÊS ATUAL)'
  };
  const tituloRelatorio = titulosPeriodo[periodoAtivo] || 'RELATÓRIO CONSOLIDADO';

  let comprasTotal = 0;
  let vendasTotal = 0;
  let pesoComprado = 0;
  let pesoVendido = 0;

  lancamentosPeriodo.forEach(l => {
    if (l.operacao === 'compra') {
      comprasTotal += l.valorFinal;
      pesoComprado += l.totalPeso;
    } else {
      vendasTotal += l.valorFinal;
      pesoVendido += l.totalPeso;
    }
  });

  const { comprasMap, vendasMap } = processarConsolidado(lancamentosPeriodo);

  const verdePrimario = [16, 185, 129];
  const verdeEscuro = [6, 95, 70];
  const azulEscuro = [30, 64, 175];
  const fundoCard = [248, 250, 252];
  const bordaCinza = [226, 232, 240];
  const textoPrincipal = [15, 23, 42];
  const textoSuave = [100, 116, 139];

  doc.setFillColor(...verdePrimario);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Carrega e renderiza a Logo no Cabeçalho
  const logoInfo = await carregarImagemBase64('../front%20code/assets/logo.png');
  let textStartX = 14;

  if (logoInfo) {
    const logoHeight = 14;
    const logoWidth = (logoInfo.width / logoInfo.height) * logoHeight;
    doc.addImage(logoInfo.dataUrl, 'PNG', 14, 10, logoWidth, logoHeight);
    textStartX = 14 + logoWidth + 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...verdeEscuro);
  doc.text('DV RECICLAGEM', textStartX, 15);

  doc.setFontSize(7.5);
  doc.setTextColor(...textoSuave);
  doc.setFont('helvetica', 'normal');
  doc.text('EcoManager - Painel de Controle Analítico', textStartX, 19.5);
  doc.text(`Emissão: ${dataFormatada}`, textStartX, 23.5);

  doc.setFillColor(...fundoCard);
  doc.setDrawColor(...bordaCinza);
  doc.roundedRect(pageWidth - 85, 9, 71, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...verdeEscuro);
  doc.text(tituloRelatorio, pageWidth - 82, 15, { maxWidth: 66 });
  doc.setFontSize(7);
  doc.setTextColor(...textoSuave);
  doc.setFont('helvetica', 'normal');
  doc.text(`Lançamentos no período: ${lancamentosPeriodo.length}`, pageWidth - 82, 21.5);

  doc.setFillColor(...fundoCard);
  doc.setDrawColor(...bordaCinza);
  doc.roundedRect(14, 30, pageWidth - 28, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textoPrincipal);
  doc.text(`Total Compras: R$ ${formatarMoeda(comprasTotal)}`, 18, 36);
  doc.text(`Total Vendas: R$ ${formatarMoeda(vendasTotal)}`, 75, 36);
  doc.text(`Resultado: R$ ${formatarMoeda(vendasTotal - comprasTotal)}`, 135, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textoSuave);
  doc.text(`Peso Comprado: ${pesoComprado.toFixed(3).replace('.', ',')} kg`, 18, 42);
  doc.text(`Peso Vendido: ${pesoVendido.toFixed(3).replace('.', ',')} kg`, 75, 42);
  doc.text(`Peso Movimentado: ${(pesoComprado + pesoVendido).toFixed(3).replace('.', ',')} kg`, 135, 42);

  let posY = 50;

  const chavesCompras = Object.keys(comprasMap);
  if (chavesCompras.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...verdeEscuro);
    doc.text('CONSOLIDADO DE COMPRAS (POR MATERIAL)', 14, posY + 4);

    const linhasCompras = chavesCompras.sort().map(nome => {
      const d = comprasMap[nome];
      const precoMedio = d.peso > 0 ? d.total / d.peso : 0;
      return [
        nome,
        `${d.peso.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} ${d.unidade}`,
        `R$ ${formatarMoeda(precoMedio)}`,
        `R$ ${formatarMoeda(d.total)}`
      ];
    });

    doc.autoTable({
      head: [['Material', 'Peso Acumulado', 'Preço Médio (R$)', 'Total Gasto (R$)']],
      body: linhasCompras,
      startY: posY + 6,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: textoPrincipal },
      headStyles: { fillColor: verdeEscuro, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold' }
      }
    });

    posY = doc.lastAutoTable.finalY + 8;
  }

  const chavesVendas = Object.keys(vendasMap);
  if (chavesVendas.length > 0) {
    if (posY > 230) {
      doc.addPage();
      posY = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...azulEscuro);
    doc.text('CONSOLIDADO DE VENDAS (POR MATERIAL)', 14, posY + 4);

    const linhasVendas = chavesVendas.sort().map(nome => {
      const d = vendasMap[nome];
      const precoMedio = d.peso > 0 ? d.total / d.peso : 0;
      return [
        nome,
        `${d.peso.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} ${d.unidade}`,
        `R$ ${formatarMoeda(precoMedio)}`,
        `R$ ${formatarMoeda(d.total)}`
      ];
    });

    doc.autoTable({
      head: [['Material', 'Peso Acumulado', 'Preço Médio (R$)', 'Total Faturado (R$)']],
      body: linhasVendas,
      startY: posY + 6,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: textoPrincipal },
      headStyles: { fillColor: azulEscuro, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold' }
      }
    });
  }

  doc.save(`Relatorio_Consolidado_${periodoAtivo.toUpperCase()}_${Date.now()}.pdf`);
}

const btnExportarPDF = document.getElementById('btnExportarPDFRelatorio');
if (btnExportarPDF) {
  btnExportarPDF.addEventListener('click', gerarPDFRelatorioPeriodo);
}

editPeso.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  e.target.value = v ? (parseFloat(v) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '';
});

editPreco.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  e.target.value = v ? `R$ ${(parseFloat(v) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
});

if (buscaInput) {
  buscaInput.addEventListener('input', (e) => carregarDashboard(e.target.value));
}

document.addEventListener('DOMContentLoaded', () => carregarDashboard());