const STORAGE_KEY_FORNECEDORES = 'ecoreciclagem_fornecedores';
const STORAGE_KEY_MATERIAIS = 'ecoreciclagem_materiais';

const fornecedoresIniciais = [
  {
    codigo: "126307",
    nome: "DIEGO DA SILVA NOBRE",
    doc: "013.605.343-26",
    celular: "(85) 99866-0975",
    endereco: "AVENIDA IMPERADOR Nº.110 BAIRRO: CENTRO/FORTALEZA/CE CEP: 60.015-050",
    email: "diego.nobre@exemplo.com"
  },
  {
    codigo: "100201",
    nome: "RECICLAGEM CENTRAL LTDA",
    doc: "12.345.678/0001-90",
    celular: "(85) 98888-0000",
    endereco: "RUA ANTONIO MARTINS Nº.102 - DAMAS/FORTALEZA/CE",
    email: "contato@reciclagemcentral.com"
  }
];

const materiaisIniciais = [
  { id: "000030-S", nome: "PLACA MARROM - A", unidade: "KG", precoKg: 30.00 },
  { id: "1575-S", nome: "PLACA INTERMEDIARIA - C", unidade: "KG", precoKg: 47.00 },
  { id: "000028-S", nome: "PLACA PESADA - B", unidade: "KG", precoKg: 27.00 },
  { id: "1568-S", nome: "PLACA MAE D - (FERRO)", unidade: "KG", precoKg: 27.00 },
  { id: "2000-S", nome: "PLACA INTERMEDIARIA - MODEM", unidade: "KG", precoKg: 26.00 },
  { id: "171-S", nome: "IMPUREZA", unidade: "KG", precoKg: 0.00 },
  { id: "000061-S", nome: "HD", unidade: "KG", precoKg: 17.00 },
  { id: "1572-S", nome: "PLACA LEVE - B", unidade: "KG", precoKg: 120.00 },
  { id: "000006-S", nome: "PLACA LEVE - C", unidade: "KG", precoKg: 120.00 },
  { id: "1579-S", nome: "PLACA DE TELEFONIA - B", unidade: "KG", precoKg: 185.00 },
  { id: "1566-S", nome: "PLACA MAE C", unidade: "KG", precoKg: 50.00 },
  { id: "383-S", nome: "EMBALAGEM", unidade: "KG", precoKg: 0.00 },
  { id: "1574-S", nome: "PLACA INTERMEDIARIA - B", unidade: "KG", precoKg: 55.00 },
  { id: "000036-S", nome: "PLACA DE CELULAR", unidade: "KG", precoKg: 250.00 },
  { id: "1002-S", nome: "PLACA DE NOTEBOOK B", unidade: "KG", precoKg: 165.00 },
  { id: "1003-S", nome: "PLACA DE NOTEBOOK C", unidade: "KG", precoKg: 75.00 },
  { id: "1573-S", nome: "PLACA INTERMEDIARIA - A", unidade: "KG", precoKg: 63.00 },
  { id: "000007-S", nome: "PLACA DE DRIVE", unidade: "KG", precoKg: 120.00 },
  { id: "000009-S", nome: "PLACA DE TABLET", unidade: "KG", precoKg: 85.00 },
  { id: "000049-S", nome: "PROCESSADOR DE FIBRA COBRE - A", unidade: "KG", precoKg: 170.00 },
  { id: "000045-S", nome: "MEMORIA - A", unidade: "KG", precoKg: 450.00 }
];

let itensPesagem = [];
let descontos = [];
let fornecedorSelecionado = null;

// Elementos Fornecedor
const wrapperFornecedor = document.getElementById('wrapperFornecedor');
const optionsFornecedor = document.getElementById('optionsFornecedor');
const selectFornecedor = document.getElementById('selectFornecedor');
const inputBuscaFornecedor = document.getElementById('inputBuscaFornecedor');
const fornecedorDoc = document.getElementById('fornecedorDoc');
const fornecedorFone = document.getElementById('fornecedorFone');
const fornecedorEndereco = document.getElementById('fornecedorEndereco');

// Elementos Material
const wrapperMaterial = document.getElementById('wrapperMaterial');
const optionsMaterial = document.getElementById('optionsMaterial');
const selectMaterial = document.getElementById('selectMaterial');
const inputBuscaMaterial = document.getElementById('inputBuscaMaterial');
const precoKgInput = document.getElementById('precoKg');
const pesoBrutoInput = document.getElementById('pesoBruto');
const subtotalPrevisto = document.getElementById('subtotalPrevisto');
const formAdicionarItem = document.getElementById('formAdicionarItem');

// Elementos Resumo
const tabelaItensCorpo = document.querySelector('#tabelaItens tbody');
const kpiPeso = document.getElementById('kpiPeso');
const kpiValor = document.getElementById('kpiValor');
const secaoDescontos = document.getElementById('secaoDescontos');
const listaDescontos = document.getElementById('listaDescontos');
const kpiDescontoWrapper = document.getElementById('kpiDescontoWrapper');
const kpiDesconto = document.getElementById('kpiDesconto');

// Modal Desconto
const btnAbrirModalDesconto = document.getElementById('btnAbrirModalDesconto');
const modalDesconto = document.getElementById('modalDesconto');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const formModalDesconto = document.getElementById('formModalDesconto');
const descMotivo = document.getElementById('descMotivo');
const descValor = document.getElementById('descValor');

function obterFornecedores() {
  const dados = localStorage.getItem(STORAGE_KEY_FORNECEDORES);
  if (!dados) {
    localStorage.setItem(STORAGE_KEY_FORNECEDORES, JSON.stringify(fornecedoresIniciais));
    return fornecedoresIniciais;
  }
  return JSON.parse(dados);
}

function obterMateriais() {
  const dados = localStorage.getItem(STORAGE_KEY_MATERIAIS);
  if (!dados) {
    localStorage.setItem(STORAGE_KEY_MATERIAIS, JSON.stringify(materiaisIniciais));
    return materiaisIniciais;
  }
  return JSON.parse(dados);
}

function renderizarOpcoesFornecedores(termo = '') {
  const fornecedores = obterFornecedores();
  optionsFornecedor.innerHTML = '';

  const termoNormalizado = termo.toLowerCase().trim();
  const filtrados = fornecedores.filter(f => 
    f.codigo.toLowerCase().includes(termoNormalizado) ||
    f.nome.toLowerCase().includes(termoNormalizado)
  );

  if (filtrados.length === 0) {
    optionsFornecedor.innerHTML = `<div class="custom-option-empty">Nenhum fornecedor encontrado.</div>`;
    return;
  }

  filtrados.forEach(f => {
    const opt = document.createElement('div');
    opt.className = 'custom-option';
    opt.dataset.value = f.codigo;
    opt.textContent = `${f.codigo} - ${f.nome}`;

    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectFornecedor.value = f.codigo;
      const spanTrigger = wrapperFornecedor.querySelector('.custom-select-trigger span');
      spanTrigger.textContent = `${f.codigo} - ${f.nome}`;
      spanTrigger.classList.remove('placeholder');
      wrapperFornecedor.classList.remove('open');

      fornecedorSelecionado = f;
      fornecedorDoc.value = f.doc || '---';
      fornecedorFone.value = f.celular || f.fone || '---';
      fornecedorEndereco.value = f.endereco || '---';
    });

    optionsFornecedor.appendChild(opt);
  });
}

// ------------------------------------------------------------------
// LIMPAR DEMONSTRATIVO COMPLETO
// ------------------------------------------------------------------

const btnLimparTudo = document.getElementById('btnLimparTudo');

btnLimparTudo.addEventListener('click', () => {
  if (itensPesagem.length === 0 && descontos.length === 0 && !fornecedorSelecionado) {
    alert('O demonstrativo já está vazio.');
    return;
  }

  const confirmou = confirm('Tem certeza que deseja limpar todos os itens, descontos e dados do demonstrativo atual?');
  
  if (confirmou) {
    // 1. Limpa arrays de estado
    itensPesagem = [];
    descontos = [];
    fornecedorSelecionado = null;

    // 2. Reseta campos do Fornecedor
    selectFornecedor.value = '';
    const spanFornecedor = wrapperFornecedor.querySelector('.custom-select-trigger span');
    spanFornecedor.textContent = 'Selecione pelo Código / Nome...';
    spanFornecedor.classList.add('placeholder');
    fornecedorDoc.value = '';
    fornecedorFone.value = '';
    fornecedorEndereco.value = '';

    // 3. Reseta campos do Material
    selectMaterial.value = '';
    const spanMaterial = wrapperMaterial.querySelector('.custom-select-trigger span');
    spanMaterial.textContent = 'Selecione o material...';
    spanMaterial.classList.add('placeholder');
    precoKgInput.value = '';
    pesoBrutoInput.value = '';
    subtotalPrevisto.value = 'R$ 0,00';

    // 4. Renderiza a tabela limpa e zera os KPIs
    renderizarTabela();
  }
});

function renderizarOpcoesMateriais(termo = '') {
  const materiais = obterMateriais();
  optionsMaterial.innerHTML = '';

  const termoNormalizado = termo.toLowerCase().trim();
  const filtrados = materiais.filter(m => 
    m.id.toLowerCase().includes(termoNormalizado) ||
    m.nome.toLowerCase().includes(termoNormalizado)
  );

  if (filtrados.length === 0) {
    optionsMaterial.innerHTML = `<div class="custom-option-empty">Nenhum material encontrado.</div>`;
    return;
  }

  filtrados.forEach(m => {
    const opt = document.createElement('div');
    opt.className = 'custom-option';
    opt.dataset.value = m.id;
    opt.textContent = `${m.id} - ${m.nome} (R$ ${m.precoKg.toFixed(2)}/${m.unidade || 'KG'})`;

    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectMaterial.value = m.id;
      const spanTrigger = wrapperMaterial.querySelector('.custom-select-trigger span');
      spanTrigger.textContent = `${m.id} - ${m.nome}`;
      spanTrigger.classList.remove('placeholder');
      wrapperMaterial.classList.remove('open');

      precoKgInput.value = m.precoKg.toFixed(2);
      calcularSubtotalPrevia();
    });

    optionsMaterial.appendChild(opt);
  });
}

// Dropdown Eventos
wrapperFornecedor.querySelector('.custom-select-trigger').addEventListener('click', (e) => {
  e.stopPropagation();
  wrapperMaterial.classList.remove('open');
  const estaAberto = wrapperFornecedor.classList.toggle('open');
  if (estaAberto) {
    inputBuscaFornecedor.value = '';
    renderizarOpcoesFornecedores();
    setTimeout(() => inputBuscaFornecedor.focus(), 50);
  }
});

wrapperMaterial.querySelector('.custom-select-trigger').addEventListener('click', (e) => {
  e.stopPropagation();
  wrapperFornecedor.classList.remove('open');
  const estaAberto = wrapperMaterial.classList.toggle('open');
  if (estaAberto) {
    inputBuscaMaterial.value = '';
    renderizarOpcoesMateriais();
    setTimeout(() => inputBuscaMaterial.focus(), 50);
  }
});

inputBuscaFornecedor.addEventListener('click', (e) => e.stopPropagation());
inputBuscaMaterial.addEventListener('click', (e) => e.stopPropagation());

inputBuscaFornecedor.addEventListener('input', (e) => renderizarOpcoesFornecedores(e.target.value));
inputBuscaMaterial.addEventListener('input', (e) => renderizarOpcoesMateriais(e.target.value));

window.addEventListener('click', () => {
  wrapperFornecedor.classList.remove('open');
  wrapperMaterial.classList.remove('open');
});

// Máscaras e Cálculos
function parsePesoFormatado(valorTexto) {
  if (!valorTexto) return 0;
  const apenasDigitos = valorTexto.replace(/\D/g, '');
  return parseFloat(apenasDigitos) / 1000 || 0;
}

pesoBrutoInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (!v) {
    e.target.value = '';
    calcularSubtotalPrevia();
    return;
  }
  const valorNumerico = parseFloat(v) / 1000;
  e.target.value = valorNumerico.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
  calcularSubtotalPrevia();
});

function calcularSubtotalPrevia() {
  const preco = parseFloat(precoKgInput.value) || 0;
  const peso = parsePesoFormatado(pesoBrutoInput.value);
  const subtotal = preco * peso;
  subtotalPrevisto.value = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

formAdicionarItem.addEventListener('submit', (e) => {
  e.preventDefault();
  const matId = selectMaterial.value;
  const materiais = obterMateriais();
  const mat = materiais.find(item => item.id === matId);
  const peso = parsePesoFormatado(pesoBrutoInput.value);

  if (!mat || peso <= 0) {
    alert('Selecione um material e insira um peso válido.');
    return;
  }

  itensPesagem.push({
    id: mat.id,
    nome: mat.nome,
    unidade: mat.unidade || 'KG',
    peso: peso,
    precoUnitario: mat.precoKg,
    total: peso * mat.precoKg
  });

  renderizarTabela();

  selectMaterial.value = '';
  const matSpan = wrapperMaterial.querySelector('.custom-select-trigger span');
  matSpan.textContent = 'Selecione o material...';
  matSpan.classList.add('placeholder');
  precoKgInput.value = '';
  pesoBrutoInput.value = '';
  subtotalPrevisto.value = 'R$ 0,00';
});

function renderizarTabela() {
  tabelaItensCorpo.innerHTML = '';
  let somaPeso = 0;
  let somaBruta = 0;

  if (itensPesagem.length === 0) {
    tabelaItensCorpo.innerHTML = `
      <tr id="linhaVazia">
        <td colspan="6" class="text-center text-muted">Nenhum item adicionado à pesagem.</td>
      </tr>
    `;
  } else {
    itensPesagem.forEach((item, index) => {
      somaPeso += item.peso;
      somaBruta += item.total;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.id}</strong> - ${item.nome}</td>
        <td>${item.unidade}</td>
        <td>${item.peso.toFixed(3).replace('.', ',')}</td>
        <td>R$ ${item.precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td><strong>R$ ${item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
        <td>
          <button type="button" class="btn-remove" onclick="removerItem(${index})" title="Excluir">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tabelaItensCorpo.appendChild(tr);
    });
  }

  const totalDescontos = descontos.reduce((acc, d) => acc + d.valor, 0);
  const valorFinal = Math.max(0, somaBruta - totalDescontos);

  if (descontos.length > 0) {
    secaoDescontos.style.display = 'block';
    kpiDescontoWrapper.style.display = 'flex';
    kpiDesconto.textContent = `- R$ ${totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    listaDescontos.innerHTML = '';
    descontos.forEach((d, idx) => {
      const chip = document.createElement('div');
      chip.className = 'desconto-chip';
      chip.innerHTML = `
        <span>${d.motivo}: -R$ ${d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <button type="button" onclick="removerDesconto(${idx})" title="Remover desconto">&times;</button>
      `;
      listaDescontos.appendChild(chip);
    });
  } else {
    secaoDescontos.style.display = 'none';
    kpiDescontoWrapper.style.display = 'none';
  }

  kpiPeso.textContent = `${somaPeso.toFixed(3).replace('.', ',')} kg`;
  kpiValor.textContent = `R$ ${valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

window.removerItem = function(index) {
  itensPesagem.splice(index, 1);
  renderizarTabela();
};

// Modal de Desconto
descValor.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (!v) {
    e.target.value = '';
    return;
  }
  const valorNumerico = parseFloat(v) / 100;
  e.target.value = `R$ ${valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

btnAbrirModalDesconto.addEventListener('click', () => {
  descMotivo.value = '';
  descValor.value = '';
  modalDesconto.classList.remove('hidden');
  descMotivo.focus();
});

function fecharModalDesconto() {
  modalDesconto.classList.add('hidden');
}

btnFecharModal.addEventListener('click', fecharModalDesconto);
btnCancelarModal.addEventListener('click', fecharModalDesconto);

formModalDesconto.addEventListener('submit', (e) => {
  e.preventDefault();
  const motivo = descMotivo.value.trim().toUpperCase();
  const valorTexto = descValor.value.replace(/\D/g, '');
  const valorNum = parseFloat(valorTexto) / 100 || 0;

  if (valorNum <= 0) {
    alert('Informe um valor de desconto válido.');
    return;
  }

  descontos.push({ motivo, valor: valorNum });
  fecharModalDesconto();
  renderizarTabela();
});

window.removerDesconto = function(index) {
  descontos.splice(index, 1);
  renderizarTabela();
};

// ------------------------------------------------------------------
// GERAÇÃO DO DEMONSTRATIVO EM PDF (DESIGN SAAS VERDE ESMERALDA)
// ------------------------------------------------------------------

function gerarPDFDemonstrativo() {
  if (!fornecedorSelecionado || itensPesagem.length === 0) {
    alert('Selecione um fornecedor e adicione ao menos um material para gerar o PDF.');
    return;
  }

  const jsPdfLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPdfLib) {
    alert('Biblioteca jsPDF não encontrada. Verifique as tags de script no index.html.');
    return;
  }

  const doc = new jsPdfLib({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR');

  const totalPesoLiquido = itensPesagem.reduce((acc, item) => acc + item.peso, 0);
  const totalBruto = itensPesagem.reduce((acc, item) => acc + item.total, 0);
  const totalDescontos = descontos.reduce((acc, d) => acc + d.valor, 0);
  const valorFinal = Math.max(0, totalBruto - totalDescontos);

  // Paleta de Cores Padrão do Sistema
  const verdePrimario = [16, 185, 129];   // #10b981
  const verdeEscuro = [6, 95, 70];        // #065f46
  const fundoCard = [248, 250, 252];      // #f8fafc
  const bordaCinza = [226, 232, 240];     // #e2e8f0
  const textoPrincipal = [15, 23, 42];    // #0f172a
  const textoSuave = [100, 116, 139];     // #64748b

  // 1. Faixa Superior de Destaque
  doc.setFillColor(...verdePrimario);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // 2. Cabeçalho da Empresa
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...verdeEscuro);
  doc.text('BRASIL SUSTENTABILIDADE & GESTÃO DE RESÍDUOS', 14, 14);

  doc.setFontSize(8);
  doc.setTextColor(...textoSuave);
  doc.setFont('helvetica', 'normal');
  doc.text('CNPJ: 21.503.376/0016-75 | Fone: (11) 4732-4789', 14, 19);
  doc.text('Endereço: Rua Antonio Martins, 102 - Damas - Fortaleza/CE', 14, 23);

  // Badge do Boleto
  doc.setFillColor(...fundoCard);
  doc.setDrawColor(...bordaCinza);
  doc.roundedRect(pageWidth - 65, 9, 51, 15, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...verdeEscuro);
  doc.text(`DEMONSTRATIVO: #${fornecedorSelecionado.codigo}`, pageWidth - 61, 15);
  doc.setFontSize(6.5);
  doc.setTextColor(...textoSuave);
  doc.text('SIMPLES DEMONSTRATIVO INTERNO', pageWidth - 61, 20);

  // 3. Card de Dados do Fornecedor e da Coleta
  doc.setFillColor(...fundoCard);
  doc.setDrawColor(...bordaCinza);
  doc.roundedRect(14, 28, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textoPrincipal);
  doc.text(`Fornecedor: ${fornecedorSelecionado.codigo} - ${fornecedorSelecionado.nome}`, 18, 34);
  doc.text(`Data da Emissão: ${dataFormatada}`, pageWidth - 75, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textoSuave);
  doc.text(`CPF/CNPJ: ${fornecedorSelecionado.doc || '---'}`, 18, 39);
  doc.text(`Telefone: ${fornecedorSelecionado.celular || fornecedorSelecionado.fone || '---'}`, 90, 39);
  doc.text('Coleta: Fortaleza - Balança Líquida', pageWidth - 75, 39);

  doc.text(`Endereço: ${fornecedorSelecionado.endereco || 'Não informado'}`, 18, 44);
  doc.text('Saldo Devedor: R$ 0,00', pageWidth - 75, 44);

  // 4. Tabela de Materiais
  const colunas = [
    { header: 'PRODUTO', dataKey: 'produto' },
    { header: 'UN', dataKey: 'unidade' },
    { header: 'BRUTO', dataKey: 'bruto' },
    { header: 'DESC EMB', dataKey: 'descEmb' },
    { header: 'DESC KG', dataKey: 'descKg' },
    { header: 'LÍQUIDO', dataKey: 'liquido' },
    { header: 'PREÇO (R$)', dataKey: 'preco' },
    { header: 'TOTAL (R$)', dataKey: 'total' }
  ];

  const linhas = itensPesagem.map(item => ({
    produto: `${item.id} - ${item.nome}`,
    unidade: item.unidade || 'KG',
    bruto: item.peso.toLocaleString('pt-BR', { minimumFractionDigits: 3 }),
    descEmb: '0,000',
    descKg: '0,000',
    liquido: item.peso.toLocaleString('pt-BR', { minimumFractionDigits: 3 }),
    preco: item.precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
    total: item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }));

  doc.autoTable({
    columns: colunas,
    body: linhas,
    startY: 53,
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
      font: 'helvetica',
      textColor: textoPrincipal
    },
    headStyles: {
      fillColor: verdePrimario,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      produto: { cellWidth: 55 },
      unidade: { halign: 'center' },
      bruto: { halign: 'right' },
      descEmb: { halign: 'right' },
      descKg: { halign: 'right' },
      liquido: { halign: 'right', fontStyle: 'bold' },
      preco: { halign: 'right' },
      total: { halign: 'right', fontStyle: 'bold', textColor: verdeEscuro }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 4;

  // 5. Card de Resumo e Consolidação
  doc.setFillColor(...fundoCard);
  doc.setDrawColor(...bordaCinza);
  doc.roundedRect(14, finalY, pageWidth - 28, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textoPrincipal);
  doc.text(`Total de Itens: ${itensPesagem.length}`, 18, finalY + 6);
  doc.text(`Peso Líquido Total: ${totalPesoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} KG`, 70, finalY + 6);
  
  if (totalDescontos > 0) {
    doc.setTextColor(190, 18, 60);
    doc.text(`Descontos: - R$ ${totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 140, finalY + 6);
  } else {
    doc.setTextColor(...textoSuave);
    doc.text('Descontos: R$ 0,00', 140, finalY + 6);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textoSuave);
  doc.text('Frete: Empresa | Motorista: --- | Placa: ---', 18, finalY + 11);
  doc.text('Impresso por: Sistema | Balancista: Responsável', 115, finalY + 11);

  // 6. Card Destacado do Valor Total
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(pageWidth - 75, finalY + 17, 61, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...verdeEscuro);
  doc.text('VALOR TOTAL:', pageWidth - 70, finalY + 24.5);
  doc.setFontSize(10);
  doc.text(`R$ ${valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - 18, finalY + 24.5, { align: 'right' });

  doc.save(`Demonstrativo_${fornecedorSelecionado.codigo}_${Date.now()}.pdf`);
}

// ------------------------------------------------------------------
// AÇÕES FINAIS (PDF, WHATSAPP, EMAIL)
// ------------------------------------------------------------------

document.getElementById('btnPDF').addEventListener('click', gerarPDFDemonstrativo);

document.getElementById('btnWhatsapp').addEventListener('click', () => {
  if (!fornecedorSelecionado || itensPesagem.length === 0) {
    alert('Selecione um fornecedor e lance os itens da pesagem.');
    return;
  }
  const foneLimpo = (fornecedorSelecionado.celular || fornecedorSelecionado.fone || '').replace(/\D/g, '');
  const texto = `Olá ${fornecedorSelecionado.nome}, seu demonstrativo de pesagem (Cód. ${fornecedorSelecionado.codigo}) foi gerado no valor total de ${kpiValor.textContent}.`;
  window.open(`https://wa.me/55${foneLimpo}?text=${encodeURIComponent(texto)}`, '_blank');
});

document.getElementById('btnEmail').addEventListener('click', () => {
  if (!fornecedorSelecionado || itensPesagem.length === 0) {
    alert('Selecione um fornecedor e lance os itens da pesagem.');
    return;
  }
  alert(`Demonstrativo enviado para: ${fornecedorSelecionado.email}`);
});

window.addEventListener('focus', () => {
  renderizarOpcoesFornecedores();
  renderizarOpcoesMateriais();
});

renderizarOpcoesFornecedores();
renderizarOpcoesMateriais();