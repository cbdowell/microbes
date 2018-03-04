const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

const babel = require('babel-core')
const micromatch = require('micromatch')
const chalk = require('chalk')
const stringLength = require('string-length')
const glob = require('glob')
const getPackages = require('./getPackages')
const Logger = require('microbe-logger')

process.title = 'microbes'

const log = Logger({
    name: process.title,
    outputMode: 'short',
    level: 'debug'
})

const OK = chalk.reset.inverse.bold.green(' DONE ')
const SRC_DIR = 'src'
const BUILD_DIR = 'build'
const JS_FILES_PATTERN = '**/*.js'
const IGNORE_PATTERN = '**/__{tests,mocks}__/**'
const PACKAGES_DIR = path.resolve(process.cwd(), 'packages')

const INLINE_REQUIRE_BLACKLIST = /packages\/expect|(jest-(circus|diff|get-type|jasmine2|matcher-utils|message-util|regex-util|snapshot))|pretty-format\//

const transformOptions = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), '.babelrc'), 'utf8')
)

transformOptions.babelrc = false

const adjustToTerminalWidth = str => {
    const columns = process.stdout.columns || 80
    const WIDTH = columns - stringLength(OK) + 1
    const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g'))
    let lastString = strs[strs.length - 1]
    if (lastString.length < WIDTH) {
        lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'))
    }
    return strs
        .slice(0, -1)
        .concat(lastString)
        .join('\n')
}

function getPackageName(file) {
    return path.relative(PACKAGES_DIR, file).split(path.sep)[0]
}

function getBuildPath(file, buildFolder) {
    const pkgName = getPackageName(file)
    const pkgSrcPath = path.resolve(PACKAGES_DIR, pkgName, SRC_DIR)
    const pkgBuildPath = path.resolve(PACKAGES_DIR, pkgName, buildFolder)
    const relativeToSrcPath = path.relative(pkgSrcPath, file)
    return path.resolve(pkgBuildPath, relativeToSrcPath)
}

function buildFile(file) {
    const destPath = getBuildPath(file, BUILD_DIR)
    mkdirp.sync(path.dirname(destPath))
    if (micromatch.isMatch(file, IGNORE_PATTERN)) {
        process.stdout.write(
            chalk.dim('  \u2022 ') +
                path.relative(PACKAGES_DIR, file) +
                ' (ignore)\n'
        )
    } else if (!micromatch.isMatch(file, JS_FILES_PATTERN)) {
        fs.createReadStream(file).pipe(fs.createWriteStream(destPath))
        process.stdout.write(
            chalk.red('  \u2022 ') +
                path.relative(PACKAGES_DIR, file) +
                chalk.red(' \u21D2 ') +
                path.relative(PACKAGES_DIR, destPath) +
                ' (copy)' +
                '\n'
        )
    } else {
        const options = Object.assign({}, transformOptions)
        options.plugins = options.plugins.slice()
        if (!INLINE_REQUIRE_BLACKLIST.test(file)) {
            options.plugins = options.plugins.filter(
                plugin =>
                    !(
                        Array.isArray(plugin) &&
                        plugin[0] === 'transform-es2015-modules-commonjs'
                    )
            )
            options.plugins.push([
                'transform-inline-imports-commonjs',
                {
                    allowTopLevelThis: true
                }
            ])
        }

        const transformed = babel.transformFileSync(file, options).code

        fs.writeFileSync(destPath, transformed)

        process.stdout.write(
            chalk.green('  \u2022 ') +
                path.relative(PACKAGES_DIR, file) +
                chalk.green(' \u21D2 ') +
                path.relative(PACKAGES_DIR, destPath) +
                '\n'
        )
    }
}

const buildPackage = p => {
    log.info('Building Package: ', p)
    const srcDir = path.resolve(p, SRC_DIR)
    const pattern = path.resolve(srcDir, '**/*')
    const files = glob.sync(pattern, {
        nodir: true,
        ignore: [IGNORE_PATTERN]
    })
    process.stdout.write(adjustToTerminalWidth(`${path.basename(p)}\n`))
    files.forEach(file => buildFile(file, true))
    process.stdout.write(`${OK}\n`)
}

const buildPackages = (packages = getPackages()) => {
    log.info('Building Packages...')
    if (packages.length) {
        packages.forEach(buildPackage)
    }
}

buildPackages()
