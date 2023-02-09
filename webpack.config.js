const path = require('path')

module.exports = {
    entry: {
        scanCats: path.resolve(__dirname, './src/sd_scanCats-dev.js'),
        scanGoods: path.resolve(__dirname, './src/sd_scanGoods-dev.js'),
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    // mode: 'development'
    mode: 'production'
}