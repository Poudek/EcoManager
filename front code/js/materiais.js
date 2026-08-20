const STORAGE_KEY_MATERIAIS = 'ecoreciclagem_materiais';

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
const codigoInput = document.getElementById('codigoMaterial');
const nomeInput = document.getElementById('nomeMaterial');
const unidadeInput = document.getElementById('unidadeMaterial');
const precoInput = document.getElementById('precoMaterial');
const tabelaBody = document.querySelector('#tabelaMateriais tbody');
const buscaInput = document.getElementById('buscaMaterial');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const formTitulo = document.getElementById('formTitulo');
const btnSalvarTexto = document.getElementById('btnSalvarTexto');

codigoInput.addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());
nomeInput.addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());

function parseMoedaFormatada(valorTexto) {
  if (!valorTexto) return 0;
  const apenasDigitos = valorTexto.replace(/\D/g, '');
  return parseFloat(apenasDigitos) / 100 || 0;
}

precoInput.addEventListener('input', (e) => {
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

function renderizarTabela(filtro = '') {
  const materiais = obterMateriais();
  tabelaBody.innerHTML = '';

  const termo = filtro.toLowerCase().trim();
  const filtrados = materiais.filter(m => 
    m.id.toLowerCase().includes(termo) || 
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
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-badge-mat">${m.id}</span></td>
      <td><strong>${m.nome}</strong></td>
      <td><span class="price-tag">R$ ${m.precoKg.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> <small class="text-muted">/${m.unidade || 'KG'}</small></td>
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
  const novoCodigo = codigoInput.value.trim().toUpperCase();
  const precoCalculado = parseMoedaFormatada(precoInput.value);

  if (idOriginal) {
    const index = lista.findIndex(m => m.id === idOriginal);
    if (index !== -1) {
      lista[index] = {
        id: novoCodigo,
        nome: nomeInput.value.trim().toUpperCase(),
        unidade: unidadeInput.value,
        precoKg: precoCalculado
      };
    }
  } else {
    if (lista.some(m => m.id === novoCodigo)) {
      alert('Já existe um material cadastrado com este código!');
      return;
    }

    lista.push({
      id: novoCodigo,
      nome: nomeInput.value.trim().toUpperCase(),
      unidade: unidadeInput.value,
      precoKg: precoCalculado
    });
  }

  salvarMateriais(lista);
  resetarFormulario();
  renderizarTabela(buscaInput.value);
});

window.editarMaterial = function(id) {
  const lista = obterMateriais();
  const mat = lista.find(m => m.id === id);
  if (!mat) return;

  materialIdInterno.value = mat.id;
  codigoInput.value = mat.id;
  nomeInput.value = mat.nome;
  unidadeInput.value = mat.unidade || 'KG';
  precoInput.value = `R$ ${mat.precoKg.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  formTitulo.textContent = `Editar Material (${mat.id})`;
  btnSalvarTexto.textContent = 'Salvar Alterações';
  btnCancelarEdicao.classList.remove('hidden');
};

window.excluirMaterial = function(id) {
  if (!confirm(`Deseja remover o material [${id}] da base?`)) return;

  let lista = obterMateriais();
  lista = lista.filter(m => m.id !== id);
  salvarMateriais(lista);
  renderizarTabela(buscaInput.value);
};

function resetarFormulario() {
  form.reset();
  materialIdInterno.value = '';
  formTitulo.textContent = 'Cadastrar Novo Material';
  btnSalvarTexto.textContent = 'Salvar Material';
  btnCancelarEdicao.classList.add('hidden');
}

btnCancelarEdicao.addEventListener('click', resetarFormulario);
buscaInput.addEventListener('input', (e) => renderizarTabela(e.target.value));

renderizarTabela();