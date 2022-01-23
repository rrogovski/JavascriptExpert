// Na aula de prototype chaining vimos que quase tudo é herdado de
// Object em js. Isso tem seus prós e contras.
// Esse talvez seja um problema no pradigma OO, pois uma vez que
// é herdado métodos de uma classe base, se a classe base precisar de
// mais comportamento, todas as filhas serão afetadas, podendo
// tazer um risco para o ecossistema.

// O tipo Map é uma especialização de Object que pode ser usado em 
// cenários específicos. Seu objetivo não é substituir o Object
// e sim trazer uma alternativa poderosa para o seu código.
// Comparando ao ponto de vista de performance, o Map é mais indicado
// para cenário, onde você precisa ficar inserindo e removendo chaves
// dinamicamente, evitar conflitos entre nomes de propriedades que foram
// herdados pelo prtototype chaining e trazer uma semântica melhor para
// manipulação dos dados.

// O Map traz várias funções para validar se uma chave existe, remover
// o item de uma forma que não prejudique o ciclo de vida do javascript
// e implementa o padrão generetor, dessa forma podemos rodar um for-of
// no objeto para saber suas chaves, em quanto no Object teriamos que usar
// um Object.entries ou dar um for-in no objeto e manipular os valores por
// índice das chaves. Outro benefício do Map é que podemos usar objetos
// como chaves de pesquisa, enquanto o Object trabalha apenas com strings
// e symbols.

// Exemplos de uso no node
// lib/internal/encoding.js#76
// usado como chave-valor

// lib/inspector.js#51
// um Symbol recebendo um Map

const assert = require('assert');

const myMap = new Map();

// Podem ter qualquer coisa como chave
myMap
.set(1, 'one')
.set('giropops', { strigus: 'girus' })
.set(true, () => 'mais fácil que voar')
.set(() => {return 0}, 'func?!')

// Usando um construtor
const myMapWithContructor = new Map([
    ['1', 1],
    [2, '2'],
    [function () {return 1}, 'another func']
]);

// console.log('myMap => ', myMap);
// console.log('myMap.get(() => {return 0}) => ', myMap.get(() => {return 0}));
// console.log('myMap.get(1) => ', myMap.get(1));
// console.log('myMap.get(true) => ', myMap.get(true)());

assert.deepStrictEqual(myMap.get(1), 'one');
assert.deepStrictEqual(myMap.get('giropops'), { strigus: 'girus' });
assert.deepStrictEqual(myMap.get(true)(), 'mais fácil que voar');

// console.log('myMapWithContructor => ', myMapWithContructor);


// Em Objects a chave só podem ser string ou symbol (number é coergido a string)
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { msg: 'Mas bah tchê' });

// console.log('myMap.get({ id: 1 }) => ', myMap.get({ id: 1 }));
// console.log('myMap.get(onlyReferenceWorks) => ', myMap.get(onlyReferenceWorks));

assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { msg: 'Mas bah tchê' });


// Utilitários
// No Object temos o Object.keys({ a: 1 }).length para saber o tamanho do nosso objeto
// No Map temos o size, myMap.size
assert.deepStrictEqual(myMap.size, 5);

// Para verificar se um item existe no Object
// item.key = se não existe, então retorna undefined
// no if() ele faz a coerção implícita para boolean e retorna false
// O jeito correto em Object é ({ name: 'John Doe' }).hasOwnProperty('name')
// No Map temos o has, myMap.has(onlyReferenceWorks)
assert.ok(myMap.has(onlyReferenceWorks));

// Para remover um item do Object
// imperformático para o javascript
// delete item.name
// retorna true quando consegui deletar
assert.ok(myMap.delete(onlyReferenceWorks))

// Lembrando que não dá para iterar em Objects diretamente
// Se fossemos pegar o Object como chave-valor, teriamos que usar
// Object.entries(obj)
// Mas no Map já implementa o padrão dos generators
// assert.deepStrictEqual([ ...myMap ], [[ 1, 'one' ],[ 'giropops', { strigus: 'girus' } ],[ true, [Function (anonymous)] ],[ [Function (anonymous)], 'func?!' ]]);
// assert.deepStrictEqual(JSON.stringify([ ...myMap ]), '[[1,"one"],["giropops",{"strigus":"girus"}],[true,null],[null,"func?!"]]');
// assert.deepStrictEqual([ ...myMap ], [[1,"one"],["giropops",{"strigus":"girus"}],[true,()=>{}],[()=>{},"func?!"]]);
assert.deepStrictEqual(JSON.stringify([ ...myMap ]), JSON.stringify([[1,"one"],["giropops",{"strigus":"girus"}],[true,()=>{}],[()=>{},"func?!"]]));

// E como o Map implementar o generator podemos usar o for-of
// for (const [key, value] of myMap) {
//     console.log({key, value});
// }

// Object é inseguro, pois dependendo do nome da chave, pode substituir algum
// comportamento padrão
// ({}).toString() = [object Object]
// ({toString: () => 'What!'}).toString()

// Qualquer chave pode colidir, com as propriedades herdadas do Object, como
// constructor, toString, valueOf e etc.

const person = {
    name: 'John Doe',
    toString: 'Mr. John Doe'
}

// No Map não tem restrição de nome de chave
myMap.set(person);

assert.ok(myMap.has(person));
assert.throws(() => myMap.get(person).toString, TypeError);

// Outro problema no Object, não tem como limpá-lo sem reassiná-lo
// teriamos que sair setando as propriedades como undefined, exemplo
// no Map temos o clear
myMap.clear();
assert.deepStrictEqual([ ...myMap.keys() ], []);

// Na pratica podemos usar a estrutura Map quando
// precisa add chaves com frequência
// precisa validar se a chave existe de forma semântica
// ou quando precisa que um objeto funcione como um "banco de dados"
// onde a chave é um objeto que tem um conjunto de dados
// quando precisar limpar a referência após o uso


// Mas se você precisar somente add e remover chaves e pesquisar a partir
// do id, nesse caso temos outra estrutura de dados o weakMap
// A única diferença nele é que você só pode usar objetos como chave
// e ele não é um enumerador, ou seja você não consegue navegar nele com um
// for-of e tem menos métodos para usar
// A vantagem é em nível de performance, ele tem esse nome por ser um tipo
// de referência fraca, os dadossó vão ficar nele enquanto ele existir em memória,
// faz referência direta ao endereço de objetos

// -- WeakMap
// 
// lib/internal/erros.js#78
// usado para preparar o stackTrace
// 
// Pode ser coletado após perder as referências, assim que os endereços
// de memória sairem do nosso contexto
// Ele tem a maioria dos benefícios do Map
// MAS: 
//  não é iterável
//  Só chaves de referência e que você já conhece
//  Mais leve e preve leak de memória, pq depois que as instâncias saem da memória
//  coletadas pelo garbage colector do js, ele sai de dentro do weakMap

const weakMap = new WeakMap();
const hero = { name: 'Saitama'};

weakMap.set(hero);
weakMap.get(hero);
weakMap.delete(hero);
weakMap.has(hero);