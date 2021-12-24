const { readFile } = require('fs/promises');
const { getFullPath } = require('./utils');
const { error } = require('./constants');
const User = require('./user');

const DEFAULT_OPTION = {
    maxLines: 3,
    fields: ['id','name','profession','age']
}

class File {
    static async csvToJson(filePath) {
        const content = await File.getFileContent(filePath);
        const validation = File.isValid(content);

        if(!validation.valid) throw new Error(validation.error)

        // console.log(`content ${filePath}`, content);

        const users = File.parseCSVToJSON(content);

        // console.log('users', users);

        return users;
    }

    static async getFileContent(filePath) {
        // const fileName =  join(__dirname, filePath);
        // const fileName =  getFullPath(filePath);

        // return (await readFile(fileName)).toString('utf-8');
        return (await readFile(filePath)).toString('utf-8');
    }

    static isValid(csvString, options = DEFAULT_OPTION) {
        const [ header, ...fileWithoutHeader ] = csvString.split('\n');
        const isHeaderValid = header === options.fields.join(',');

        if(!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }
        
        const isContentLengthAccepted = (
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.maxLines
        )

        if(!isContentLengthAccepted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true }
    }

    static parseCSVToJSON(csvString) {
        const lines = csvString.split('\n');

        // Remove o primeiro item e armazena na variável
        const firstLine = lines.shift();
        const header = firstLine.split(',');
        return lines.map(line => {
            const columns = line.split(',');
            let user = {};
            for (const index in columns) {
                user[header[index]] = columns[index];
                // console.log('index', index);
            }

            return new User(user);
        });
    }
}

// (async () => {
//     const result = await File.csvToJson('./../mocks/threeItems-valid.csv');
//     // const result = await File.csvToJson('./../mocks/invalid-header.csv');
//     // const result = await File.csvToJson('./../mocks/fourItems-invalid.csv');

//     console.log('result', result);
// })();

module.exports = File