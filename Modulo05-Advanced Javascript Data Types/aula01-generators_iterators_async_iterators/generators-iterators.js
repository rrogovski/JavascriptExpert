const assert = require('assert');

function* calculation(arg1, arg2) {
    yield arg1 * arg2;
}

function* main() {
    yield 'Hello';
    yield '-';
    yield 'World';

    // Como calculation é uma função
    // Devemos usar o * depois do yield para que a função
    // seja executada e tenhamos o seu retorno
    // Caso use o yield sem o *, será retornada a função
    // para ser executada posteriormente
    yield* calculation(2, 256);
}

const generator = main();

// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());

assert.deepStrictEqual(generator.next(), { value: 'Hello', done: false });
assert.deepStrictEqual(generator.next(), { value: '-', done: false });
assert.deepStrictEqual(generator.next(), { value: 'World', done: false });
assert.deepStrictEqual(generator.next(), { value: 512, done: false });
assert.deepStrictEqual(generator.next(), { value: undefined, done: true });

// console.log('Array.from => ', Array.from(main()));

assert.deepStrictEqual(Array.from(main()), [ 'Hello', '-', 'World', 512 ]);
assert.deepStrictEqual([...main()], [ 'Hello', '-', 'World', 512 ]);


// --------- async Iterators
const { readFile, stat, readdir } = require('fs/promises');

function* promisified() {
    yield readFile(__filename);
    yield Promise.resolve('Hey Jude!');
}

// console.log('promisified => ', [ ...promisified() ]);
// Promise.all([ ...promisified() ]).then(results => console.log('promisified => ', results));

// (async () => {
//     for await (const item of promisified()) {
//         console.log('for await => ', item.toString());
//     }
// })()

async function* systemInfo() {
    const file = await readFile(__filename);

    yield { file: file.toString() };

    const { size } = await stat(__filename);
    yield { size };

    const dir = await readdir(__dirname);
    yield { dir };
}

(async () => {
    for await (const item of systemInfo()) {
        console.log('for await => ', item);
    }
})()