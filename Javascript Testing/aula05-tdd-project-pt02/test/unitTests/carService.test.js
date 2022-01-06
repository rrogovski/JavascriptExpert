const assert = require('assert');
const { describe, it, before, after } = require('mocha');
const { join } = require('path');
const { expect } = require('chai');
const sinon = require('sinon');

const CarService = require('./../../src/service/carService');

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
})