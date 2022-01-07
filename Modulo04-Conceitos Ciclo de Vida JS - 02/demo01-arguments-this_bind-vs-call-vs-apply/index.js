'use strict';

const { watch, promises: { readFile } } = require('fs');

class File {
    watch(event, filename) {
        console.log('this => ', this);
        // console.log('arguments => ', arguments);
        console.log('arguments => ', Array.prototype.slice.call(arguments));
        this.showContent(filename)
    }

    async showContent(filename) {
        console.log((await readFile(filename)).toString());
    }
}

// watch(__filename, async (event, filename) => {
//     // console.log('index.js', event, filename);
//     console.log((await readFile(filename)).toString());
// })

const file = new File();
// Dessa forma é ignorado o 'this' da classe File
// Herda o this da func watch do fs
// watch(__filename, file.watch);

// Alternativa para não herdar o this da func watch do fs
// Usando arrow func
// Mas fica feio! Não é uma boa prática
// watch(__filename, (event, filename) => file.watch(event, filename));

// Alternativa onde podemos deixar explicito qual é o contexto que a função deve seguir
// O bind substitui o this de dentro da função para quando ela for chamada e o bind
// retorna uma nova função
// Sempre que for delegar uma função para que outra execute, sempre passa o bind com
// contexto que deseja
// O bind retorna uma função com o this que se mantém de file, ignorando o watch do fs
// watch(__filename, file.watch.bind(file));

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Call
// Alternativa usando o call
// Rebece um objeto com o mesmo nome da função que está lá no contexto, mas nesse exemplo essa
// a função showContent foi substituida por outra, e depois recebe os argumentos que essa função precisa 
// file.watch.call({ showContent: () => console.log('Func que substitui a do showContent') }, null, __filename);

// Usando o call sem substituir a função showContent
// file.watch.call(file, null, __filename);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
// Alternativa usando o apply
// Segue a mesma ideia do call, mas essa recebe dois parâmetros:
// O primeiro é contexto this
// E o segundo é opcional, que é um array de argumentos
file.watch.apply({ showContent: () => console.log('Func que substitui a do showContent') }, [null, __filename]);
// file.watch.apply(file, [null, __filename]);
