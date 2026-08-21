const STORAGE_KEY_LANCAMENTOS = 'ecoreciclagem_historico_lancamentos';

const kpiTotalCompras = document.getElementById('kpiTotalCompras');
const kpiTotalVendas = document.getElementById('kpiTotalVendas');
const kpiPesoTotal = document.getElementById('kpiPesoTotal');
const kpiQtdLancamentos = document.getElementById('kpiQtdLancamentos');
const containerLista = document.getElementById('listaLancamentosContainer');
const buscaInput = document.getElementById('buscaLancamento');

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

function carregarDashboard(filtro = '') {
  const lista = obterLancamentos();
  const termo = filtro.toLowerCase().trim();

  const hoje = new Date().toDateString();
  let comprasDia = 0;
  let vendasDia = 0;
  let pesoDia = 0;
  let qtdDia = 0;

  lista.forEach(l => {
    const dataL = new Date(l.dataHora).toDateString();
    if (dataL === hoje) {
      qtdDia++;
      pesoDia += l.totalPeso;
      if (l.operacao === 'compra') comprasDia += l.valorFinal;
      else vendasDia += l.valorFinal;
    }
  });

  kpiTotalCompras.textContent = `R$ ${formatarMoeda(comprasDia)}`;
  kpiTotalVendas.textContent = `R$ ${formatarMoeda(vendasDia)}`;
  kpiPesoTotal.textContent = `${pesoDia.toFixed(3).replace('.', ',')} kg`;
  kpiQtdLancamentos.textContent = qtdDia;

  // Filtragem da lista
  const filtrados = lista.filter(l => 
    l.id.toLowerCase().includes(termo) ||
    l.fornecedor.nome.toLowerCase().includes(termo) ||
    l.operacao.toLowerCase().includes(termo)
  );

  containerLista.innerHTML = '';

  if (filtrados.length === 0) {
    containerLista.innerHTML = `<div class="card text-center text-muted" style="padding: 30px;">Nenhum lançamento registrado no sistema.</div>`;
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
        <div style="display: flex; align-items: center; gap: 15px;">
          <strong style="color: #065f46; font-size: 1.05rem;">R$ ${formatarMoeda(l.valorFinal)}</strong>
          <i class="fa-solid fa-chevron-down text-muted" id="icon-${l.id}"></i>
        </div>
      </div>

      <div class="lancamento-corpo" id="corpo-${l.id}">
        <table class="data-table" style="margin-bottom: 15px;">
          <thead>
            <tr>
              <th>Material</th>
              <th>Peso Líquido</th>
              <th>Preço Aplicado</th>
              <th>Subtotal</th>
              <th style="width: 80px; text-align: center;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${l.itens.map((item, idx) => `
              <tr>
                <td><strong>${item.nome}</strong></td>
                <td>${item.peso.toFixed(3).replace('.', ',')} ${item.unidade}</td>
                <td>R$ ${formatarMoeda(item.precoUnitario)}</td>
                <td><strong>R$ ${formatarMoeda(item.total)}</strong></td>
                <td style="text-align: center;">
                  <button type="button" class="btn-icon edit" onclick="abrirModalEdicao('${l.id}', ${idx})" title="Editar Item">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="display: flex; justify-content: flex-end; gap: 20px; font-size: 0.9rem; color: #64748b;">
          <span>Peso Total: <strong>${l.totalPeso.toFixed(3).replace('.', ',')} kg</strong></span>
          <span>Descontos: <strong>R$ ${formatarMoeda(l.totalDescontos)}</strong></span>
          <span>Total Líquido: <strong style="color: #065f46;">R$ ${formatarMoeda(l.valorFinal)}</strong></span>
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

  // Atualiza item específico
  lanc.itens[itemIdx].peso = pesoNum;
  lanc.itens[itemIdx].precoUnitario = precoNum;
  lanc.itens[itemIdx].total = pesoNum * precoNum;

  // Recalcula totais do comprovante
  lanc.totalPeso = lanc.itens.reduce((acc, i) => acc + i.peso, 0);
  lanc.totalBruto = lanc.itens.reduce((acc, i) => acc + i.total, 0);
  lanc.valorFinal = Math.max(0, lanc.totalBruto - lanc.totalDescontos);

  salvarLancamentos(lista);
  fecharModal();
  carregarDashboard(buscaInput.value);
});

// Máscaras dos inputs no modal de edição
editPeso.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  e.target.value = v ? (parseFloat(v) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '';
});

editPreco.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  e.target.value = v ? `R$ ${(parseFloat(v) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
});

buscaInput.addEventListener('input', (e) => carregarDashboard(e.target.value));
document.addEventListener('DOMContentLoaded', () => carregarDashboard());