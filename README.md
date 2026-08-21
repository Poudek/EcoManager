# ♻️ EcoManager - Sistema de Gestão e Pesagem de Reciclagem

<p align="center">
  <img src="assets/logo.png" alt="Logo DV Reciclagem" width="180" />
</p>

<p align="center">
  <strong>Plataforma web ágil e intuitiva para controle operacional de pesagem, precificação dinâmica, livro-caixa diário e emissão de demonstrativos analíticos.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Produção-10B981?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Deploy Vercel">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JS">
  <img src="https://img.shields.io/badge/CSS3-Modern%20UI-1572B6?style=for-the-badge&logo=css3" alt="CSS">
</p>

---

## 📌 Visão Geral

O **EcoManager** foi desenvolvido para resolver gargalos operacionais em depósitos de reciclagem e gestão de sucata. O sistema substitui anotações manuais por um fluxo digital que calcula pesos líquidos, subtotais e deduções em tempo real, permitindo a emissão instantânea de demonstrativos em PDF e sincronização com relatórios periódicos de compras e vendas.

---

## ✨ Funcionalidades Principais

### 1. ⚖️ Demonstrativo de Pesagem em Tempo Real (`index.html`)
- **Alternância de Operação (Compra / Venda):** Alterne o fluxo operacional em um clique, com ajuste automático de tabelas de preços.
- **Modo Venda Grande (Desbloqueio de Preço):** Permite renegociação de preços unitários sob demanda sem alterar o valor base do cadastro.
- **Deduções e Descontos:** Modal para lançar descontos avulsos (impureza, embalagens, adiantamentos) com recálculo automático do valor líquido.
- **Disparo Multiplataforma:**
  - 📄 **PDF Institucional:** Geração com logo do cliente, dados cadastrais e layout contábil padronizado.
  - 📲 **WhatsApp:** Montagem de mensagem pronta com link de envio direto para o número do fornecedor/cliente.
  - 💾 **Lançamento Direto:** Envio do comprovante para o livro-caixa da aba de Relatórios.

### 2. 📊 Relatórios & Inteligência Operacional (`relatorios.html`)
- **Filtros por Período:** Visualização dinâmica **Diária (Hoje)**, **Semanal (7 Dias)** e **Mensal (Mês Atual)**.
- **KPIs do Painel:** Total em R$ Comprado, Total em R$ Vendido, Peso Total Comprado, Peso Total Vendido, Peso Movimentado e Quantidade de Operações.
- **Consolidação por Material:** Agrupamento automático de todos os quilos transacionados e gasto/faturamento total por tipo de produto.
- **Livro-Caixa em Acordeom:** Histórico detalhado por ID do comprovante, com visualização sanfona de cada produto pesado.
- **Edição & Exclusão Pontual:** Edição de peso/preço de itens passados e exclusão individual ou completa de lançamentos com recálculo de saldo.
- **Exportação Consolidada em PDF:** Emissão de relatórios analíticos de período contendo resumo e tabelas segregadas de compras e vendas.

### 3. 👥 Gestão de Fornecedores & Clientes (`fornecedores.html`)
- Cadastro com busca rápida e máscaras automáticas (CPF/CNPJ, Telefone/WhatsApp e CEP).
- Listagem com consulta instantânea e preenchimento automático nos lançamentos.

### 4. 📦 Catálogo de Materiais (`materiais.html`)
- Cadastro de materiais com separação entre Preço de Compra (KG) e Preço de Venda (KG).
- Formulário lateral fixo (*sticky*) para cadastro ágil sem perder a visualização da tabela.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estruturação limpa, acessível e responsiva.
- **CSS3 Moderno:** Design System baseado no padrão Tailwind (Slate/Emerald/Blue), Flexbox, CSS Grid e tipografia Inter.
- **JavaScript (Vanilla ES6+):** Manipulação de DOM, cálculos de alta precisão, máscaras e filtros sem dependência de frameworks pesados.
- **jsPDF & jsPDF-AutoTable:** Renderização e diagramação dinâmica de documentos em PDF de alta qualidade vetorial.
- **Font Awesome 6:** Biblioteca de ícones vetoriais.
- **LocalStorage API:** Persistência de dados local segura e sem necessidade de infraestrutura de banco de dados para testes.

---

## 📂 Estrutura de Arquivos

```bash
├── assets/
│   └── logo.png              # Identidade visual da empresa
├── css/
│   ├── global.css            # Variáveis, reset, navbar e componentes globais
│   ├── demonstrativo.css     # Estilização da tela de pesagem
│   ├── fornecedores.css      # Estilização da tela de fornecedores
│   ├── materiais.css         # Estilização da tela de materiais
│   └── relatorios.css        # Estilização dos dashboards e acordeons
├── js/
│   ├── app.js                # Lógica de pesagem, demonstrativo e PDF
│   ├── fornecedores.js       # CRUD e máscaras de fornecedores
│   ├── materiais.js          # CRUD e precificação de materiais
│   └── relatorios.js         # Lógica dos filtros, consolidação e edição de lançamentos
├── favicon.png               # Ícone da aba do navegador
├── index.html                # Tela de Pesagem / Demonstrativo
├── fornecedores.html         # Tela de Fornecedores
├── materiais.html            # Tela de Materiais
├── relatorios.html           # Tela de Relatórios e Lançamentos
└── README.md
