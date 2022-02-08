# Regex - Segurança

## Validação de expressões

[Artigo Base](https://lirantal.medium.com/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02)

```javascript
^([a-zA-Z|0-9]+\s?)+$
```

![Exemplo de regex](./img/01.png "Exemplo de regex")

Para fazer a validação das expressões, vamos instalar _safe-regex_.

```bash
npm i safe-regex
```

Abaixo temos dois exemplos de comandos, para avaliar quando tempo o node vai levar para executar, usando uma expressão não segura. Perceba o percentual de uso do processador. Sendo que no primeiro caso o meu PC não cegou a travar a aplicação, mas atingou 99% de uso do processador, e no segundo travou a aplicação, onde precisei cancelar a execução com `CTRL + C`.

```bash
    /usr/bin/time -f "%E real,%U user,%S sys, %P proc" \
    node --eval "/^([a-zA-Z|0-9]+\s?)+$/.test('eaeee como vai voce e como vai voce?') && console.log('Vai dar crash?')"
```
```bash
    /usr/bin/time -f "%E real,%U user,%S sys, %P proc" \
    node --eval "/^([a-zA-Z|0-9]+\s?)+$/.test('eaeee como vai voce e como vai voce e como vai voce?') && console.log('Vai dar crash?')"
```

