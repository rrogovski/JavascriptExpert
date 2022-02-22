# Advanced Javascript Data Types

## Generators, Iterators e Async Iterators

### Generators

São usados para trabalhar com dados sob demanda. Precisamos anotar a função com `*` e usar o `yield` para retornar dados sob demanda.
Funciona de forma análoga à uma função recursiva.

Em poucas palavras, fazer com que as funções virem listas e que entreguem os dados sob demanda.

Exemplo de um _genarator_:

```javascript
    async * getPaginated({ url, page }) {
        const result = await this.handleRequest({ url, page });
        const latId = result[result.length - 1]?.tid ?? 0;

        // Criteŕio de parada
        if (lastId === 0 ) return;

        yield result;

        yield* this.getPaginated({ url, page: lastId });
    }
```

Quando usamos o `yield { 0 }`, o retorno pode ser:

* ```javascript
    { done: false, value: 0 }
    const r = getPaginated()
    r.next() // retorna: { done: false, value: 0 }
    r.next() // retorna: { done: true, value: undefined }
    ```
* Quando quermos delegar uma execução (não retornar valor), usamos `yield* func`

[Live sobre _Generators_ e _Iterators_](https://www.youtube.com/watch?v=w_UE-wTZPpM)
[Para saber mais sobre _Generators_.](https://javascript.info/generators)
[Para saber mais sobre _Generators_.](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/function*)
[Para saber mais sobre _Generators_.](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Generator)

### Iterator

Se usarmos o `Array.from(getPaginated())` ele retorna todos os valores em um _array_, mas isso não é uma boa prática. E dependendo da quantidade de dados.

Também podemos usar o _rest spread_ `[...getPaginated()]`, que retorna o mesmo resultado. Outra alternativa é o _for of_.

### Async Iterator

Podemos utilizar o _Async Iterator_, desde que o nosso _Generator_ seja uma _Async Generator_.

```javascript
    const Pagination = require('./pagination')

    ;(async () => {
        const pagination = new Pagination()
        
        const firstPage = 770e3
        const req = pagination.getPaginated({
            url: 'https://www.mercadobitcoin.net/api/BTC/trades/',
            page: firstPage
        })
        for await (const items of req) {
            console.table(items)
        }
    })()
```

## Symbol

É um tipo primitivo que foi adicionado a linguaguem em 2015. Algo frequente no projeto _NodeJS_ é utilizar o _Symbol_ para valores únicos, que provavelmente usuaríamos como uma _string_ ou _number_. Algo como chave de objetos ou nome de função.

Outro caso de uso, é para a criação de funções privadas em classes que não devem ser acessadas diretamente de forma externa.

Além disso podemos utilizar as propriedades do _Symbol_ interceptar o comportamento padrão de objetos do _Javascript_. Como por exemplo 