**Calculadora de Emissão de CO² — Euro Trip (projeto demo)**

- **Descrição:** Calculadora web para estimativa de emissões de CO₂ em viagens rodoviárias no Brasil. Permite comparar modos de transporte, estimar créditos de carbono e mostrar economia relativa ao uso do carro.

Principais Características

- **Cálculo de emissões:** Usa fatores de emissão por modo (kg CO₂/km) para estimar emissões por viagem.
- **Preenchimento automático de distância:** Preenche o campo de distância a partir de uma base de rotas (`RoutesDB`).
- **Comparação de modos:** Gera comparação entre modos (bicicleta, carro, ônibus, caminhão) ordenada por emissão.
- **Estimativa de créditos de carbono:** Converte emissões em créditos e estima faixa de preço.
- **Interface responsiva:** Markup semântico HTML5 + CSS customizável.

**Arquivos principais**

- **HTML:** [index.html](index.html) — estrutura semântica e formulário.
- **CSS:** [css/style.css](css/style.css) — variáveis CSS, estilos do layout, grid e componentes.
- **Dados de rotas:** [js/routes-data.js](js/routes-data.js) — define o global `RoutesDB` com lista de rotas e utilitários (`getAllCities`, `findDistance`).
- **Configuração:** [js/config.js](js/config.js) — define `CONFIG` (fatores de emissão, metadados de transporte, créditos de carbono) e utilitários para popular o datalist e configurar autofill.
- **Lógica de cálculo:** [js/calculator.js](js/calculator.js) — define `Calculator` com funções de cálculo de emissões, comparação, créditos e preços.
- **Interface / Render:** [js/ui.js](js/ui.js) — define `UI` com helpers de formatação e renderers que retornam HTML para os resultados, comparação e créditos.
- **Inicialização e eventos:** [js/app.js](js/app.js) — inicializa a app, popula o datalist, configura autofill e trata submissão do formulário.

**Como executar (local)**

- **Pré-requisito:** um navegador moderno.
- **Opção (rápida):** abrir `index.html` diretamente no navegador.

**Uso**

- Preencha `Origem` e `Destino` (autocomplete com cidades disponíveis).
- Se houver uma rota correspondente na base `RoutesDB`, o campo `Distância (km)` será preenchido automaticamente.
- Marque `inserir distância manualmente` para digitar sua própria distância.
- Selecione o modo de transporte e clique em **Calcular Emissão**.
- A aplicação exibirá:
  - Resultado principal com rota, distância, emissão e modo;
  - Comparação entre modos (barra proporcional e porcentagem vs carro);
  - Estimativa de créditos de carbono e faixa de preço.

**APIs internas e contrato de dados (resumo)**

- `RoutesDB` (global)
  - `routes`: array de objetos { origin, destination, DistanceKm }
  - `getAllCities()`: retorna array único e ordenado de nomes das cidades
  - `findDistance(origin, destination)`: retorna distância em km (número) ou `null`
- `CONFIG` (global)
  - `EMISSION_FACTORS`: fatores por modo (kg CO₂/km)
  - `TRANSPORT_MODES`: metadados (label, icon, color)
  - `CARBON_CREDIT`: regras de crédito
  - `popularDatalist()` e `setupDistanceAutofill()` para inicialização UI
- `Calculator` (global)
  - `calculateEmission(distanceKm, transportMode)` → kg CO₂ (2 decimais)
  - `calculateAllModes(distanceKm)` → array ordenado com emissões e % vs carro
  - `calculateSaving(emission, baseline)` → { saveKg, percentage }
  - `calculateCarbonCredits(emissionKg)` → créditos (4 decimais)
  - `estimateCreditPrice(credits)` → { min, max, average }
- `UI` (global)
  - `formatNumber`, `formatCurrency`, `showElement`, `hideElement`, `scrollToElement`
  - `renderResults(data)`, `renderComparison(models, selected)`, `renderCarbonCredits(data)` — retornam HTML string
  - `showLoading(button)`, `hideLoading(button)` para UX

**Estrutura de CSS e personalização**

- As variáveis principais estão em `css/style.css` no `:root` (cores, espaçamentos, radius, sombras). Personalize as cores e espaçamentos alterando essas variáveis.

**Testes e validação**

- A aplicação é estática e voltada para demonstração; teste manual navegando e verificando os comportamentos:
  - Autocomplete do `datalist` (ver `RoutesDB.getAllCities()`)
  - Autofill de distância e botão `inserir distância manualmente`
  - Resultados calculados com `Calculator` e exibidos por `UI`

**Contribuições**

- Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias: mais rotas, fatores de emissão mais precisos, suporte a mais modos ou integração com APIs externas de rotas.

**Créditos**

- Desenvolvido para a DIO | Projeto GitHub Copilot do João Manoel

**Licença**

- Sem licença específica fornecida. Adicione um arquivo LICENSE se quiser publicar este projeto.

---
Gerado e organizado para facilitar entendimento e extensibilidade local.

# Calculadora_Euro_Trip
