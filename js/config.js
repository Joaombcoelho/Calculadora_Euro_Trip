/*
  config.js

  Define um objeto global `CONFIG` com fatores de emissão, metadados
  de modos de transporte, informações de crédito de carbono e utilitários
  para popular o datalist e configurar o autofill de distância.

  Tudo é exposto por uma única variável global: `CONFIG`.
*/

const CONFIG = {
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.0089,
        truck: 0.96
    },

    TRANSPORT_MODES: {
        bicycle: { label: 'Bicicleta', icon: '🚲', color: '#10b681' },
        car: { label: 'Carro', icon: '🚗', color: '#059669' },
        bus: { label: 'Ônibus', icon: '🚌', color: '#34d399' },
        truck: { label: 'Caminhão', icon: '🚛', color: '#0ea5a4' }
    },

    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    /*
      popularDatalist()
      Preenche o <datalist id="cities-list"> com as cidades retornadas por
      `RoutesDB.getAllCities()`.
    */
    popularDatalist: function () {
        if (typeof RoutesDB === 'undefined' || !RoutesDB.getAllCities) return;
        const cities = RoutesDB.getAllCities();
        const datalist = document.getElementById('cities-list');
        if (!datalist) return;
        // Limpa entradas existentes
        datalist.innerHTML = '';
        cities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            datalist.appendChild(opt);
        });
    },

    /*
      setupDistanceAutofill()
      Configura os listeners para preencher automaticamente o campo de
      distância quando origem e destino existirem no `RoutesDB`.
  
      Regras:
      - Se ambas as entradas (origin/destination) estiverem preenchidas e o
        checkbox manual estiver desmarcado, tenta procurar distância com
        `RoutesDB.findDistance()`.
      - Se encontrada: preenche `#distance`, marca como readonly e mostra
        mensagem de sucesso no helper abaixo do input.
      - Se não encontrada: limpa `#distance`, mantém readonly e sugere
        inserir manualmente (ou marcar o checkbox).
      - Se o usuário marcar o checkbox `#manual-distance`, o campo fica
        editável para preenchimento manual. Ao desmarcar, tenta preencher
        automaticamente novamente.
    */
    setupDistanceAutofill: function () {
        const originEl = document.getElementById('origin');
        const destinationEl = document.getElementById('destination');
        const distanceEl = document.getElementById('distance');
        const manualEl = document.getElementById('manual-distance');
        const helperEl = document.querySelector('.calculator__help');

        const getColor = (cssVar, fallback) => {
            const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
            return (val && val.trim()) || fallback;
        };

        const primaryColor = getColor('--primary', '#10b681');
        const dangerColor = getColor('--danger', '#ef4444');
        const neutralColor = getColor('--text-light', '#6b7280');

        const setHelper = (text, color) => {
            if (!helperEl) return;
            helperEl.textContent = text;
            helperEl.style.color = color;
        };

        const tryAutofill = () => {
            if (!originEl || !destinationEl || !distanceEl) return;
            if (manualEl && manualEl.checked) {
                // manual mode: allow editing
                distanceEl.readOnly = false;
                setHelper('Insira a distância manualmente', neutralColor);
                return;
            }

            const originVal = originEl.value.trim();
            const destVal = destinationEl.value.trim();
            if (!originVal || !destVal) {
                distanceEl.value = '';
                distanceEl.readOnly = true;
                setHelper('A distancia será preenchida automaticamente', neutralColor);
                return;
            }

            if (typeof RoutesDB === 'undefined' || !RoutesDB.findDistance) {
                setHelper('Base de rotas indisponível', dangerColor);
                return;
            }

            const km = RoutesDB.findDistance(originVal, destVal);
            if (km !== null && km !== undefined) {
                distanceEl.value = km;
                distanceEl.readOnly = true;
                setHelper('A distância foi preenchida automaticamente', primaryColor);
            } else {
                distanceEl.value = '';
                distanceEl.readOnly = true;
                setHelper('Distância não encontrada — marque "inserir distância manualmente" para inserir manualmente.', dangerColor);
            }
        };

        // Eventos: use input e change para pegar typing e seleção por autocomplete
        if (originEl) {
            originEl.addEventListener('input', tryAutofill);
            originEl.addEventListener('change', tryAutofill);
        }
        if (destinationEl) {
            destinationEl.addEventListener('input', tryAutofill);
            destinationEl.addEventListener('change', tryAutofill);
        }

        if (manualEl) {
            manualEl.addEventListener('change', () => {
                if (manualEl.checked) {
                    distanceEl.readOnly = false;
                    setHelper('Insira a distância manualmente', neutralColor);
                } else {
                    distanceEl.readOnly = true;
                    tryAutofill();
                }
            });
        }

        // Tentativa inicial após carregamento
        setTimeout(tryAutofill, 0);
    }
};

/* Exemplo de inicialização (opcional):
   window.addEventListener('DOMContentLoaded', () => {
     CONFIG.popularDatalist();
     CONFIG.setupDistanceAutofill();
   });
*/
