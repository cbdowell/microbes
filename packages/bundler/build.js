
const globby = require('globby')

async function start() {
    process.chdir('../../')
    console.log('cwd: ', process.cwd())
    const paths = await globby('packages/*/package.json', {gitignore: true, onlyFiles: true})
    console.log(paths)
}

start()
