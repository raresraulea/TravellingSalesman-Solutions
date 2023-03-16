const numberOfCities = 5;
const maxIterations = 100;
const numberOfAnts = 10;
const evaporationRate = 0.5;
const alpha = 1; // pheromone importance
const beta = 2; // distance importance

const getRandomBetween = (a, b) => (a + (b - a + 1) * Math.random());
const getDistance = (city1, city2) => Math.sqrt(
    (city1.x - city2.x) * (city1.x - city2.x) + (city1.y - city2.y) * (city1.y - city2.y)
);

const cities = new Array(numberOfCities).fill({}).map((c) => ({
    ...c,
    x: getRandomBetween(10, 50),
    y: getRandomBetween(10, 50),
}));

const pheromone = new Array(numberOfCities).fill(0).map(() => new Array(numberOfCities).fill(1e-6));


let bestTour;
let bestTourLength = Number.MAX_SAFE_INTEGER;

for (let iteration = 0; iteration < maxIterations; iteration++) {
    const antTours = new Array(numberOfAnts).fill(0).map(() => {
        const tour = [Math.floor(Math.random() * numberOfCities)];
        const unvisitedCities = new Set([...Array(numberOfCities).keys()].filter(i => i !== tour[0]));
        while (unvisitedCities.size > 0) {
            const probabilities = Array.from(unvisitedCities).map(city => ({
                city,
                probability: Math.pow(pheromone[tour[tour.length - 1]][city], alpha) * Math.pow(1 / getDistance(cities[tour[tour.length - 1]], cities[city]), beta),
            }));
            const sumProbabilities = probabilities.reduce((sum, p) => sum + p.probability, 0);
            const random = Math.random() * sumProbabilities;
            let cumulativeProbability = 0;
            for (const p of probabilities) {
                cumulativeProbability += p.probability;
                if (random <= cumulativeProbability) {
                    tour.push(p.city);
                    unvisitedCities.delete(p.city);
                    break;
                }
            }
        }
        return tour;
    });

    for (let i = 0; i < numberOfCities; i++) {
        for (let j = 0; j < numberOfCities; j++) {
        if (i !== j) {
            pheromone[i][j] *= (1 - evaporationRate);
            for (const tour of antTours) {
                const indexI = tour.indexOf(i);
                const indexJ = tour.indexOf(j);
                if (indexI !== -1 && indexJ === indexI + 1) {
                    pheromone[i][j] += 1 / getDistance(cities[i], cities[j]);
                }
            }
        }
        }
    }

    // Find the best tour of this iteration
    for (const tour of antTours) {
        const tourLength = tour.reduce((sum, city, index) => {
            const nextCity = index < tour.length - 1 ? tour[index + 1] : tour[0];
            return sum + getDistance(cities[city], cities[nextCity]);
        }, 0);

        if (tourLength < bestTourLength) {
            bestTour = tour;
            bestTourLength = tourLength;
        }
    }

}

console.log(`Best tour found: ${bestTour.join(' -> ')} -> ${bestTour[0]}`);
console.log(`Length of best tour: ${bestTourLength.toFixed(2)}`);