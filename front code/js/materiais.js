const STORAGE_KEY_MATERIAIS = 'ecoreciclagem_materiais';

const materiaisIniciais = [
  { id: "PLACA MARROM - A", nome: "PLACA MARROM - A", unidade: "KG", precoKg: 30.00, precoVenda: null },
  { id: "PLACA INTERMEDIARIA - C", nome: "PLACA INTERMEDIARIA - C", unidade: "KG", precoKg: 47.00, precoVenda: null },
  { id: "PLACA PESADA - B", nome: "PLACA PESADA - B", unidade: "KG", precoKg: 27.00, precoVenda: null },
  { id: "PLACA MAE D - (FERRO)", nome: "PLACA MAE D - (FERRO)", unidade: "KG", precoKg: 27.00, precoVenda: null },
  { id: "PLACA INTERMEDIARIA - MODEM", nome: "PLACA INTERMEDIARIA - MODEM", unidade: "KG", precoKg: 26.00, precoVenda: null },
  { id: "IMPUREZA", nome: "IMPUREZA", unidade: "KG", precoKg: 0.00, precoVenda: null },
  { id: "HD", nome: "HD", unidade: "KG", precoKg: 17.00, precoVenda: null },
  { id: "PLACA LEVE - B", nome: "PLACA LEVE - B", unidade: "KG", precoKg: 120.00, precoVenda: null },
  { id: "PLACA LEVE - C", nome: "PLACA LEVE - C", unidade: "KG", precoKg: 120.00, precoVenda: null },
  { id: "PLACA DE TELEFONIA - B", nome: "PLACA DE TELEFONIA - B", unidade: "KG", precoKg: 185.00, precoVenda: null },
  { id: "PLACA MAE C", nome: "PLACA MAE C", unidade: "KG", precoKg: 50.00, precoVenda: null },
  { id: "EMBALAGEM", nome: "EMBALAGEM", unidade: "KG", precoKg: 0.00, precoVenda: null },
  { id: "PLACA INTERMEDIARIA - B", nome: "PLACA INTERMEDIARIA - B", unidade: "KG", precoKg: 55.00, precoVenda: null },
  { id: "PLACA DE CELULAR", nome: "PLACA DE CELULAR", unidade: "KG", precoKg: 250.00, precoVenda: null },
  { id: "PLACA DE NOTEBOOK B", nome: "PLACA DE NOTEBOOK B", unidade: "KG", precoKg: 165.00, precoVenda: null },
  { id: "PLACA DE NOTEBOOK C", nome: "PLACA DE NOTEBOOK C", unidade: "KG", precoKg: 75.00, precoVenda: null },
  { id: "PLACA INTERMEDIARIA - A", nome: "PLACA INTERMEDIARIA - A", unidade: "KG", precoKg: 63.00, precoVenda: null },
  { id: "PLACA DE DRIVE", nome: "PLACA DE DRIVE", unidade: "KG", precoKg: 120.00, precoVenda: null },
  { id: "PLACA DE TABLET", nome: "PLACA DE TABLET", unidade: "KG", precoKg: 85.00, precoVenda: null },
  { id: "PROCESSADOR DE FIBRA COBRE - A", nome: "PROCESSADOR DE FIBRA COBRE - A", unidade: "KG", precoKg: 170.00, precoVenda: null },
  { id: "MEMORIA - A", nome: "MEMORIA - A", unidade: "KG", precoKg: 450.00, precoVenda: null }
];

function obterMateriais() {
  const dados = localStorage.getItem(STORAGE_KEY_MATERIAIS);
  if (!dados) {
    localStorage.setItem(STORAGE_KEY_MATERIAIS, JSON.stringify(materiaisIniciais));
    return materiaisIniciais;
  }
  return JSON.parse(dados);
}

function salvarMateriais(lista) {
  localStorage.setItem(STORAGE_KEY_MATERIAIS, JSON.stringify(lista));
}

// Elementos da DOM
const form = document.getElementById('formMaterial');
const materialIdInterno = document.getElementById('materialIdInterno');
const nomeInput = document.getElementById('nomeMaterial');
const unidadeInput = document.getElementById('unidadeMaterial');
const precoInput = document.getElementById('precoMaterial');
const precoVendaInput = document.getElementById('precoVendaMaterial');
const tabelaBody = document.querySelector('#tabelaMateriais tbody');
const buscaInput = document.getElementById('buscaMaterial');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const formTitulo = document.getElementById('formTitulo');
const btnSalvarTexto = document.getElementById('btnSalvarTexto');

if (nomeInput) {
  nomeInput.addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());
}

function parseMoedaFormatada(valorTexto) {
  if (!valorTexto) return null;
  const apenasDigitos = valorTexto.toString().replace(/\D/g, '');
  return apenasDigitos ? parseFloat(apenasDigitos) / 100 : null;
}

function aplicarMascaraMoeda(input) {
  if (!input) return;
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (!v) {
      e.target.value = '';
      return;
    }
    const valorNumerico = parseFloat(v) / 100;
    e.target.value = `R$ ${valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  });
}

aplicarMascaraMoeda(precoInput);
aplicarMascaraMoeda(precoVendaInput);

function renderizarTabela(filtro = '') {
  const materiais = obterMateriais();
  tabelaBody.innerHTML = '';

  const termo = filtro.toLowerCase().trim();
  const filtrados = materiais.filter(m => 
    m.nome.toLowerCase().includes(termo)
  );

  if (filtrados.length === 0) {
    tabelaBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">Nenhum material encontrado.</td>
      </tr>
    `;
    return;
  }

  filtrados.forEach(m => {
    const precoVendaFormatado = m.precoVenda !== null && m.precoVenda !== undefined
      ? `<span class="price-tag">R$ ${Number(m.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> <small class="text-muted">/${m.unidade || 'KG'}</small>`
      : '<span class="text-muted">---</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${m.nome}</strong></td>
      <td><span class="price-tag">R$ ${Number(m.precoKg).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> <small class="text-muted">/${m.unidade || 'KG'}</small></td>
      <td>${precoVendaFormatado}</td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-icon edit" onclick="editarMaterial('${m.id}')" title="Editar">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="btn-icon btn-remove" onclick="excluirMaterial('${m.id}')" title="Excluir">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabelaBody.appendChild(tr);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const lista = obterMateriais();
  const idOriginal = materialIdInterno.value;
  const novoNome = nomeInput.value.trim().toUpperCase();
  const precoCompra = parseMoedaFormatada(precoInput.value);
  const precoVenda = parseMoedaFormatada(precoVendaInput ? precoVendaInput.value : '');

  if (precoCompra === null || precoCompra < 0) {
    alert('Informe um preço de compra válido.');
    return;
  }

  if (idOriginal) {
    // Modo Edição
    const index = lista.findIndex(m => m.id === idOriginal);
    if (index !== -1) {
      lista[index] = {
        id: novoNome,
        nome: novoNome,
        unidade: unidadeInput.value,
        precoKg: precoCompra,
        precoVenda: precoVenda
      };
    }
  } else {
    // Modo Criação
    if (lista.some(m => m.nome === novoNome)) {
      alert('Já existe um material cadastrado com esta descrição!');
      return;
    }

    lista.push({
      id: novoNome,
      nome: novoNome,
      unidade: unidadeInput.value,
      precoKg: precoCompra,
      precoVenda: precoVenda
    });
  }

  salvarMateriais(lista);
  resetarFormulario();
  renderizarTabela(buscaInput ? buscaInput.value : '');
});

window.editarMaterial = function(id) {
  const lista = obterMateriais();
  const mat = lista.find(m => m.id === id);
  if (!mat) return;

  materialIdInterno.value = mat.id;
  nomeInput.value = mat.nome;
  unidadeInput.value = mat.unidade || 'KG';
  precoInput.value = `R$ ${Number(mat.precoKg).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  if (precoVendaInput) {
    precoVendaInput.value = mat.precoVenda !== null && mat.precoVenda !== undefined
      ? `R$ ${Number(mat.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '';
  }

  if (formTitulo) formTitulo.textContent = `Editar Material (${mat.nome})`;
  if (btnSalvarTexto) btnSalvarTexto.textContent = 'Salvar Alterações';
  if (btnCancelarEdicao) btnCancelarEdicao.classList.remove('hidden');
  nomeInput.focus();
};

window.excluirMaterial = function(id) {
  if (!confirm(`Deseja remover o material "${id}" da base?`)) return;

  let lista = obterMateriais();
  lista = lista.filter(m => m.id !== id);
  salvarMateriais(lista);
  renderizarTabela(buscaInput ? buscaInput.value : '');
};

function resetarFormulario() {
  form.reset();
  materialIdInterno.value = '';
  if (formTitulo) formTitulo.textContent = 'Cadastrar Novo Material';
  if (btnSalvarTexto) btnSalvarTexto.textContent = 'Salvar Material';
  if (btnCancelarEdicao) btnCancelarEdicao.classList.add('hidden');
}

if (btnCancelarEdicao) btnCancelarEdicao.addEventListener('click', resetarFormulario);
if (buscaInput) buscaInput.addEventListener('input', (e) => renderizarTabela(e.target.value));

renderizarTabela();