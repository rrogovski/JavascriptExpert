const { deepStrictEqual } = require('assert');

// Por valor
// Para tipos primitivos o js gera uma cópia em memória
let counter = 0;
let counter2 = counter;
counter2++

deepStrictEqual(counter, 0);
deepStrictEqual(counter2, 1);

console.log('counter', counter);
console.log('counter2', counter2);


// Por referência
// Para tipo que não são primitivos, como por exemplo objetos e arrays, o js
// copia o endereço de memória, ou seja é uma referência (aponta para o mesmo lugar)
const item = { counter: 0 };
const item2 = item;
item2.counter++;

deepStrictEqual(item, { counter: 1 });

item.counter++;
deepStrictEqual(item2, { counter: 2 });

console.log('item', item);
console.log('item2', item2);
