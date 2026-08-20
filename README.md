# ♻️ EcoManager — Emissor e Gestor de Demonstrativos de Pesagem

O **EcoManager** é uma aplicação web voltada para empresas de reciclagem e gestão de resíduos. O sistema permite cadastrar fornecedores, gerenciar tabelas de preços de materiais/sucatas e emitir demonstrativos de pesagem com cálculo dinâmico de subtotais, abatimento de deduções/descontos e exportação em PDF padronizado.

---

## 🚀 Funcionalidades

- **Emissão de Demonstrativo:**
  - Busca inteligente e autocompletar de fornecedores cadastrados.
  - Seleção de materiais com preenchimento automático do valor por quilo ($R\$/kg$).
  - Máscara de pesagem em tempo real (três casas decimais).
  - Gestão de descontos/deduções (impureza, embalagens, adiantamentos) com recálculo automático do valor final.
  - Botão de reset rápido para limpar o demonstrativo completo.
- **Gestão de Fornecedores:**
  - Cadastro, edição, exclusão e busca dinâmica com persistência em `localStorage`.
- **Gestão de Materiais e Preços:**
  - Cadastro de tipos de sucata, código de identificação, unidade de medida e preço unitário com máscara monetária.
- **Exportação & Integrações:**
  - Geração de demonstrativo estruturado em **PDF** via `jsPDF` e `AutoTable`.
  - Disparo de resumo via WhatsApp e encaminhamento por e-mail.
- **Testes Unitários:**
  - Suíte de testes com **Jest** para regras de negócio (cálculos e conversões).
  - Runner HTML visual para execução de testes diretamente no navegador via Mocha/Chai.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3 moderno (Design Responsivo, Flexbox e CSS Grid), JavaScript (ES6+).
- **Bibliotecas:** 
  - [jsPDF](https://github.com/parallax/jsPDF) + [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) (Geração de PDFs).
  - [Font Awesome](https://fontawesome.com/) (Ícones de interface).
- **Testes:**
  - [Jest](https://jestjs.io/) (Ambiente Node.js).
  - [Mocha](https://mochajs.org/) & [Chai](https://www.chaijs.com/) (Ambiente de navegador).

---

## 📂 Estrutura do Projeto

```text
├── css/
│   ├── global.css          # Estilos globais e transições
│   ├── index.css           # Estilos do demonstrativo e modais
│   ├── fornecedores.css    # Estilos da tela de fornecedores
│   └── materiais.css       # Estilos da tela de materiais
├── js/
│   ├── app.js              # Lógica do demonstrativo e geração de PDF
│   ├── fornecedores.js     # CRUD e busca de fornecedores
│   └── materiais.js        # CRUD e tabela de preços de materiais
├── src/
│   └── calculos.js         # Funções puras de cálculo e parsing
├── tests/
│   └── calculos.test.js    # Testes unitários com Jest
├── index.html              # Tela principal do demonstrativo
├── fornecedores.html       # Tela de gestão de fornecedores
├── materiais.html          # Tela de gestão de materiais
├── test-runner.html        # Execução visual de testes no navegador
├── package.json            # Scripts e dependências de desenvolvimento
└── README.md               # Documentação do projeto
