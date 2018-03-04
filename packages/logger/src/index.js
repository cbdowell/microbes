
const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')
const formatOut = bunyanFormat({ outputMode: 'short' })

export default (bunyan.createLogger({ name: 'microbes', stream: formatOut, level: 'debug' } ))
