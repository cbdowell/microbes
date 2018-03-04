/**
 * Copyright (c) 2017-present, Dynaware, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const fs = require('fs')
const path = require('path')
const { rollup } = require('rollup')
const bundles = require('./bundles')
const packages = require('./packages')
const plugins = require('./plugins')

let loggedErrors = new Set()

process.on('unhandledRejection', err => {
    if (loggedErrors.has(err)) {
        process.exit(1)
    }
    throw err
})

async function buildBundle(bundleConfig) {

    const inputOptions = {
        input: `./packages/${bundleConfig}/src/index.js`,
        plugins: getPlugins()
    }

    const outputOptions = {
        file: `./packages/${bundleConfig}/build/index.js`,
        format: 'cjs'
    }

    const bundle = await rollup(inputOptions)

    await bundle.write(outputOptions)

}

async function build() {
    for(const bundle of bundles) {
        await buildBundle(bundle)
    }
}

build()
