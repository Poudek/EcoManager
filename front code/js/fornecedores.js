const STORAGE_KEY = 'ecoreciclagem_fornecedores';

const fornecedoresIniciais = [
  {
    codigo: "126307",
    nome: "DIEGO DA SILVA NOBRE",
    doc: "013.605.343-26",
    celular: "(85) 99866-0975",
    email: "diego.nobre@exemplo.com",
    endereco: "AVENIDA IMPERADOR Nº.110 - CENTRO/FORTALEZA/CE"
  },
  {
    codigo: "100201",
    nome: "RECICLAGEM CENTRAL LTDA",
    doc: "12.345.678/0001-90",
    celular: "(85) 98888-0000",
    email: "contato@reciclagemcentral.com",
    endereco: "RUA ANTONIO MARTINS Nº.102 - DAMAS/FORTALEZA/CE"
  }
];

function obterFornecedores() {
  const dados = localStorage.getItem(STORAGE_KEY);
  if (!dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fornecedoresIniciais));
    return fornecedoresIniciais;
  }
  return JSON.parse(dados);
}

function salvarFornecedores(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function gerarCodigoUnico(lista) {
  let codigo;
  do {
    codigo = Math.floor(100000 + Math.random() * 900000).toString();
  } while (lista.some(f => f.codigo === codigo));
  return codigo;
}

// Elementos da DOM
const form = document.getElementById('formFornecedor');
const fornecedorId = document.getElementById('fornecedorId');
const nomeInput = document.getElementById('nomeFornecedor');
const docInput = document.getElementById('docFornecedor');
const celularInput = document.getElementById('celularFornecedor');
const emailInput = document.getElementById('emailFornecedor');
const enderecoInput = document.getElementById('enderecoFornecedor');
const tabelaBody = document.querySelector('#tabelaFornecedores tbody');
const buscaInput = document.getElementById('buscaFornecedor');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const formTitulo = document.getElementById('formTitulo');
const btnSalvarTexto = document.getElementById('btnSalvarTexto');

// Maiúsculas automáticas
nomeInput.addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());
enderecoInput.addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());

// Máscara CPF / CNPJ
docInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    v = v.substring(0, 14);
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  }
  e.target.value = v;
});

// Máscara Celular
celularInput.addEventListener('keydown', (e) => {
  // Se apertar Backspace logo após um hífen, parêntese ou espaço, apaga o número anterior
  if (e.key === 'Backspace') {
    const input = e.target;
    const pos = input.selectionStart;
    const val = input.value;
    if (pos > 0 && /[\s\-\)\(]/.test(val[pos - 1])) {
      e.preventDefault();
      const novoVal = val.slice(0, pos - 2) + val.slice(pos);
      input.value = novoVal;
      input.dispatchEvent(new Event('input'));
    }
  }
});

celularInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  v = v.substring(0, 11);

  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    // Só adiciona o traço se já houver pelo menos 1 número após ele
    v = v.replace(/^(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{1,4})$/, '($1) $2');
  } else if (v.length > 0) {
    v = `(${v}`;
  }

  e.target.value = v;
});

function renderizarTabela(filtro = '') {
  const fornecedores = obterFornecedores();
  tabelaBody.innerHTML = '';

  const filtrados = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(filtro.toLowerCase()) || 
    f.codigo.includes(filtro) ||
    f.doc.includes(filtro)
  );

  if (filtrados.length === 0) {
    tabelaBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">Nenhum fornecedor encontrado.</td>
      </tr>
    `;
    return;
  }

  filtrados.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-badge">${f.codigo}</span></td>
      <td>
        <strong>${f.nome}</strong><br>
        <small class="text-muted">${f.doc}</small>
      </td>
      <td>
        <small>${f.celular}</small><br>
        <small class="text-muted">${f.email}</small>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editarFornecedor('${f.codigo}')" title="Editar">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-icon btn-remove" onclick="excluirFornecedor('${f.codigo}')" title="Excluir">
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
  const lista = obterFornecedores();
  const codigoAtual = fornecedorId.value;

  if (codigoAtual) {
    const index = lista.findIndex(f => f.codigo === codigoAtual);
    if (index !== -1) {
      lista[index] = {
        ...lista[index],
        nome: nomeInput.value.trim().toUpperCase(),
        doc: docInput.value.trim(),
        celular: celularInput.value.trim(),
        email: emailInput.value.trim(),
        endereco: enderecoInput.value.trim()
      };
    }
  } else {
    const novoFornecedor = {
      codigo: gerarCodigoUnico(lista),
      nome: nomeInput.value.trim().toUpperCase(),
      doc: docInput.value.trim(),
      celular: celularInput.value.trim(),
      email: emailInput.value.trim(),
      endereco: enderecoInput.value.trim() || 'ENDEREÇO NÃO CADASTRADO'
    };
    lista.push(novoFornecedor);
  }

  salvarFornecedores(lista);
  resetarFormulario();
  renderizarTabela(buscaInput.value);
});

window.editarFornecedor = function(codigo) {
  const lista = obterFornecedores();
  const f = lista.find(item => item.codigo === codigo);
  if (!f) return;

  fornecedorId.value = f.codigo;
  nomeInput.value = f.nome;
  docInput.value = f.doc;
  celularInput.value = f.celular;
  emailInput.value = f.email;
  enderecoInput.value = f.endereco || '';

  formTitulo.textContent = `Editar Fornecedor #${f.codigo}`;
  btnSalvarTexto.textContent = 'Salvar Alterações';
  btnCancelarEdicao.classList.remove('hidden');
};

window.excluirFornecedor = function(codigo) {
  if (!confirm(`Deseja remover o fornecedor código #${codigo}?`)) return;

  let lista = obterFornecedores();
  lista = lista.filter(f => f.codigo !== codigo);
  salvarFornecedores(lista);
  renderizarTabela(buscaInput.value);
};

function resetarFormulario() {
  form.reset();
  fornecedorId.value = '';
  formTitulo.textContent = 'Cadastrar Novo Fornecedor';
  btnSalvarTexto.textContent = 'Salvar Fornecedor';
  btnCancelarEdicao.classList.add('hidden');
}

btnCancelarEdicao.addEventListener('click', resetarFormulario);
buscaInput.addEventListener('input', (e) => renderizarTabela(e.target.value));

renderizarTabela();