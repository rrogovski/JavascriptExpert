// A estrutua do Set, serve como uma lista que só tem itens
// únicos, extremamente usado em lugares onde você precisa comparar
// duas listas

// lib/url.js#105
// iterable_weak_map.js#34

const assert = require('assert');

const arr1 = ['0', '1', '2'];
const arr2 = ['2', '0', '3'];
const arr3 = arr1.concat(arr2);
// console.log('arr3 => ', arr3.sort());
assert.deepStrictEqual(arr3.sort(), [ '0', '0', '1', '2', '2', '3' ]);

const set = new Set();
arr1.map(item => set.add(item));
arr2.map(item => set.add(item));
// console.log('Set with add item per item => ', set);
assert.deepStrictEqual(Array.from(set), ['0', '1', '2', '3']);
assert.deepStrictEqual(Array.from(new Set([ ...arr1, ...arr2 ])), ['0', '1', '2', '3']);

// console.log('set.keys() => ', set.keys());
// console.log('set.values() => ', set.values());

// No Array comum, para saber se um item existe
// [].indexOf('1') !== -1 ou [0].includes(0)
assert.ok(set.has('2'));

// mesma teoria do Map, mas você sempre trabalha com a lista toda
// nao tem get, então você precisa saber se o item está ou não na lista
// 

// tem nos dois sets
const users01 = new Set([
    'johndoe',
    'marydoe',
    'munha',
    'norrinradd'
]);

const users02 = new Set([
    'galactus',
    'lion',
    'pip',
    'norrinradd'
]);

const intersection = new Set([ ...users01 ].filter(user => users02.has(user)));
// console.log('intersection => ', intersection);
assert.deepStrictEqual(Array.from(intersection), ['norrinradd']);

const difference = new Set([ ...users01 ].filter(user => !users02.has(user)));
// console.log('difference => ', difference);
assert.deepStrictEqual(Array.from(difference), ['johndoe', 'marydoe', 'munha']);

// -- WeakSet
// 
// lib/internal/event_target.js#95

// Mesma ideia do WeakMap
// Não é enumerável (iterável)
// Só trabalha com chaves como referência
// Só tem métodos simples

const user1 = { id: 1 };
const user2 = { id: 2 };
const weakSet = new WeakSet([ user1 ]);
weakSet.add(user2);
weakSet.delete(user1);
weakSet.has(user2);

// Lembrando que a estrutura WeakMap e WeakSet são raras de serem usadas