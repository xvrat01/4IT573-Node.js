// console.log('Hello world!');

const add = (a, b) => a + b;

// console.log(add(2, 3));

const binaryOperation = (a, b, operation) => operation(a, b);

// console.log(binaryOperation(5, 10, add));

const makeCounter = () => {
  let count = 0;

  const increment = () => {
    count += 1;
    return count;
  };

  return increment;
};

const counter1 = makeCounter();
// proměnná counter má v sobě funkci increment a zároveň i proměnnou count
console.log(counter1());
console.log(counter1());

// každá funkce makeCounter vytvoří separátní "instanci", který má svou vlastní proměnnou count
const counter2 = makeCounter();
console.log(counter2());
console.log(counter2());