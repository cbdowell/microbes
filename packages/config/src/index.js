
import constants from 'microbe-constants'
import pkg from '../package.json'

require('dotenv').config()

const defaults = {
    PORT: 4000,
    HOST: 'localhost'
}

export default Object.assign(constants, defaults, pkg, {
    PORT: process.env.PORT,
    HOST: process.env.HOST
})
