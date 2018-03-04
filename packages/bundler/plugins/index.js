
const fs = require('fs')
const path = require('path')
const commonjs = require('rollup-plugin-commonjs')
const prettier = require('rollup-plugin-prettier')
const replace = require('rollup-plugin-replace')
const stripBanner = require('rollup-plugin-strip-banner')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')

function getBabelConfig() {
    return {
        exclude: 'node_modules/**',
        presets: [],
        plugins: []
    }
}

function getPlugins(externals) {
    return [
        json(),
        resolve({
            skip: externals
        })
        stripBanner({
            exclude: 'node_modules/**/*'
        }),
        babel(getBabelConfig()),
        commonjs(),
        globals(),
        builtins(),
        resolve()
    ]
}

function getPlugin(name) {}

module.exports = {
    getPlugins,
    getPlugin
}
