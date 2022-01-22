const assert = require('assert');

// --Keys - chave única em nível de referência de memória
const uniqueKey = Symbol("userName");

// Criando um objeto e comparando como as chaves padrões funcionam
// e as chaves com o Symbol
const user = {};

user['userName'] = 'value for normal Objects';
user[uniqueKey] = 'value for Symbol';

// console.log('getting normal Objects => ', user.userName);
// // Sempre único em nível de endereço de memória
// // console.log(`Symbol('userName') => `, Symbol('userName').description);
// console.log('getting normal Objects => ', user[Symbol('userName').description]);
// console.log('getting normal Objects => ', user[Symbol('userName')]);
// console.log('getting normal Objects => ', user[uniqueKey]);

assert.deepStrictEqual(user.userName, 'value for normal Objects');

// Sempre único em nível de endereço de memória
assert.deepStrictEqual(user[uniqueKey], 'value for Symbol');

// Difícil de pegar, mas não é secreto.
// console.log('Symbols => ', Object.getOwnPropertySymbols(user));
// console.log('Symbols => ', Object.getOwnPropertySymbols(user)[0]);
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// byPass - má prática (nem tem no codeBase do node)
user[Symbol.for('password')] = 123;
assert.deepStrictEqual(user[Symbol.for('password')], 123);
// --Keys


// Well known Symbols
const obj = {
    // iterators: é o que o * faz por de baixo dos panos
    [Symbol.iterator]: () => ({
        items: ['c', 'b', 'a'],
        next() {
            return {
                done: this.items.length === 0,
                value: this.items.pop()
            }
        }
    })
}

// for (const item of obj) {
//     console.log('item => ', item);
// }

assert.deepStrictEqual([ ...obj ], ['a', 'b', 'c']);

const kItems = Symbol('kItems');

class MyDate {
    constructor(...args) {
        this[kItems] = args.map(arg => new Date(...arg));
    }

    [Symbol.toPrimitive](coercionType) {
        if (coercionType !== 'string') throw new TypeError();

        const items = this[kItems].map(item => 
                new Intl
                .DateTimeFormat('pt-BR', { month: 'long', day: '2-digit', year: 'numeric' })
                .format(item)
            );

        return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction'}).format(items);
    }

    // Lembrar de colocar o * para validar que ele seja iterador
    // podendo usar o yield
    // Quando usar um for-of em uma instância dessa classe
    // vai cair nessa função
    *[Symbol.iterator]() {
        for (const item of this[kItems]) {
            yield item
        }
    }

    // Quando usar um for-await em uma instância dessa classe
    // vai cair nessa função
    // Usamos um getTime() apenas para diferenciar as chamadas das funções
    async *[Symbol.asyncIterator]() {
        const timeout = (ms) => new Promise(r => setTimeout(r, ms));
        for (const item of this[kItems]) {
            await timeout(1000)
            yield item.getTime();
        }
    }

    get [Symbol.toStringTag]() {
        return 'What?!';
    }
}

const myDate = new MyDate(
    [2022, 0, 31],
    [2022, 1, 28]
)

const expectedDatesIterator = [
    new Date(2022, 0, 31),
    new Date(2022, 1, 28)
]

const expectedDatesAsyncIterator = [
    new Date(2022, 0, 31).getTime(),
    new Date(2022, 1, 28).getTime()
]

// console.log('myDate => ', myDate);

// Quando tentamos dar um toString em um Object, geralmente ele retorna
// [object Object], esse Object com O maísculo é chamado de toStringTag
// E podemos subistituir esse valor
// get [Symbol.toStringTag]() {
//     return 'What?!';
// }

assert.deepStrictEqual(Object.prototype.toString.call(myDate), '[object What?!]');

// console.log('myDate + 1 => ',  myDate + 1);
assert.throws(() => myDate + 1, TypeError);

// Coerção explícita para chamar o toPrimite
// console.log('String(myDate) => ', String(myDate));
assert.deepStrictEqual(String(myDate), '31 de janeiro de 2022 e 28 de fevereiro de 2022');

// Implementar o iterator
// *[Symbol.iterator]() {
//     for (const item of this[kItems]) {
//         yield item
//     }
// }
// for (const item of myDate) {
//     console.log('iterator => ', item);
// }
assert.deepStrictEqual([ ...myDate ], expectedDatesIterator);

// Para trabalhar com promises podemos usar o asyncIterator
// async *[Symbol.asyncIterator]() {
//     const timeout = (ms) => new Promise(r => setTimeout(r, ms));
//     for (const item of this[kItems]) {
//         await timeout(1000)
//         yield item.toISOString();
//     }
// }
// (async () => {
//     for await (const item of myDate) {
//         console.log('asyncIterator => ', item);
//     }
// })()

async function getFromAsyncIterator() {
    const dates = [];
    for await (const item of myDate) {
        dates.push(item)
    }

    console.log('getFromAsyncIterator dates => ', dates);
    return dates;
}

(async () => {
    const promisesValues = await Promise.all([ getFromAsyncIterator() ]);
    console.log('dates => ', promisesValues[0]);
    assert.deepStrictEqual(promisesValues[0], expectedDatesAsyncIterator);
})()

// Node usa o Symbol para muito coisa, principalmente para criar propriedades privadas
// Mesmo não tendo a palavra chave private, mas temos o comportamento pelo uso do Symbol
// Exemplos de uso no node
// lib/inspector.js#71
// [onMessageSymbol](message) {}
// 
// lib/readline.js#89
// const ESCAPE_DECODER = Symbol('escape-decoder');
// 
// crypto/hash.js#56
// const kFinalized = Symbol('kFinalized');
// 
// promises.js#78
// const kClosePromise = Symbol('kClosePromise');