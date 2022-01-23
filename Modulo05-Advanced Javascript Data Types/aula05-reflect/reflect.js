// Tem como objetivo garantir a semântica e segurança em objetos

'use strict'

const assert = require('assert');

// --- apply
const myObj = {
    add(myValue) {
        return this.arg1 + this.arg2 + myValue;
    }
};

// Function.prototype.apply = () => { throw new TypeError('WTF!')}
// myObj.add.apply = function () { throw new Error('Tu tá de brincation with to me?')};

assert.deepStrictEqual(myObj.add.apply({ arg1: 2, arg2: 3 }, [37]), 42);

// Um problema que pode aconter (raro)
// Function.prototype.apply = () => { throw new TypeError('WTF!')}

// Uma forma mais comum de acontecer
// myObj.add.apply = function () { throw new Error('Tu tá de brincation with to me?')};
myObj.add.apply = function () { throw new TypeError('Hein?!')};

// assert.throws(
//     () => myObj.add.apply({ arg1: 2, arg2: 3 }, [37]),
//     {
//         name: 'TypeError',
//         message: 'Oxente!'
//     }
// );

assert.throws(
    () => myObj.add.apply({ arg1: 2, arg2: 3 }, [37]),
    {
        name: 'TypeError',
        message: 'Hein?!'
    }
);

// Usando Reflect:
const result = Reflect.apply(myObj.add, { arg1: 2, arg2: 3 }, [37]);
assert.deepStrictEqual(result, 42);
// --- apply fim

// --- defineProperty
// usado mais por questões semânticas
function MyDate() {}

// Object modificando uma function?! Pois é, no fim das contas tudo é Object
// no javascript
Object.defineProperty(MyDate, 'withObject', { value: () => 'My Gosh! - Object' });

// Com reflect, dessa forma sabemos que não necessariamente é um objeto
Reflect.defineProperty(MyDate, 'withReflect', { value: () => 'My Gosh! - Reflect' });

assert.deepStrictEqual(MyDate.withObject(), 'My Gosh! - Object');
assert.deepStrictEqual(MyDate.withReflect(), 'My Gosh! - Reflect');
// --- defineProperty fim

//  --- deleteProperty
const withDelete = { user: 'Gwen Stacy' };
// imperformático, evitar ao máximo
delete withDelete.user;

assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false);

const withReflect = { user: 'Uncle Ben' };
// Dessa forma respeitamos o ciclo de vida do js
Reflect.deleteProperty(withReflect, 'user');

assert.deepStrictEqual(withReflect.hasOwnProperty('user'), false);
//  --- deleteProperty fim


// --- get
// Deveriamos fazer um get somemte em instâncias de referência
// Pois um tipo primitivo, como o number 1, ele não tem um set
// sempre vai retornar um valor estático
// Exemplo de uma coisa muito errada.
// Estamos acessando uma chave do number 1
// Dará undefined, mas não gera erro.
assert.deepStrictEqual(1['userName'], undefined);

// Mas com Reflect, uma exceção é lançada
assert.throws(() => Reflect.get(1, 'userName'), TypeError);
// --- get fim


// --- has
// Verifica se tem uma dada chave em um objeto
assert.ok('superman' in { superman: 'Clark Kent' });

// Com Reflect
assert.ok(Reflect.has({ superman: 'Clark Kent' }, 'superman'));
// --- has fim


// --- ownKeys
const user = Symbol('user');
const dbUsers = {
    id: 1,
    [Symbol.for('password')]: 123,
    [user]: 'peter'
}

// Com os métodos de Object, temos que fazer duas requisições para pegar os
// Symbols e as chaves
const objKeys = [
    ...Object.getOwnPropertyNames(dbUsers),
    ...Object.getOwnPropertySymbols(dbUsers)
];
// console.log('objKeys => ', objKeys);

assert.deepStrictEqual(objKeys, [ 'id', Symbol.for('password'), user ]);

// Com Reflect, precisamos fazer usado apenas um método
assert.deepStrictEqual(Reflect.ownKeys(dbUsers), [ 'id', Symbol.for('password'), user ]);