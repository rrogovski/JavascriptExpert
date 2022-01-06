const { join } = require('path');

const utils = {
    getFullPath: (path) => {
        return join(__dirname, path)
    }
}

module.exports = utils