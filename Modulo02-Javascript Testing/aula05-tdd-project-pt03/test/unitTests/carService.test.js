const { describe, it, before, after } = require('mocha');
const { join } = require('path');
const { expect } = require('chai');
const sinon = require('sinon');

const CarService = require('./../../src/service/carService');
const Transaction = require('./../../src/entities/transaction');

const carsDatabase = join(__dirname, '../../database/cars.json');

const mocks = {
    validCarCategory: require('./../mocks/valid-carCategory.json'),
    validCar: require('./../mocks/valid-car.json'),
    validCustomer: require('./../mocks/valid-customer.json')
}

describe('carService Suite Tests', () => {
    let carService = {};
    before(() => {
        carService = new CarService({
            cars: carsDatabase
        })
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore();
    })

    it('Should retrieve a random position from an array', () => {
        const data = [0, 1, 2, 3, 4];
        const result = carService.getRandomPositionFromArray(data);

        expect(result).to.be.lte(data.length).and.be.gte(0);
    })

    it('Should choose the first id from carIds in carCategory', () => {
        const carCategory = mocks.validCarCategory;
        const carIndex = 0;

        sandbox.stub(
            carService,
            carService.getRandomPositionFromArray.name
        ).returns(carIndex);

        const result = carService.chooseRandomCar(carCategory);
        const expected = carCategory.carIds[carIndex];


        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
        expect(result).to.be.equal(expected);
    })
    
    it('Given a carCategory it should return an available car', async () => {
        const car = mocks.validCar;

        // Cria uma nova instância para não alterar o objeto pai
        const carCategory = Object.create(mocks.validCarCategory);
        carCategory.carIds = [car.id];

        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).resolves(car);

        sandbox.spy(
            carService,
            carService.chooseRandomCar.name,
        );

        const result = await carService.getAvailableCar(carCategory);
        const expected = car;


        expect(carService.chooseRandomCar.calledOnce).to.be.ok;
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
        expect(result).to.be.deep.equal(expected);
    })

    it('Given a carCategory, customer and numberOfDays it should calculate final amount in real', async() => {
        const customer = Object.create(mocks.validCustomer);
        customer.age = 50;

        const carCategory = Object.create(mocks.validCarCategory);
        carCategory.price = 37.6;

        const numberOfDays = 5;

        // Para não depender de dados externos
        // Quando for feito um get nessa propriedade da classe
        // Daremos o retorno especificado no '.get'
        sandbox.stub(
            carService,
            "taxesBasedOnAge" // Para propriedades não temo o '.name'
        ).get(() => [{from: 40, to: 50, then: 1.3 }])

        const expected = carService.currencyFormat.format(244.40);
        const result = carService.calculateFinalPrice(
            customer,
            carCategory,
            numberOfDays
        );

        expect(result).to.be.deep.equal(expected);
    })

    it('NO useFakeTimers - Given a customer and a car category it should return a transaction receipt', async() => {
        const car = mocks.validCar;
        const carCategory = { ...mocks.validCarCategory, price: 37.6, carIds: [car.id] };

        const customer = Object.create(mocks.validCustomer);
        customer.age = 20;

        const numberOfDays = 5;
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + numberOfDays);

        // const now = new Date(2020, 10, 5);
        // sandbox.useFakeTimers(now.getTime());
        
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }

        console.log('today', today.toLocaleDateString('pt-br', options));
        console.log('dueDate', dueDate.toLocaleDateString('pt-br', options));
        // console.log('now 1', new Date());
        // console.log('now 2', new Date());

        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).resolves(car);

        const expectedAmount = carService.currencyFormat.format(206.80);
        const result = await carService.rent(customer, carCategory, numberOfDays);

        const expected = new Transaction({
            customer,
            car,
            amount: expectedAmount,
            dueDate: dueDate.toLocaleDateString('pt-br', options)
        })

        expect(result).to.be.deep.equal(expected);
    })

    it('WITH useFakeTimers - Given a customer and a car category it should return a transaction receipt', async() => {
        const car = mocks.validCar;
        const carCategory = { ...mocks.validCarCategory, price: 37.6, carIds: [car.id] };

        const customer = Object.create(mocks.validCustomer);
        customer.age = 20;

        const numberOfDays = 5;
        const dueDate = "10 de novembro de 2020";

        const now = new Date(2020, 10, 5);
        sandbox.useFakeTimers(now.getTime());

        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).resolves(car);

        const expectedAmount = carService.currencyFormat.format(206.80);
        const result = await carService.rent(customer, carCategory, numberOfDays);

        const expected = new Transaction({
            customer,
            car,
            amount: expectedAmount,
            dueDate
        })

        // console.log('result', result);
        // console.log('expected', expected);

        expect(result).to.be.deep.equal(expected);
    })
})