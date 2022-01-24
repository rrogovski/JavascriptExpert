'use strict';

const Event = require('events');
const event = new Event();
const eventName = 'counter';

event.on(eventName, (msg) => console.log('counter updated => ', msg));

// event.emit(eventName, 'Hasta la vista');
// event.emit(eventName, 'Baby');

// Objeto que será observado
const myCounter = {
    counter: 0
};

// No construtor do proxy ele recebe qual o target que ele
// irá observar e configurações de funções que serão disparadas
// quando ocorrer um set ou um get por exemplo, serão interceptados
const proxy = new Proxy(myCounter, {
    // Quando alguém usar o set do myCounter
    set: (target, propretyKey, newValue) => {
        // emiti um evento com dados do novo valor e do anterior
        event.emit(eventName, { newValue, key: target[propretyKey] });
        // Continuar o que deveria fazer
        target[propretyKey] = newValue;
        return true;
    },
    // Quando alguém chamar o get do myCounter
    get: (object, prop) => {
        console.log(`Chamou => ${object[prop]}`);
        return object[prop];
    }
});

// Executar a função a cada 500ms
// Será executado em breve mas não temos como saber o momento
setInterval(function () {
    proxy.counter += 1;
    console.log('[3]: setInterval');
    if (proxy.counter === 10) clearInterval(this);
}, 500)


// Para execução futura
setTimeout(() => {
    proxy.counter = 8;
    console.log('[2]: setTimeout');
}, 10)

// Mesma coisa que setTimeout com 0
// se quer que execute agora
setImmediate(() => {
    console.log('[1]: setImmediate => ', proxy.counter)
})

// --- node timers
// Se deseja que uma função seja executado agora, no exato momento
// podemos usar no nextTick(), mas isso é uma má prática, pois
// altera o ciclo de vida do node e interrope a pilha para inserir 
// essa nova rotina com prioridade total no node
process.nextTick(() => {
    proxy.counter = 5;
    console.log('[0]: nextTick');
})