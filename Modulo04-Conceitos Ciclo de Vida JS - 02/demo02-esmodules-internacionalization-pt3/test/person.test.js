import mocha from 'mocha'
const { describe, it } = mocha
import chai from 'chai'
const { expect } = chai
import Person from './../src/person.js'

describe('Person Suite Tests', () => {
    it('Should return a person instance from a string', () => {
        const person = Person.generateInstanceFromString('2 Carro,Moto,Bike 20000 2001-10-10 2021-01-01')

        const expected = {
            id: '2',
            vehicles: ['Carro','Moto','Bike'],
            kmTraveled: '20000',
            from: '2001-10-10',
            to: '2021-01-01'
        }

        expect(person).to.be.deep.equal(expected)
    })

    it('Should format values', () => {
        const person = new Person({
            id: '2',
            vehicles: ['Carro','Moto','Bike'],
            kmTraveled: '20000',
            from: '2001-10-10',
            to: '2021-01-01'
        })

        const result = person.formatted('pt-br')
        console.log('Result => ', result)

        const expected = {
            id: 2,
            vehicles: 'Carro, Moto e Bike',
            kmTraveled: '20.000 km',
            from: '10 de outubro de 2001',
            to: '01 de janeiro de 2021'
        }

        expect(result).to.be.deep.equal(expected)
    })
})