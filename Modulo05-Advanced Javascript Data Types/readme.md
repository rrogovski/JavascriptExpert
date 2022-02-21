# Advanced Javascript Data Types

## Generators, Iterators e Async Iterators

### Generators

São usados para trabalhar com dados sob demanda. Precisamos anotar a função com `*` e usar o `yield` para retornar dados sob demanda.
Funciona de forma análoga à uma função recursiva.

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