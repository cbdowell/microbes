'use strict';

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var babel = require('babel-core');
var micromatch = require('micromatch');
var chalk = require('chalk');
var stringLength = require('string-length');
var glob = require('glob');
var getPackages = require('./getPackages');
var Logger = require('microbe-logger');

process.title = 'microbes';

var log = Logger({
    name: process.title,
    outputMode: 'short',
    level: 'debug'
});

var OK = chalk.reset.inverse.bold.green(' DONE ');
var SRC_DIR = 'src';
var BUILD_DIR = 'build';
var JS_FILES_PATTERN = '**/*.js';
var IGNORE_PATTERN = '**/__{tests,mocks}__/**';
var PACKAGES_DIR = path.resolve(process.cwd(), 'packages');

var INLINE_REQUIRE_BLACKLIST = /packages\/expect|(jest-(circus|diff|get-type|jasmine2|matcher-utils|message-util|regex-util|snapshot))|pretty-format\//;

var transformOptions = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.babelrc'), 'utf8'));

transformOptions.babelrc = false;

var adjustToTerminalWidth = function adjustToTerminalWidth(str) {
    var columns = process.stdout.columns || 80;
    var WIDTH = columns - stringLength(OK) + 1;
    var strs = str.match(new RegExp('(.{1,' + WIDTH + '})', 'g'));
    var lastString = strs[strs.length - 1];
    if (lastString.length < WIDTH) {
        lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
    }
    return strs.slice(0, -1).concat(lastString).join('\n');
};

function getPackageName(file) {
    return path.relative(PACKAGES_DIR, file).split(path.sep)[0];
}

function getBuildPath(file, buildFolder) {
    var pkgName = getPackageName(file);
    var pkgSrcPath = path.resolve(PACKAGES_DIR, pkgName, SRC_DIR);
    var pkgBuildPath = path.resolve(PACKAGES_DIR, pkgName, buildFolder);
    var relativeToSrcPath = path.relative(pkgSrcPath, file);
    return path.resolve(pkgBuildPath, relativeToSrcPath);
}

function buildFile(file) {
    var destPath = getBuildPath(file, BUILD_DIR);
    mkdirp.sync(path.dirname(destPath));
    if (micromatch.isMatch(file, IGNORE_PATTERN)) {
        process.stdout.write(chalk.dim('  \u2022 ') + path.relative(PACKAGES_DIR, file) + ' (ignore)\n');
    } else if (!micromatch.isMatch(file, JS_FILES_PATTERN)) {
        fs.createReadStream(file).pipe(fs.createWriteStream(destPath));
        process.stdout.write(chalk.red('  \u2022 ') + path.relative(PACKAGES_DIR, file) + chalk.red(' \u21D2 ') + path.relative(PACKAGES_DIR, destPath) + ' (copy)' + '\n');
    } else {
        var options = Object.assign({}, transformOptions);
        options.plugins = options.plugins.slice();
        if (!INLINE_REQUIRE_BLACKLIST.test(file)) {
            options.plugins = options.plugins.filter(function (plugin) {
                return !(Array.isArray(plugin) && plugin[0] === 'transform-es2015-modules-commonjs');
            });
            options.plugins.push(['transform-inline-imports-commonjs', {
                allowTopLevelThis: true
            }]);
        }

        var transformed = babel.transformFileSync(file, options).code;

        fs.writeFileSync(destPath, transformed);

        process.stdout.write(chalk.green('  \u2022 ') + path.relative(PACKAGES_DIR, file) + chalk.green(' \u21D2 ') + path.relative(PACKAGES_DIR, destPath) + '\n');
    }
}

var buildPackage = function buildPackage(p) {
    log.info('Building Package: ', p);
    var srcDir = path.resolve(p, SRC_DIR);
    var pattern = path.resolve(srcDir, '**/*');
    var files = glob.sync(pattern, {
        nodir: true,
        ignore: [IGNORE_PATTERN]
    });
    process.stdout.write(adjustToTerminalWidth(path.basename(p) + '\n'));
    files.forEach(function (file) {
        return buildFile(file, true);
    });
    process.stdout.write(OK + '\n');
};

var buildPackages = function buildPackages() {
    var packages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getPackages();

    log.info('Building Packages...');
    if (packages.length) {
        packages.forEach(buildPackage);
    }
};

buildPackages();
