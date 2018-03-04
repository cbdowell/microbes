
function getBundles() {
    return [
        {
            label: 'constants',
            entry: 'microbe-constants'
            externals: []
        }
    ]
}

function getBundle(name) {}

module.exports = {
    getBundles,
    getBundle
}
