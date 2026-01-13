/*
  calculator.js

  Define um objeto global `Calculator` com utilitários para cálculo de emissões
  e créditos de carbono. Depende de `CONFIG` (fatores e créditos).

  Todos os retornos numéricos são arredondados conforme especificado nos
  comentários de cada função.
*/

const Calculator = {
  /*
    calculateEmission(distanceKm, transportMode)
    - Busca o fator de emissão em kg CO2 por km a partir de
      CONFIG.EMISSION_FACTORS[transportMode].
    - Calcula: emission = distanceKm * factor
    - Retorna valor arredondado para 2 casas decimais (número).
  */
  calculateEmission: function(distanceKm, transportMode) {
    const factors = (typeof CONFIG !== 'undefined' && CONFIG.EMISSION_FACTORS) ? CONFIG.EMISSION_FACTORS : {};
    const factor = (factors && factors[transportMode] !== undefined) ? Number(factors[transportMode]) : 0;
    const dist = Number(distanceKm) || 0;
    const emission = dist * factor;
    return Number(emission.toFixed(2));
  },

  /*
    calculateAllModes(distanceKm)
    - Para cada modo presente em CONFIG.EMISSION_FACTORS calcula a emissão.
    - Usa a emissão do carro como baseline para calcular a relação percentual
      (emissão / carEmission) * 100. Se carEmission for 0, define percentageVscar como null.
    - Retorna array de objetos: { mode, emission, percentageVscar }
    - Ordena o array por emissão (do menor para o maior).
  */
  calculateAllModes: function(distanceKm) {
    const factors = (typeof CONFIG !== 'undefined' && CONFIG.EMISSION_FACTORS) ? CONFIG.EMISSION_FACTORS : {};
    const results = [];
    const carEmission = this.calculateEmission(distanceKm, 'car');

    Object.keys(factors).forEach(mode => {
      const emission = this.calculateEmission(distanceKm, mode);
      let percentageVscar = null;
      if (carEmission !== 0) {
        percentageVscar = Number(((emission / carEmission) * 100).toFixed(2));
      }
      results.push({ mode: mode, emission: emission, percentageVscar: percentageVscar });
    });

    // Ordena por emissão (menor primeiro)
    results.sort((a, b) => a.emission - b.emission);
    return results;
  },

  /*
    calculateSaving(emission, baselineEmission)
    - Calcula kg salvos: baselineEmission - emission
    - Calcula porcentagem economizada: (saved / baseline) * 100
    - Retorna { saveKg, percentage } arredondados a 2 casas.
    - Se baselineEmission for 0, percentage será null.
  */
  calculateSaving: function(emission, baselineEmission) {
    const e = Number(emission) || 0;
    const b = Number(baselineEmission) || 0;
    const saved = b - e;
    const saveKg = Number(saved.toFixed(2));
    let percentage = null;
    if (b !== 0) {
      percentage = Number(((saved / b) * 100).toFixed(2));
    }
    return { saveKg: saveKg, percentage: percentage };
  },

  /*
    calculateCarbonCredits(emissionKg)
    - Divide emissionKg por CONFIG.CARBON_CREDIT.KG_PER_CREDIT
    - Retorna número de créditos arredondado a 4 casas decimais
  */
  calculateCarbonCredits: function(emissionKg) {
    const kg = Number(emissionKg) || 0;
    const perCredit = (typeof CONFIG !== 'undefined' && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.KG_PER_CREDIT) ? Number(CONFIG.CARBON_CREDIT.KG_PER_CREDIT) : 1000;
    const credits = kg / perCredit;
    return Number(credits.toFixed(4));
  },

  /*
    estimateCreditPrice(credits)
    - Calcula valor mínimo: credits * PRICE_MIN_BRL
    - Calcula valor máximo: credits * PRICE_MAX_BRL
    - Calcula média: (min + max) / 2
    - Retorna { min, max, average } arredondados a 2 casas
  */
  estimateCreditPrice: function(credits) {
    const c = Number(credits) || 0;
    const cfg = (typeof CONFIG !== 'undefined' && CONFIG.CARBON_CREDIT) ? CONFIG.CARBON_CREDIT : { PRICE_MIN_BRL: 50, PRICE_MAX_BRL: 150 };
    const min = c * Number(cfg.PRICE_MIN_BRL);
    const max = c * Number(cfg.PRICE_MAX_BRL);
    const average = (min + max) / 2;
    return {
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      average: Number(average.toFixed(2))
    };
  }
};

/* Exemplo de uso:
   Calculator.calculateEmission(100, 'car');
   Calculator.calculateAllModes(100);
   Calculator.calculateSaving(2, 12);
   Calculator.calculateCarbonCredits(12);
   Calculator.estimateCreditPrice(0.012);
*/
