class TextProcessorFluentAPI {
    // Propriedade privada 
    #content;

    constructor(content) {
        this.#content = content;
    }

    extractPeopleData() {
        // ?<= fala que vai extrair os dados que virão depois desse grupo
        // [contratente|contratada] ou um ou outro (e tem a flag no fim da expressão para case insensitive)
        // :\s{1} vai procurar o caracter literal do dois pontos seguido de um espaço
        // tudo isso fica dentro de parenteses para falar que  vamos pegar tudo daí para frente
        // (?!\s) ignorar os contratante/contratada que tiver mais de um espaço a frente, negative look around, vai ignorar os contratantes do fim do documento.
        // .*\n pega qualquer coisa até o primeiro \n
        // .*? non greety, esse ? faz com que ele pare na primeira recorrência, assim ele evita ficar em loop
        // $ informar que a pesquisa acaba no fim da linha
        // g global
        // m multiline
        // i case insensitive
        const matchPerson = /(?<=[contratente|contratada]:\s{1})(?!\s)(.*\n.*?)$/gmi;
        const onlyPerson = this.#content.match(matchPerson);

        // console.log('onlyPerson => ', onlyPerson);

        this.#content = onlyPerson;

        return this;
    }

    build() {
        return this.#content;
    }
}

module.exports = TextProcessorFluentAPI;