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
  { id: "PET", nome: "PET", unidade: "KG", precoKg: 1.70, precoVenda: null },
  { id: "PLASTICO", nome: "PLÁSTICO", unidade: "KG", precoKg: 1.00, precoVenda: null },
  { id: "FILME LIMPO", nome: "FILME LIMPO", unidade: "KG", precoKg: 2.00, precoVenda: null },
  { id: "CADEIRA", nome: "CADEIRA", unidade: "KG", precoKg: 2.00, precoVenda: null },
  { id: "PVC", nome: "PVC", unidade: "KG", precoKg: 1.00, precoVenda: null },
  { id: "LATA", nome: "LATA", unidade: "KG", precoKg: 10.00, precoVenda: null },
  { id: "PERFIL", nome: "PERFIL", unidade: "KG", precoKg: 12.00, precoVenda: null },
  { id: "PANELA", nome: "PANELA", unidade: "KG", precoKg: 11.00, precoVenda: null },
  { id: "COBRE", nome: "COBRE", unidade: "KG", precoKg: 60.00, precoVenda: null },
  { id: "METAL", nome: "METAL", unidade: "KG", precoKg: 30.00, precoVenda: null },
  { id: "CONDENSADOR", nome: "CONDENSADOR", unidade: "KG", precoKg: 23.00, precoVenda: null },
  { id: "FERRO", nome: "FERRO", unidade: "KG", precoKg: 0.60, precoVenda: null },
  { id: "ANTIMONIO", nome: "ANTIMONIO", unidade: "KG", precoKg: 7.00, precoVenda: null },
  { id: "ALUMINIO MISTO", nome: "ALUMINIO MISTO", unidade: "KG", precoKg: 7.00, precoVenda: null },
  { id: "ALUMINIO DURO LIMPO", nome: "ALUMINIO DURO LIMPO", unidade: "KG", precoKg: 7.00, precoVenda: null },
  { id: "ALUMINIO DURO SUJO", nome: "ALUMINIO DURO SUJO", unidade: "KG", precoKg: 3.00, precoVenda: null },
];

let itensPesagem = [];
let descontos = [];
let fornecedorSelecionado = null;

// Variáveis de Controle
let modoVendaGrandeAtivo = false;
let precoOriginalMaterial = '';
let ultimoItemAdicionadoIndex = null; // Controle da animação na tabela

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
const btnVendaGrande = document.getElementById('btnVendaGrande');

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

function renderizarOpcoesMateriais(termo = '') {
  const materiais = obterMateriais();
  optionsMaterial.innerHTML = '';

  const termoNormalizado = termo.toLowerCase().trim();
  const filtrados = materiais.filter(m => 
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
    // Exibe apenas Descrição e Valor
    opt.textContent = `${m.nome} (R$ ${Number(m.precoKg).toFixed(2)}/${m.unidade || 'KG'})`;

    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectMaterial.value = m.id;
      const spanTrigger = wrapperMaterial.querySelector('.custom-select-trigger span');
      spanTrigger.textContent = m.nome;
      spanTrigger.classList.remove('placeholder');
      wrapperMaterial.classList.remove('open');

      const precoNumerico = Number(m.precoKg) || 0;
      precoOriginalMaterial = `R$ ${precoNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      precoKgInput.value = precoOriginalMaterial;

      desativarModoVendaGrande(false);
      calcularSubtotalPrevia();
    });

    optionsMaterial.appendChild(opt);
  });
}
// Controle da Operação Atual ('compra' ou 'venda')
let operacaoAtual = 'compra'; 

const btnToggleOperacao = document.getElementById('btnToggleOperacao');

// Alternância de Operação
if (btnToggleOperacao) {
  btnToggleOperacao.addEventListener('click', () => {
    operacaoAtual = operacaoAtual === 'compra' ? 'venda' : 'compra';

    if (operacaoAtual === 'compra') {
      btnToggleOperacao.className = 'btn-operacao-toggle compra';
      btnToggleOperacao.innerHTML = '<span class="badge-tag"><i class="fa-solid fa-cart-shopping"></i> COMPRA</span>';
    } else {
      btnToggleOperacao.className = 'btn-operacao-toggle venda';
      btnToggleOperacao.innerHTML = '<span class="badge-tag"><i class="fa-solid fa-arrow-up-right-dots"></i> VENDA</span>';
    }

    // Se já houver um material selecionado, atualiza o preço na hora
    if (selectMaterial && selectMaterial.value) {
      const materiais = obterMateriais();
      const mat = materiais.find(m => m.id === selectMaterial.value);
      if (mat) {
        const precoNumerico = operacaoAtual === 'compra' 
          ? (Number(mat.precoKg) || 0)
          : (Number(mat.precoVenda) || 0);

        precoOriginalMaterial = `R$ ${precoNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        precoKgInput.value = precoOriginalMaterial;
        desativarModoVendaGrande(false);
        calcularSubtotalPrevia();
      }
    }

    // Atualiza a lista visual do dropdown com os valores da nova operação
    renderizarOpcoesMateriais(inputBuscaMaterial ? inputBuscaMaterial.value : '');
  });
}

// Atualização da renderização do dropdown de materiais
function renderizarOpcoesMateriais(termo = '') {
  const materiais = obterMateriais();
  optionsMaterial.innerHTML = '';

  const termoNormalizado = termo.toLowerCase().trim();
  const filtrados = materiais.filter(m => 
    m.nome.toLowerCase().includes(termoNormalizado)
  );

  if (filtrados.length === 0) {
    optionsMaterial.innerHTML = `<div class="custom-option-empty">Nenhum material encontrado.</div>`;
    return;
  }

  filtrados.forEach(m => {
    // Escolhe o valor base de acordo com a operação ativa
    const precoBase = operacaoAtual === 'compra'
      ? (Number(m.precoKg) || 0)
      : (Number(m.precoVenda) || 0);

    const opt = document.createElement('div');
    opt.className = 'custom-option';
    opt.dataset.value = m.id;
    opt.textContent = `${m.nome} (R$ ${precoBase.toFixed(2)}/${m.unidade || 'KG'})`;

    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectMaterial.value = m.id;
      const spanTrigger = wrapperMaterial.querySelector('.custom-select-trigger span');
      spanTrigger.textContent = m.nome;
      spanTrigger.classList.remove('placeholder');
      wrapperMaterial.classList.remove('open');

      const precoNumerico = operacaoAtual === 'compra'
        ? (Number(m.precoKg) || 0)
        : (Number(m.precoVenda) || 0);

      precoOriginalMaterial = `R$ ${precoNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      precoKgInput.value = precoOriginalMaterial;

      desativarModoVendaGrande(false);
      calcularSubtotalPrevia();
    });

    optionsMaterial.appendChild(opt);
  });
}

function parseMoedaParaNumero(valorTexto) {
  if (!valorTexto) return 0;
  const apenasDigitos = valorTexto.toString().replace(/\D/g, '');
  return apenasDigitos ? parseFloat(apenasDigitos) / 100 : 0;
}

function parsePesoFormatado(valorTexto) {
  if (!valorTexto) return 0;
  const apenasDigitos = valorTexto.toString().replace(/\D/g, '');
  return apenasDigitos ? parseFloat(apenasDigitos) / 1000 : 0;
}

function calcularSubtotalPrevia() {
  const preco = parseMoedaParaNumero(precoKgInput ? precoKgInput.value : '');
  const peso = parsePesoFormatado(pesoBrutoInput ? pesoBrutoInput.value : '');
  const subtotal = preco * peso;
  const textoFormatado = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (subtotalPrevisto) {
    if ('value' in subtotalPrevisto) {
      subtotalPrevisto.value = textoFormatado;
    }
    subtotalPrevisto.textContent = textoFormatado;
  }
}

pesoBrutoInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (!v) {
    e.target.value = '';
  } else {
    const valorNumerico = parseFloat(v) / 1000;
    e.target.value = valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  }
  calcularSubtotalPrevia();
});

precoKgInput.addEventListener('input', (e) => {
  if (modoVendaGrandeAtivo) {
    let v = e.target.value.replace(/\D/g, '');
    if (!v || v === '0') {
      e.target.value = 'R$ 0,00';
    } else {
      const valorNumerico = parseFloat(v) / 100;
      e.target.value = `R$ ${valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  }
  calcularSubtotalPrevia();
});

function ativarModoVendaGrande() {
  modoVendaGrandeAtivo = true;
  precoKgInput.removeAttribute('readonly');
  precoKgInput.classList.add('input-preco-editavel');
  
  if (btnVendaGrande) {
    btnVendaGrande.classList.add('ativo');
    btnVendaGrande.innerHTML = '<i class="fa-solid fa-unlock"></i> Venda Grande (Ativo)';
  }
  
  precoKgInput.focus();
  precoKgInput.select();
}

function desativarModoVendaGrande(restaurarPrecoOriginal = true) {
  modoVendaGrandeAtivo = false;
  precoKgInput.setAttribute('readonly', 'true');
  precoKgInput.classList.remove('input-preco-editavel');
  
  if (btnVendaGrande) {
    btnVendaGrande.classList.remove('ativo');
    btnVendaGrande.innerHTML = '<i class="fa-solid fa-lock"></i> Venda Grande';
  }
  
  if (restaurarPrecoOriginal && precoOriginalMaterial) {
    precoKgInput.value = precoOriginalMaterial;
    calcularSubtotalPrevia();
  }
}

if (btnVendaGrande) {
  btnVendaGrande.addEventListener('click', () => {
    if (!selectMaterial.value) {
      alert('Selecione um material primeiro para liberar a edição do preço.');
      return;
    }

    if (modoVendaGrandeAtivo) {
      desativarModoVendaGrande(true);
    } else {
      ativarModoVendaGrande();
    }
  });
}

formAdicionarItem.addEventListener('submit', (e) => {
  e.preventDefault();
  const matId = selectMaterial.value;
  const materiais = obterMateriais();
  const mat = materiais.find(item => item.id === matId);
  const peso = parsePesoFormatado(pesoBrutoInput.value);
  const preco = parseMoedaParaNumero(precoKgInput.value) || (mat ? mat.precoKg : 0);

  if (!mat || peso <= 0 || preco <= 0) {
    alert('Selecione um material e insira um peso válido.');
    return;
  }

  // Define o índice da nova linha para receber a animação CSS
  ultimoItemAdicionadoIndex = itensPesagem.length;

  itensPesagem.push({
    id: mat.id,
    nome: mat.nome,
    unidade: mat.unidade || 'KG',
    peso: peso,
    precoUnitario: preco,
    total: peso * preco
  });

  renderizarTabela();

  // Limpa o índice de animação após 800ms
  setTimeout(() => {
    ultimoItemAdicionadoIndex = null;
  }, 800);

  selectMaterial.value = '';
  const matSpan = wrapperMaterial.querySelector('.custom-select-trigger span');
  matSpan.textContent = 'Selecione o material...';
  matSpan.classList.add('placeholder');
  precoKgInput.value = '';
  pesoBrutoInput.value = '';
  
  if (subtotalPrevisto) {
    if ('value' in subtotalPrevisto) subtotalPrevisto.value = 'R$ 0,00';
    subtotalPrevisto.textContent = 'R$ 0,00';
  }

  desativarModoVendaGrande(false);
  precoOriginalMaterial = '';
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
      
      // Adiciona classe de animação à linha recém-criada
      if (index === ultimoItemAdicionadoIndex) {
        tr.classList.add('linha-animada');
      }

      tr.innerHTML = `
        <td><strong>${item.nome}</strong></td>
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

const btnLimparTudo = document.getElementById('btnLimparTudo');

if (btnLimparTudo) {
  btnLimparTudo.addEventListener('click', () => {
    if (itensPesagem.length === 0 && descontos.length === 0 && !fornecedorSelecionado) {
      alert('O demonstrativo já está vazio.');
      return;
    }

    const confirmou = confirm('Tem certeza que deseja limpar todos os itens, descontos e dados do demonstrativo atual?');
    
    if (confirmou) {
      itensPesagem = [];
      descontos = [];
      fornecedorSelecionado = null;

      selectFornecedor.value = '';
      const spanFornecedor = wrapperFornecedor.querySelector('.custom-select-trigger span');
      spanFornecedor.textContent = 'Selecione pelo Código / Nome...';
      spanFornecedor.classList.add('placeholder');
      fornecedorDoc.value = '';
      fornecedorFone.value = '';
      fornecedorEndereco.value = '';

      selectMaterial.value = '';
      const spanMaterial = wrapperMaterial.querySelector('.custom-select-trigger span');
      spanMaterial.textContent = 'Selecione o material...';
      spanMaterial.classList.add('placeholder');
      precoKgInput.value = '';
      pesoBrutoInput.value = '';
      
      if (subtotalPrevisto) {
        if ('value' in subtotalPrevisto) subtotalPrevisto.value = 'R$ 0,00';
        subtotalPrevisto.textContent = 'R$ 0,00';
      }

      desativarModoVendaGrande(false);
      precoOriginalMaterial = '';

      renderizarTabela();
    }
  });
}

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

  const verdePrimario = [16, 185, 129];
  const verdeEscuro = [6, 95, 70];
  const fundoCard = [248, 250, 252];
  const bordaCinza = [226, 232, 240];
  const textoPrincipal = [15, 23, 42];
  const textoSuave = [100, 116, 139];

  doc.setFillColor(...verdePrimario);
  doc.rect(0, 0, pageWidth, 5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...verdeEscuro);
  doc.text('BRASIL SUSTENTABILIDADE & GESTÃO DE RESÍDUOS', 14, 14);

  doc.setFontSize(8);
  doc.setTextColor(...textoSuave);
  doc.setFont('helvetica', 'normal');
  doc.text('CNPJ: 21.503.376/0016-75 | Fone: (11) 4732-4789', 14, 19);
  doc.text('Endereço: Rua Antonio Martins, 102 - Damas - Fortaleza/CE', 14, 23);

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
    produto: item.nome,
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

const STORAGE_KEY_LANCAMENTOS = 'ecoreciclagem_historico_lancamentos';

const btnEnviar = document.getElementById('btnEnviar');

// Função para salvar o lançamento no histórico de relatórios
function salvarLancamentoHistorico() {
  if (!fornecedorSelecionado) {
    alert('Selecione um fornecedor antes de enviar o lançamento.');
    return null;
  }

  if (itensPesagem.length === 0) {
    alert('Adicione ao menos um material à pesagem antes de enviar.');
    return null;
  }

  const dadosExistentes = localStorage.getItem(STORAGE_KEY_LANCAMENTOS);
  const lancamentos = dadosExistentes ? JSON.parse(dadosExistentes) : [];

  const totalPeso = itensPesagem.reduce((acc, item) => acc + item.peso, 0);
  const totalBruto = itensPesagem.reduce((acc, item) => acc + item.total, 0);
  const totalDesc = descontos.reduce((acc, d) => acc + d.valor, 0);
  const valorLiquido = Math.max(0, totalBruto - totalDesc);

  const novoLancamento = {
    id: `LAN-${Date.now().toString().slice(-6)}`,
    dataHora: new Date().toISOString(),
    operacao: typeof operacaoAtual !== 'undefined' ? operacaoAtual : 'compra',
    fornecedor: {
      codigo: fornecedorSelecionado.codigo,
      nome: fornecedorSelecionado.nome,
      doc: fornecedorSelecionado.doc || '---',
      fone: fornecedorSelecionado.celular || fornecedorSelecionado.fone || '---'
    },
    itens: JSON.parse(JSON.stringify(itensPesagem)),
    descontos: JSON.parse(JSON.stringify(descontos)),
    totalPeso: totalPeso,
    totalBruto: totalBruto,
    totalDescontos: totalDesc,
    valorFinal: valorLiquido
  };

  lancamentos.unshift(novoLancamento);
  localStorage.setItem(STORAGE_KEY_LANCAMENTOS, JSON.stringify(lancamentos));

  return novoLancamento;
}

// Função auxiliar para resetar todo o demonstrativo após o envio com sucesso
function limparAposEnvio() {
  itensPesagem = [];
  descontos = [];
  fornecedorSelecionado = null;

  selectFornecedor.value = '';
  const spanFornecedor = wrapperFornecedor.querySelector('.custom-select-trigger span');
  if (spanFornecedor) {
    spanFornecedor.textContent = 'Selecione pelo Código / Nome...';
    spanFornecedor.classList.add('placeholder');
  }
  fornecedorDoc.value = '';
  fornecedorFone.value = '';
  fornecedorEndereco.value = '';

  selectMaterial.value = '';
  const spanMaterial = wrapperMaterial.querySelector('.custom-select-trigger span');
  if (spanMaterial) {
    spanMaterial.textContent = 'Selecione o material...';
    spanMaterial.classList.add('placeholder');
  }
  precoKgInput.value = '';
  pesoBrutoInput.value = '';
  
  if (subtotalPrevisto) {
    if ('value' in subtotalPrevisto) subtotalPrevisto.value = 'R$ 0,00';
    subtotalPrevisto.textContent = 'R$ 0,00';
  }

  desativarModoVendaGrande(false);
  precoOriginalMaterial = '';

  renderizarTabela();
}

// Evento de clique do botão Enviar Lançamento
if (btnEnviar) {
  btnEnviar.addEventListener('click', () => {
    const lancamentoSalvo = salvarLancamentoHistorico();

    if (lancamentoSalvo) {
      alert(`✅ Lançamento [${lancamentoSalvo.id}] enviado com sucesso para o Relatório do Dia!`);
      limparAposEnvio();
    }
  });
}

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