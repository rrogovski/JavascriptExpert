# Regex

## Exemplo de pesquisa por padrões e substuição

Para buscar por números ou dígitos com regex
podemos usar:
```
\d
```
ou
```
[0-9]
```
A barra invertida `\` indica que é um "comamdo" da regex.
No exemplo abaixo aplicando a expressão `\d`, teremos um _match_ com todos os dígitos.
Mas olhando o exemplo, vemos que temos um padrão, de três dígitos consecutivos. Podemos
dar um _match_ neles usando o `\d{3}`.

```
123.456.789-10
987.654.321-10
321.456.897.99
```

![Exemplo de regex](./img/01.png "Exemplo de regex")

Agora para pegar apenas o início de cada linha, usando o `^`, que indica justamente o ínício da linha que tenha o padrão `\d{3}`.
Repare que os outros foram ignorados.

![Exemplo de regex](./img/02.png "Exemplo de regex")

Para fazer um _match_ completo do padrão do CPF, podemos `^\d{3}.\d{3}.\d{3}-\d{2}`. Nesse caso o `.` está sendo pesquisado de forma
literal.

![Exemplo de regex](./img/03.png "Exemplo de regex")

E como boa prática encerramos o `$`, indicando que expressão termina na linha, evitando processamento desnecessário.

![Exemplo de regex](./img/04.png "Exemplo de regex")

Agora para pesquisar os caracteres especiais `.` e `-` usamos `[.-]`. No exemplo temos uma pesquisa feita no _VSCode_, onde poderiamos fazer
um _replace_ para vazio. E usamos os `[]`, para dizer que ou vai ser `.` ou vai ser `-`.

![Exemplo de regex](./img/05.png "Exemplo de regex")

## Exemplo CSV para JSON

Vamos considerar o exemplo abaixo como um _csv_ com _lastname_ e _firstname_. Vamos usar uma expressão para esse padrão e alterar o _csv_ para um _json_.

```csv
{"fisrtName": "Frankie", "lastName": "Raye"}
{"fisrtName": "Carol", "lastName": "Danvers"}
{"fisrtName": "Adam", "lastName": "Warlock"}
{"fisrtName": "Norrin", "lastName": "Radd"}
```
Primeiro vamos tentar entender o padrão. Podemos usar `\w` para pegar cada _word character_ de forma separada. Note que `\w` equivale à `[a-zA-Z0-9_]`.

![Exemplo de regex](./img/06.png "Exemplo de regex")

Mas no nosso exemple queremos pegar a palavra toda. Pdemos usar o `\w+`, assim pegamos todas as letras até chegar em caracter especial.

![Exemplo de regex](./img/07.png "Exemplo de regex")

Mas compor todo o padrão, temos que pegar também a `,` e o espaço em branco seguindo da próxima palavra. Então, incluimos a `,` na nossa expressão e `\s` para incluir o espaço. Caso quiséssemos desconsiderar o espaço poderiamos usar o `\S`, com o S maiúsculo. E para pegar o restante da palavra, basta repetir o `\w+`.

![Exemplo de regex](./img/08.png "Exemplo de regex")

Mas, vamos seprar esses _matches_ por grupos, assim podemos usá-los de forma mais eficiente no nosso _replace_ para _json_.
Para isso, para colocar cada _match_ entre parenteses. A `,` e o espaço não serão necessários para o nosso resultado.

![Exemplo de regex](./img/09.png "Exemplo de regex")

E olhando no _Match Information_ do _regex101_ temos o _Full Match_ que corresponde ao grupo 0, o _Group 1_ e o _Group 2_.

E para manter as boas práticas use `^` no início e o `$` no fim.

![Exemplo de regex](./img/10.png "Exemplo de regex")

Agora com esse padrão vamos para o _VSCode_ e fazer o nosso _replace_. Repare que na pesquisa do _VSCode_ já identificou 4 ocorrências. E agora vamos dar um _replace_ por `{fisrtName: "$2", lastName: "$1"}`, onde o `$2` é o _Group 2_ e o `$1` é o _Group 1_. O `$0` corresponde ao _Full Match_.

![Exemplo de regex](./img/11.png "Exemplo de regex")

E ao executar o _replace_, temos:


![Exemplo de regex](./img/12.png "Exemplo de regex")

```json
{"fisrtName": "Frankie", "lastName": "Raye"}
{"fisrtName": "Carol", "lastName": "Danvers"}
{"fisrtName": "Adam", "lastName": "Warlock"}
{"fisrtName": "Norrin", "lastName": "Radd"}
```
