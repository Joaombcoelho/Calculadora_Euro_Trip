/*
  app.js

  Inicialização da aplicação e manipulação do formulário.
  - Popula datalist de cidades
  - Configura autofill de distância
  - Trata submissão do formulário, calcula emissões e renderiza resultados
*/

window.addEventListener('DOMContentLoaded', () => {
  // Inicialização: popular datalist (compatível com nomes diferentes)
  if (typeof CONFIG !== 'undefined') {
    const populate = CONFIG.populateDatalist || CONFIG.popularDatalist;
    if (typeof populate === 'function') populate();

    if (typeof CONFIG.setupDistanceAutofill === 'function') CONFIG.setupDistanceAutofill();
  }

  // Obter formulário e registrar listener
  const form = document.getElementById('calculator-form');
  if (!form) {
    console.warn('Formulário `#calculator-form` não encontrado.');
    return;
  }

  console.log('Calculadora inicializada!');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevenir envio padrão

    // Ler valores do formulário
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const transportRadio = document.querySelector('input[name="transport"]:checked');

    const origin = originInput ? originInput.value.trim() : '';
    const destination = destinationInput ? destinationInput.value.trim() : '';
    const distance = distanceInput ? parseFloat(distanceInput.value) : 0;
    const transportMode = transportRadio ? transportRadio.value : 'car';

    // Validação básica
    if (!origin) { alert('Por favor, informe a origem.'); return; }
    if (!destination) { alert('Por favor, informe o destino.'); return; }
    if (!distance || isNaN(distance) || distance <= 0) { alert('Distância inválida. Insira uma distância válida (maior que 0).'); return; }

    // Botão de submit
    const submitButton = form.querySelector('button[type="submit"]');

    // Mostrar loading
    if (typeof UI !== 'undefined' && submitButton) UI.showLoading(submitButton);

    // Esconder seções de resultado anteriores
    if (typeof UI !== 'undefined') {
      UI.hideElement('results');
      UI.hideElement('comparison');
    }

    // Simular processamento assíncrono
    setTimeout(() => {
      try {
        // Cálculos principais
        const emissionForMode = (typeof Calculator !== 'undefined') ? Calculator.calculateEmission(distance, transportMode) : 0;
        const emissionCar = (typeof Calculator !== 'undefined') ? Calculator.calculateEmission(distance, 'car') : 0;
        const savings = (typeof Calculator !== 'undefined') ? Calculator.calculateSaving(emissionForMode, emissionCar) : { saveKg: 0, percentage: null };
        const comparisonArray = (typeof Calculator !== 'undefined') ? Calculator.calculateAllModes(distance) : [];
        const credits = (typeof Calculator !== 'undefined') ? Calculator.calculateCarbonCredits(emissionForMode) : 0;
        const priceEstimate = (typeof Calculator !== 'undefined') ? Calculator.estimateCreditPrice(credits) : { min:0, max:0, average:0 };

        // Renderizar resultados usando UI
        if (typeof UI !== 'undefined') {
          const resultsHtml = UI.renderResults({ origin, destination, distance, emission: emissionForMode, mode: transportMode, savings });
          const comparisonHtml = UI.renderComparison(comparisonArray, transportMode);
          const creditsHtml = UI.renderCarbonCredits({ credits, price: priceEstimate });

          const resultsContainer = document.getElementById('results-content');
          const comparisonContainer = document.getElementById('carbon-credits-content');

          if (resultsContainer) resultsContainer.innerHTML = resultsHtml;
          if (comparisonContainer) comparisonContainer.innerHTML = comparisonHtml + creditsHtml;

          // Exibir seções de resultado e rolar
          UI.showElement('results');
          UI.showElement('comparison');
          UI.scrollToElement('results');
        }

        // Restaurar botão
        if (typeof UI !== 'undefined' && submitButton) UI.hideLoading(submitButton);

      } catch (err) {
        console.error('Erro ao processar cálculo:', err);
        alert('Ocorreu um erro ao calcular. Tente novamente.');
        if (typeof UI !== 'undefined' && submitButton) UI.hideLoading(submitButton);
      }
    }, 1500);
  });
});
