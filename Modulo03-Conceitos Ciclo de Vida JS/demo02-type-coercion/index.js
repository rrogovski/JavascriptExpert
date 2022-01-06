// Coisas bizarras do JS
console.log('true + 2 => ', true + 2);
console.log('true - 2 => ', true - 2);
console.log("'21' + true => ", '21' + true);
console.log("'21' - true => ", '21' - true);
console.log('9999999999999999 => ', 9999999999999999); // 16 dígitos
console.log('0.1 + 0.2 => ', 0.1 + 0.2);
console.log('0.1 + 0.2 === 0.3 => ', 0.1 + 0.2 === 0.3);
console.log('3 > 2 => ', 3 > 2); // true como esperado
console.log('2 > 1 => ', 2 > 1); // true como esperado
console.log('3 > 2 > 1 => ', 3 > 2 > 1); // Mas aqui temos false, o que não é o esperado
console.log('3 > 2 >= 1 => ', 3 > 2 >= 1); // Para funcionar teria que ser
console.log("'21' - -1 => ", '21' - -1);
console.log("'1' == 1 => ", '1' == 1); // loose equality operator
console.log("'1' === 1 => ", '1' === 1); // strict equality operator
console.log("'B' + 'a' + + 'a' + 'a' => ", 'B' + 'a' + + 'a' + 'a');

//------------------------------------------------------------------------------------

// Consersão explicita, devemos chamar a função, como por exemplo
console.log('String(123) => ', String(123));

// Para conversão implicita podemos somar como uma string, como por exemplo
console.log("123 + ''", 123 + '');

console.assert(String(123) === '123', 'Explicit convertion to string');
console.assert(String(123) === '123a', 'Explicit convertion to string');

console.assert(123 + '' === '123', 'Implicit convertion to string');
console.assert(123 + 'a' === '123', 'Implicit convertion to string');

//------------------------------------------------------------------------------------
// Note que o js faz a conversão implicitamente dentro do if
// Ele não retorna um boolean. O boolean é feito implicitamente dentro do if

if(null || 1) {
    console.log('null || 1 => ', 'ae!');
}

if('hello' || 1) {
    console.log("'hello' || 1 => ", 'ae!');
}

// Sempre retorna o primeiro argumento se os dois forem true
let r = 'hello' || 1;
console.log("Valor da expr: 'hello' || 1 => ", r);

if('null' || 1) {
    console.log("'null' || 1 => ", 'ae!');
}

r = 'null' || 1;
console.log("Valor da expr: 'null' || 1 => ", r);

console.assert(('hello' || 123) === 'hello','|| returns the first element if both are true!');
console.assert(('hello' || 123) === 123,'|| returns the first element if both are true!');
console.assert(('hello' && 123) === 123,'&& returns the last element if both are true!');
console.assert(('hello' && 123) === 'hello','&& returns the last element if both are true!');

//------------------------------------------------------------------------------------
// Para objetos o js faz a coerção seguindo um regra
// No JS todo objeto possui alguns métodos por padrão como:
// toString(), isPrototypeOf(), hasOwnProperty(), valueOf() e outros.
// No momento de conversão de um objeto para string, o JS segue uma ordem de chamada
// 1o - Se o tipo já é primitivo, não faz nada e já retorna;
// 2o - Se não ele chama a função toString do objeto, e se o resultado for um tipo
//      primitivo, ele retorna;
// 3o - Se por algum motivo ele for um objeto, ele chama o valueOf;
// 4o - Se nem o toString e nem o ValueOf, retornarem um valor primitivo, estoura um
//      erro de typeError
//
// Importante notar que a ordem de chamada do toString e o valueOf, podem mudar dependendo
// do tipo de conversão, se for um tipo numérico ele vai tentar primeiro chamar o valueOf
// Ainda tem um terceiro caso que veio no ES6, o Symbol.toPrimitive, que tem uma ordem de
// prioridade maior que o toString e o valueOf, e se for implementado, será ignorado todo
// o resto

// Objeto com os métodos default
const item = {
    name: 'John Doe',
    age: '40'
};

console.log('item + 0 => ', item + 0);


// Objeto com os métodos sobreescritos apenas toString
const item2 = {
    name: 'John Doe',
    age: '40',
    toString() {
        return `Name: ${this.name}, Age: ${this.age}`
    }
};

console.log('item2 + 0 => ', item2 + 0);

// Objeto com os métodos sobreescritos toString e valueOf
const item3 = {
    name: 'John Doe',
    age: '40',
    // string: 1o se não for primitivo, chama o valueOf
    toString() {
        return `Name: ${this.name}, Age: ${this.age}`
    },
    // number: 1o se não for primitivo, chama o toString
    valueOf() {
        return 007
    }
};

console.log('item3 + 0 => ', item3 + 0);
console.log("''.concat(item3) => ", ''.concat(item3));

console.log('toString', String(item3));
console.log('valueOf', Number(item3));

// Objeto com os métodos sobreescritos toString e valueOf returnando um tipo não primitivo
// Causando um NaN (Not a Number)
const item4 = {
    name: 'John Doe',
    age: '40',
    // string: 1o se não for primitivo, chama o valueOf
    toString() {
        console.log('Tentou o toString');
        return `Name: ${this.name}, Age: ${this.age}`
    },
    // number: 1o se não for primitivo, chama o toString
    valueOf() {
        return { id: 007 }
    }
};

// console.log('toString', String(item4));
// Vai retornar NaN pois o toString retornou uma string
console.log('valueOf', Number(item4));

// Objeto com os métodos sobreescritos toString e valueOf returnando um tipo não primitivo
// Causando um NaN (Not a Number), mas com a implementação do Symbol.toPrimitive
const item5 = {
    name: 'John Doe',
    age: '40',
    // string: 1o se não for primitivo, chama o valueOf
    toString() {
        console.log('Tentou o toString');
        return `Name: ${this.name}, Age: ${this.age}`
    },
    // number: 1o se não for primitivo, chama o toString
    valueOf() {
        return { id: 007 }
    },
    // Ele tem a prioridade!
    [Symbol.toPrimitive](coercionType) {
        console.log('Trying to convert to', coercionType);

        // Usando um hashTable
        const types = {
            string: JSON.stringify(this),
            number: '007'
        }

        return types[coercionType] || types.string;
    }
};

console.log('toString', String(item5));
console.log('valueOf', Number(item5));
// Nesse caso chama a conversão default que é um boolean
console.log('Date', new Date(item5));
console.assert(item5 + 0 === '{"name":"John Doe","age":"40"}0');
console.log('!!item5 is true => ', !!item5);
console.assert(!!item5);
console.log("'Ae'.concat => ", 'Ae'.concat(item5));
console.assert('Ae'.concat(item5) === 'Ae{"name":"John Doe","age":"40"}');
console.log('implict + explict coercion (using ==) => ',  item5 == String(item5));
console.assert(item5 == String(item5));

const item6 = { ...item5, name: 'Mary Doe', age: 30};
console.log('New Object', item6);
console.assert(item6.name === 'Mary Doe' && item6.age === 30);