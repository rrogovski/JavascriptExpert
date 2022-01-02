const faker = require('faker');
const { join } = require('path');
const { writeFile } = require('fs/promises');

const Car = require('../src/entities/car');
const CarCategory = require('../src/entities/carCategory');
const Custumer = require('../src/entities/customer');
const Customer = require('../src/entities/customer');

const seederBaseFolder = join(__dirname, "../", "database");
const ITEMS_AMOUT = 2;

const carCategory = new CarCategory({
    id: faker.datatype.uuid(),
    name: faker.vehicle.type(),
    carIds: [],
    price: faker.finance.amount(20, 100)
});

const cars = [];
const customers = [];

for (let index = 0; index <= ITEMS_AMOUT; index++) {
    const car = new Car({
        id: faker.datatype.uuid(),
        name: faker.vehicle.model(),
        available: true,
        gasAvailable: true,
        releaseYear: faker.date.past().getFullYear()
    })

    carCategory.carIds.push(car.id);
    cars.push(car);

    const customer = new Customer({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        age: faker.datatype.number(18, 50),
    })

    customers.push(customer);
}

const write = (fileName, data) => writeFile(join(seederBaseFolder, fileName), JSON.stringify(data));

(async () => {
    await write('cars.json', cars);
    await write('categories.json', [carCategory]);

    console.log('cars', cars);
    console.log('categories', carCategory);
    console.log('customers', customers);
})()