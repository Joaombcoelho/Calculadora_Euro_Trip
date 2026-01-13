/*
  routes-data.js

  Define um objeto global `RoutesDB` que contém um array de rotas
  e métodos utilitários para consulta.

  Estrutura de cada rota:
    {
      origin: "Cidade, UF",
      destination: "Cidade, UF",
      DistanceKm: 123 // número (quilômetros)
    }

  O arquivo expõe apenas a variável global `RoutesDB`.
*/

const RoutesDB = {
    // Lista de rotas entre cidades brasileiras. Distâncias aproximadas em km.
    routes: [
        { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", DistanceKm: 430 },
        { origin: "São Paulo, SP", destination: "Brasília, DF", DistanceKm: 1015 },
        { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", DistanceKm: 1148 },
        { origin: "São Paulo, SP", destination: "Campinas, SP", DistanceKm: 95 },
        { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", DistanceKm: 13 },
        { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", DistanceKm: 100 },
        { origin: "Salvador, BA", destination: "Feira de Santana, BA", DistanceKm: 108 },
        { origin: "Fortaleza, CE", destination: "Sobral, CE", DistanceKm: 220 },
        { origin: "Recife, PE", destination: "Olinda, PE", DistanceKm: 8 },
        { origin: "Recife, PE", destination: "João Pessoa, PB", DistanceKm: 120 },
        { origin: "Natal, RN", destination: "Parnamirim, RN", DistanceKm: 15 },
        { origin: "Curitiba, PR", destination: "Florianópolis, SC", DistanceKm: 300 },
        { origin: "Porto Alegre, RS", destination: "Pelotas, RS", DistanceKm: 270 },
        { origin: "Manaus, AM", destination: "Porto Velho, RO", DistanceKm: 580 },
        { origin: "Belém, PA", destination: "Ananindeua, PA", DistanceKm: 20 },
        { origin: "Goiânia, GO", destination: "Brasília, DF", DistanceKm: 209 },
        { origin: "Cuiabá, MT", destination: "Rondonópolis, MT", DistanceKm: 220 },
        { origin: "Palmas, TO", destination: "Gurupi, TO", DistanceKm: 242 },
        { origin: "Aracaju, SE", destination: "Maceió, AL", DistanceKm: 280 },
        { origin: "Teresina, PI", destination: "Parnaíba, PI", DistanceKm: 330 },
        { origin: "Vitória, ES", destination: "Linhares, ES", DistanceKm: 120 },
        { origin: "São Paulo, SP", destination: "Santos, SP", DistanceKm: 72 },
        { origin: "Belo Horizonte, MG", destination: "São Paulo, SP", DistanceKm: 586 },
        { origin: "Rio de Janeiro, RJ", destination: "Búzios, RJ", DistanceKm: 170 },
        { origin: "Campinas, SP", destination: "Ribeirão Preto, SP", DistanceKm: 192 },
        { origin: "São Luís, MA", destination: "Imperatriz, MA", DistanceKm: 630 },
        { origin: "Campo Grande, MS", destination: "Dourados, MS", DistanceKm: 230 },
        { origin: "Londrina, PR", destination: "Maringá, PR", DistanceKm: 100 },
        { origin: "João Pessoa, PB", destination: "Campina Grande, PB", DistanceKm: 120 },
        { origin: "Florianópolis, SC", destination: "Blumenau, SC", DistanceKm: 150 },
        { origin: "Porto Alegre, RS", destination: "Caxias do Sul, RS", DistanceKm: 130 },
        { origin: "Salvador, BA", destination: "Ilhéus, BA", DistanceKm: 430 },
        { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", DistanceKm: 313 },
        { origin: "Rio Branco, AC", destination: "Cruzeiro do Sul, AC", DistanceKm: 640 },
        { origin: "Boa Vista, RR", destination: "Manaus, AM", DistanceKm: 760 },
        { origin: "Macapá, AP", destination: "Belém, PA", DistanceKm: 520 }
    ],

    /*
      getAllCities()
      Retorna um array único e ordenado alfabeticamente contendo todos os nomes de
      cidades presentes nas rotas (origens e destinos).
    */
    getAllCities: function () {
        const set = new Set();
        this.routes.forEach(r => {
            if (r.origin) set.add(r.origin.trim());
            if (r.destination) set.add(r.destination.trim());
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
    },

    /*
      findDistance(origin, destination)
      Busca a distância entre duas cidades. A busca é feita em ambas as direções
      (origin->destination e destination->origin). As entradas são normalizadas
      (trim + lowercase) para comparação.
  
      Retorna a distância em km (número) se encontrada, ou null caso contrário.
    */
    findDistance: function (origin, destination) {
        if (!origin || !destination) return null;
        const normalize = s => s.toString().trim().toLowerCase();
        const o = normalize(origin);
        const d = normalize(destination);

        for (let i = 0; i < this.routes.length; i++) {
            const route = this.routes[i];
            const ro = normalize(route.origin);
            const rd = normalize(route.destination);
            if (ro === o && rd === d) return route.DistanceKm;
            if (ro === d && rd === o) return route.DistanceKm; // direção inversa
        }
        return null;
    }
};

/* Exemplo de uso (no console do navegador):
   RoutesDB.getAllCities();
   RoutesDB.findDistance('São Paulo, SP', 'Rio de Janeiro, RJ');
*/
