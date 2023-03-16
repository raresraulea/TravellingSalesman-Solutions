console.log('HA')

const coolingRate = 0.99;
const numberOfCities = 5;
const initialTemperature = 100;
const stoppingCriterion = (t) => t < 0.01;

const getRandomBetween = (a, b) => (a + (b - a + 1) * Math.random());
const getDistance = (city1, city2) => Math.sqrt(
    (city1.x - city2.x) * (city1.x - city2.x) + (city1.y - city2.y) * (city1.y - city2.y)
);

const cities = new Array(numberOfCities).fill({}).map((c) => ({
    ...c,
    x: getRandomBetween(10, 50),
    y: getRandomBetween(10, 50),
}));

console.log({initialCities: cities})

const swapCities = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const swapTwoCities = (cities) => {
  const newCities = cities.slice();
  const i = Math.floor(Math.random() * newCities.length);
  let j = Math.floor(Math.random() * newCities.length);
  while (j === i) {
    j = Math.floor(Math.random() * newCities.length);
  }
  swapCities(newCities, i, j);
  return newCities;
};

const acceptNewSolution = (delta, temperature) => {
  if (delta < 0) {
    return true;
  }
  const probability = Math.exp(-delta / temperature);
  const random = Math.random();
  return random < probability;
};

const temperature = (t) => initialTemperature * coolingRate ** t

const solution = cities.map((_, idx) => idx);

let currentSolution = cities.slice();
let currentDistance = Infinity;
for (let temperature = initialTemperature; !stoppingCriterion(temperature); temperature *= coolingRate) {
  const newSolution = swapTwoCities(currentSolution);
  const newDistance = newSolution.reduce((acc, city, i) => i === newSolution.length - 1 ? acc + getDistance(city, newSolution[0]) : acc + getDistance(city, newSolution[i + 1]), 0);
  const delta = newDistance - currentDistance;
  if (acceptNewSolution(delta, temperature)) {
    currentSolution = newSolution;
    currentDistance = newDistance;
  }
}

console.log('Final solution:', currentSolution);
console.log('Final distance:', currentDistance);

