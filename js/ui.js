/*
  ui.js

  Define um objeto global `UI` com utilitários para formatação, helpers de
  exibição e renderers que retornam HTML (strings) para injeção no DOM.

  Estrutura geral das funções:
  - Utilitários: formatação de números/moeda, show/hide, scroll
  - Renderers: renderResults, renderComparison, renderCarbonCredits
  - Helpers de UI: showLoading / hideLoading

  Observação: os renderers retornam strings HTML; a inserção no DOM e a
  manipulação de eventos ficam a cargo de quem chama essas funções.
*/

const UI = {
    /* UTILITÁRIOS */
    // Formata número com separador de milhares e número fixo de casas
    formatNumber: function (number, decimals = 2) {
        const n = Number(number) || 0;
        return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },

    // Formata valor em BRL (R$) com locale pt-BR
    formatCurrency: function (value) {
        const v = Number(value) || 0;
        return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    // Remove a classe 'hidden' de um elemento (aceita id ou elemento)
    showElement: function (elementOrId) {
        const el = (typeof elementOrId === 'string') ? document.getElementById(elementOrId) : elementOrId;
        if (!el) return;
        el.classList.remove('hidden');
        el.setAttribute('aria-hidden', 'false');
    },

    // Adiciona a classe 'hidden' a um elemento (aceita id ou elemento)
    hideElement: function (elementOrId) {
        const el = (typeof elementOrId === 'string') ? document.getElementById(elementOrId) : elementOrId;
        if (!el) return;
        el.classList.add('hidden');
        el.setAttribute('aria-hidden', 'true');
    },

    // Rola suavemente até um elemento na página
    scrollToElement: function (elementOrId) {
        const el = (typeof elementOrId === 'string') ? document.getElementById(elementOrId) : elementOrId;
        if (!el || !el.scrollIntoView) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /* RENDERERS
       Cada renderer retorna uma string HTML que pode ser inserida no DOM.
       Comentários dentro de cada função descrevem a estrutura gerada.
    */

    /* renderResults(data)
       data: { origin, destination, distance, emission, mode, savings }
  
       Retorna HTML contendo vários cartões informativos (div.results_card):
       - Route card: origem -> destino
       - Distance card: distância em km
       - Emission card: valor em kg CO2 com ícone
       - Transport card: ícone + label do modo
       - Savings card (opcional): se modo != 'car' e savings presente
    */
    renderResults: function (data = {}) {
        const { origin = '', destination = '', distance = '', emission = 0, mode = 'car', savings = null } = data;
        const modeMeta = (typeof CONFIG !== 'undefined' && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[mode]) ? CONFIG.TRANSPORT_MODES[mode] : { icon: '', label: mode, color: '#ccc' };

        // Card: rota
        const routeCard = `<div class="results_card results_card--route">
      <h3 class="results_card__title">Rota</h3>
      <div class="results_card__body">
        <p class="results_card__route">${origin} → ${destination}</p>
      </div>
    </div>`;

        // Card: distância
        const distanceCard = `<div class="results_card results_card--distance">
      <h3 class="results_card__title">Distância</h3>
      <div class="results_card__body">
        <p class="results_card__value">${this.formatNumber(distance, 0)} km</p>
        <p class="results_card__help">A distancia usada no cálculo</p>
      </div>
    </div>`;

        // Card: emissão
        const emissionCard = `<div class="results_card results_card--emission">
      <h3 class="results_card__title">Emissões</h3>
      <div class="results_card__body">
        <p class="results_card__value">🌿 ${this.formatNumber(emission, 2)} kg CO₂</p>
        <p class="results_card__help">Emissão estimada para a viagem</p>
      </div>
    </div>`;

        // Card: transporte
        const transportCard = `<div class="results_card results_card--transport" style="border-color:${modeMeta.color}">
      <h3 class="results_card__title">Transporte</h3>
      <div class="results_card__body">
        <p class="results_card__mode">${modeMeta.icon} ${modeMeta.label}</p>
      </div>
    </div>`;

        // Card: savings (opcional)
        let savingsCard = '';
        if (mode !== 'car' && savings && (savings.saveKg || savings.percentage)) {
            savingsCard = `<div class="results_card results_card--savings">
        <h3 class="results_card__title">Economia vs Carro</h3>
        <div class="results_card__body">
          <p class="results_card__value">${this.formatNumber(savings.saveKg, 2)} kg</p>
          <p class="results_card__help">Economia estimada (${this.formatNumber(savings.percentage, 2)}%)</p>
        </div>
      </div>`;
        }

        // Combina todos os cartões em um container
        const html = `<div class="results_container">
      ${routeCard}
      ${distanceCard}
      ${emissionCard}
      ${transportCard}
      ${savingsCard}
    </div>`;

        return html;
    },

    /* renderComparison(modelsArray, selectedMode)
       modelsArray: [{ mode, emission, percentageVscar }, ...]
       selectedMode: string
  
       Gera uma lista de itens comparativos com barra de progresso e badge
       de seleção. Cada item tem a classe `comparison_Item` e, se selecionado,
       `comparison_item--selected`.
  */
    renderComparison: function (modelsArray = [], selectedMode = 'car') {
        if (!Array.isArray(modelsArray)) return '';

        // Determina emissão máxima para referência 100%
        const maxEmission = modelsArray.reduce((m, it) => Math.max(m, Number(it.emission || 0)), 0) || 1;

        const itemsHtml = modelsArray.map(item => {
            const mode = item.mode;
            const emission = Number(item.emission || 0);
            const pctVsCar = (item.percentageVscar === null || item.percentageVscar === undefined) ? '—' : `${this.formatNumber(item.percentageVscar, 2)}%`;
            const meta = (typeof CONFIG !== 'undefined' && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[mode]) ? CONFIG.TRANSPORT_MODES[mode] : { icon: '', label: mode, color: '#ccc' };

            // width percentage relative to maxEmission
            const widthPct = Math.min(100, (emission / maxEmission) * 100);

            // Color-coding rules
            let barColor = '#10b681'; // green
            if (widthPct <= 25) barColor = '#10b681';
            else if (widthPct <= 75) barColor = '#f59e0b'; // yellow
            else if (widthPct <= 100) barColor = '#fb923c'; // orange
            else barColor = '#ef4444'; // red (beyond 100%)

            const selectedClass = (mode === selectedMode) ? 'comparison_item--selected' : '';

            return `
        <div class="comparison_Item ${selectedClass}" data-mode="${mode}">
          <div class="comparison_Item__header">
            <span class="comparison_Item__icon">${meta.icon}</span>
            <strong class="comparison_Item__label">${meta.label}</strong>
            ${mode === selectedMode ? '<span class="comparison_Item__badge">Selecionado</span>' : ''}
          </div>
          <div class="comparison_Item__stats">
            <div class="comparison_Item__emission">${this.formatNumber(emission, 2)} kg CO₂</div>
            <div class="comparison_Item__pct">${pctVsCar}</div>
          </div>
          <div class="comparison_Item__bar" style="background:#e6e6e6;border-radius:8px;overflow:hidden;height:12px;">
            <div style="width:${widthPct}%;height:100%;background:${barColor}"></div>
          </div>
        </div>`;
        }).join('');

        const tipBox = `<div class="comparison_tip">
      <p><strong>Dica:</strong> Compare as emissões por modo. Modos com barra menor geram menos CO₂.</p>
    </div>`;

        return `<div class="comparison_list">${itemsHtml}</div>${tipBox}`;
    },

    /* renderCarbonCredits(creditsData)
       creditsData: { credits, price: { min, max, average } }
  
       Retorna HTML com grid de dois cartões e info adicional:
       - Card 1: créditos necessários (grande número) + helper
       - Card 2: preço estimado (média) e faixa min-max
       - Info box explicativa e botão para "Compensar Emissões"
    */
    renderCarbonCredits: function (creditsData = {}) {
        const credits = Number(creditsData.credits) || 0;
        const price = creditsData.price || { min: 0, max: 0, average: 0 };

        const creditsCard = `<div class="credits_card credits_card--quantity">
      <h3 class="credits_card__title">Créditos necessários</h3>
      <div class="credits_card__body">
        <p class="credits_card__value">${this.formatNumber(credits, 4)}</p>
        <p class="credits_card__help">1 crédito = ${this.formatNumber((typeof CONFIG !== 'undefined' && CONFIG.CARBON_CREDIT) ? CONFIG.CARBON_CREDIT.KG_PER_CREDIT : 1000, 0)} kg CO₂</p>
      </div>
    </div>`;

        const priceCard = `<div class="credits_card credits_card--price">
      <h3 class="credits_card__title">Estimativa de Preço</h3>
      <div class="credits_card__body">
        <p class="credits_card__value">${this.formatCurrency(price.average || 0)}</p>
        <p class="credits_card__help">Faixa: ${this.formatCurrency(price.min || 0)} — ${this.formatCurrency(price.max || 0)}</p>
      </div>
    </div>`;

        const infoBox = `<div class="credits_info">
      <p>Créditos de carbono permitem compensar emissões investindo em projetos que removem ou evitam CO₂.</p>
    </div>`;

        const actionButton = `<div class="credits_action">
      <button class="calculator__button">Compensar Emissões</button>
    </div>`;

        return `<div class="credits_grid">${creditsCard}${priceCard}</div>${infoBox}${actionButton}`;
    },

    /* showLoading(buttonElement)
       - Salva texto original em data-original-text
       - Desabilita o botão
       - Altera innerHTML para mostrar spinner e texto
    */
    showLoading: function (buttonElement) {
        const btn = (typeof buttonElement === 'string') ? document.querySelector(buttonElement) : buttonElement;
        if (!btn) return;
        if (!btn.dataset.originalText) btn.dataset.originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> Calculando...`;
    },

    /* hideLoading(buttonElement)
       - Restaura texto original salvo em data-original-text
       - Habilita o botão
    */
    hideLoading: function (buttonElement) {
        const btn = (typeof buttonElement === 'string') ? document.querySelector(buttonElement) : buttonElement;
        if (!btn) return;
        const original = btn.dataset.originalText || 'Calcular Emissão';
        btn.disabled = false;
        btn.innerHTML = original;
    }
};

/* Exemplo de uso:
   const html = UI.renderResults({ origin: 'São Paulo, SP', destination: 'Rio de Janeiro, RJ', distance: 430, emission: 51.6, mode: 'car', savings: { saveKg:0, percentage:0 } });
   document.getElementById('results-content').innerHTML = html;
*/
