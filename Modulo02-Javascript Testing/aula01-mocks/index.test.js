const { rejects, deepStrictEqual } = require('assert');
const { error } = require('./src/constants');
const File = require('./src/file');
const { getFullPath } = require('./src/utils');

(async () => {
    {
        const filePath = './mocks/emptyFile-invalid.csv';
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath);
        // console.log('result emptyFile-invalid.csv', result);
        await rejects(result, rejection)
    }
    {
        const filePath = './mocks/fourItems-invalid.csv';
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath);
        // console.log('result fourItems-invalid.csv', result);
        await rejects(result, rejection)
    }
    {
        const filePath = './mocks/threeItems-valid.csv';
        const result = await  File.csvToJson(filePath);
        // console.log('result threeItems-valid.csv', result);
        const expected = [
            {
                "id": 123,
                "name": "Erick Wendel",
                "profession": "Javascript Instructor",
                "age": 25,
                "birthDay": new Date().getFullYear() - 25
            },
            {
                "id": 321,
                "name": "Xuxa da Silva",
                "profession": "Javascript Specialist",
                "age": 80,
                "birthDay": new Date().getFullYear() - 80
            },
            {
                "id": 231,
                "name": "Joaozinho",
                "profession": "Java Developer",
                "age": 30,
                "birthDay": new Date().getFullYear() - 30
            }
        ];

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
    }
})()