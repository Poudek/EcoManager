# ♻️ EcoManager - Sistema de Gestão e Emissão de Demonstrativos de Pesagem

Sistema web front-end desenvolvido para controle operacional e emissão de demonstrativos de pesagem em empresas de reciclagem e gestão de resíduos. A aplicação permite gerenciar fornecedores, materiais/sucatas, registrar pesagens com descontos operacionais (impureza, tara) e gerar comprovantes prontos para conferência ou impressão.

🔗 **Acesse a aplicação online:** [EcoManager na Vercel](https://eco-manager-wine.vercel.app)

---

## 🚀 Funcionalidades

- **Emissão de Demonstrativos:** Lançamento de pesagens com cálculo automático de peso bruto, tara, descontos por impureza (kg ou %) e valor total por item e geral.
- **Gestão de Fornecedores:** Cadastro, edição, exclusão e consulta com busca dinâmica.
- **Gestão de Materiais e Preços:** Cadastro e parametrização de valores por kg para diferentes tipos de sucatas/resíduos.
- **Ações Rápidas de Formulário:** Botão para limpar campos e reiniciar demonstrativos sem recarregar a tela.
- **Persistência Local:** Armazenamento contínuo de registros via `localStorage`.
- **Suíte de Testes Automatizados:** Testes unitários cobrindo as regras de cálculo e lógica de negócio.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** & **CSS3** (Layout responsivo com CSS Grid e Flexbox)
- **JavaScript (ES6+)** (Manipulação de DOM, regras de negócio e persistência local)
- **Jest** (Testes unitários automatizados)
- **Vercel** (Deploy contínuo integrado ao GitHub)
- **Font Awesome** & **Google Fonts (Inter)**

---

## 📁 Estrutura do Projeto

```text
EcoManager/
├── css/
│   ├── global.css          # Estilos compartilhados, variáveis e layout base
│   └── index.css           # Estilos específicos da tela principal/tabelas
├── js/
│   └── app.js              # Lógica de interface, eventos de DOM e localStorage
├── src/
│   └── calculos.js         # Módulo isolado de regras de negócio e cálculos
├── tests/
│   └── calculos.test.js    # Testes unitários com Jest
├── index.html              # Tela principal (Emissão de Demonstrativo)
├── fornecedores.html       # Cadastro e gestão de fornecedores
├── materiais.html          # Cadastro e tabela de preços de materiais
├── test-runner.html        # Interface alternativa para visualização de testes
├── favicon.png             # Ícone oficial da aplicação
├── package.json            # Configurações do projeto e scripts de teste
└── README.md               # Documentação do projeto
