const assert = require('assert');

// Objetos literais
const obj = {};
const arr = [];
const fn = () => {};

// Internamente, objetos literais viram funções explícitas
console.log('new Object() is {}? => ', new Object().__proto__ === {}.__proto__);
assert.deepStrictEqual(new Object().__proto__, {}.__proto__);

// __proto__ é a referência do objeto que possui as propriedades nele
console.log('obj.__proto__ === Object.prototype => ', obj.__proto__ === Object.prototype);
assert.deepStrictEqual(obj.__proto__, Object.prototype);

console.log('arr.__proto__ === Array.prototype => ', arr.__proto__ === Array.prototype);
assert.deepStrictEqual(arr.__proto__, Array.prototype);

console.log('fn.__proto__ === Function.prototype => ', fn.__proto__ === Function.prototype);
assert.deepStrictEqual(fn.__proto__, Function.prototype);

// o __proto__ de Object.prototype é null
console.log('obj.__proto__.__proto__ === null => ', obj.__proto__.__proto__ === null);
assert.deepStrictEqual(obj.__proto__.__proto__, null);

//--------------------------------------------------------------------------------------
// Como era feito no ES5 antes das classes

console.log('\n-- Como era feito no ES5 antes das classes --\n');

function Employee() {};
Employee.prototype.salary = () => 'salary**';

console.log('Employee.prototype.salary() => ', Employee.prototype.salary());

function Supervisor() {};
// Herda a instância de Employee
Supervisor.prototype = Object.create(Employee.prototype);
Supervisor.prototype.profitShare = () => 'profitShare**';
console.log('Supervisor.prototype.salary() => ', Supervisor.prototype.salary());

function Manager() {};
Manager.prototype = Object.create(Supervisor.prototype);
Manager.prototype.monthlyBonuses = () => 'monthlyBonuses**';
console.log('Manager.prototype.salary() => ', Manager.prototype.salary());

// Note que podemos chamar via prototype, mas se tentar chamar direto dá erro!
// Como exemplo abaixo
// console.log('Manager.salary() => ', Manager.salary());

// Se não chamar o 'new', o primeiro __proto__ vai ser sempre
// a instância de Function, sem herdar nossas classes
// Para acessar as classes sem o new, podemos acessar direto via prototype
console.log('Manager.prototype.__proto__ === Supervisor.prototype => ', Manager.prototype.__proto__ === Supervisor.prototype);
assert.deepStrictEqual(Manager.prototype.__proto__, Supervisor.prototype);

// quando usamos com o 'new' o __proto__ recebe o prototype atual do objeto
// console.log('new Manager().__proto__: %s, new Manager().salary(): %s', new Manager().__proto__, new Manager().salary());
console.log('Manager.prototype => ', Manager.prototype);
console.log('new Manager().prototype => ', new Manager().prototype);
console.log('new Manager().__proto__ => ', new Manager().__proto__);
console.log('new Manager().salary() => ', new Manager().salary());

console.log('Supervisor.prototype === new Manager().__proto__.__proto__ => ', Supervisor.prototype === new Manager().__proto__.__proto__);
assert.deepStrictEqual(Supervisor.prototype, new Manager().__proto__.__proto__);

console.log('\n-- Usando o new para criar novas instâncias --\n');

const manager = new Manager();
console.log('manager.salary() => ', manager.salary());
console.log('manager.profitShare() => ', manager.profitShare());
console.log('manager.monthlyBonuses() => ', manager.monthlyBonuses());
console.log('manager.prototype => ', manager.prototype);
console.log('manager.__proto__ => ', manager.__proto__);
assert.deepStrictEqual(manager.__proto__, Manager.prototype);

console.log('manager.__proto__.__proto__ => ', manager.__proto__.__proto__);
assert.deepStrictEqual(manager.__proto__.__proto__, Supervisor.prototype);

console.log('manager.__proto__.__proto__.__proto__ => ', manager.__proto__.__proto__.__proto__);
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__, Employee.prototype);

console.log('manager.__proto__.__proto__.__proto__.__proto__ => ', manager.__proto__.__proto__.__proto__.__proto__);
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__.__proto__, Object.prototype);

console.log('manager.__proto__.__proto__.__proto__.__proto__.__proto__ => ', manager.__proto__.__proto__.__proto__.__proto__.__proto__);
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__.__proto__.__proto__, null);


//--------------------------------------------------------------------------------------
// Usando classes introduzidas no ES6
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
// A palavra reservada class é o que chamamos de syntactic sugar
console.log('\n-- Utilizando classes ES6 --\n');

class T1 {
    ping() {
        return 'ping';
    }
}

class T2 extends T1 {
    pong() {
        return 'pong';
    }
}

class T3 extends T2 {
    shoot() {
        return 'shoot';
    }
}

const t3 = new T3();

console.log('t3 inherits null? => ', t3.__proto__.__proto__.__proto__.__proto__.__proto__ === null);
console.log('t3.ping() => ', t3.ping());
console.log('t3.pong() => ', t3.pong());
console.log('t3.shoot() => ', t3.shoot());

assert.deepStrictEqual(t3.__proto__, T3.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__, T2.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__, T1.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__.__proto__, Object.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__.__proto__.__proto__, null);