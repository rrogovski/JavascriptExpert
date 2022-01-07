import DraftLog from 'draftlog'
import chalk from 'chalk'
import chalkTable from 'chalk-table'
import readline from 'readline'

import database from './../database.json'
import Person from './person.js'

// console.log('database => ', database)

DraftLog(console).addLineListener(process.stdin)

const options = {
    leftPad: 2,
    columns: [
        { field: "id", name: chalk.cyan("ID") },
        { field: "vehicles", name: chalk.blue("Vehicles") },
        { field: "kmTraveled", name: chalk.gray("Km Traveled") },
        { field: "from", name: chalk.green("From") },
        { field: "to", name: chalk.yellow("To") },
    ]
}

const table = chalkTable(options, database.map(item => new Person(item).formatted('pt-br')))
const print = console.draft(table)


// A cada um segundo um novo registro é inserido na tabela e atualizado com o draftlog
// setInterval(() => {
//     database.push({id: Math.floor(Math.random() * 1000), vehicles: [ `Teste ${Date.now()}`]})
//     const table = chalkTable(options, database)
//     print(table)
// }, 1000)

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

terminal.question(`What's your name?\n`, msg => {
    console.log(`Hello ${msg.toString()}`)
})