#!/usr/bin/env node
'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _clear = require('clear');

var _clear2 = _interopRequireDefault(_clear);

var _figlet = require('figlet');

var _figlet2 = _interopRequireDefault(_figlet);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

var _files = require('./files');

var _files2 = _interopRequireDefault(_files);

var _repo = require('./repo');

var _repo2 = _interopRequireDefault(_repo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import constants from 'microbe-constants'
// import log from 'microbe-logger'
// import config from 'microbe-config'
// import pkg from '../package.json'

/**
 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

(0, _clear2.default)();

console.log(_chalk2.default.yellow(_figlet2.default.textSync('Microbes', { horizontalLayout: 'full' })));

if (_files2.default.directoryExists('.git')) {
    console.log(_chalk2.default.red('Already a git repository!'));
    process.exit();
}

const getGithubToken = async () => {
    // Fetch token from config store
    let token = _github2.default.getStoredGithubToken();

    if (token) {
        return token;
    }

    // No token found, use credentials to access GitHub account
    await _github2.default.setGithubCredentials();

    // Check if access token for ginit was registered
    const accessToken = await _github2.default.hasAccessToken();

    if (accessToken) {
        console.log(_chalk2.default.yellow('An existing access token has been found!'));
        // ask user to regenerate a new token
        token = await _github2.default.regenerateNewToken(accessToken.id);
        return token;
    }

    // No access token found, register one now
    token = await _github2.default.registerNewToken();

    return token;
};

const run = async () => {
    try {
        // Retrieve & Set Authentication Token
        const token = await getGithubToken();

        _github2.default.githubAuth(token);

        // Create remote repository
        const url = await _repo2.default.createRemoteRepo();

        // Create .gitignore file
        await _repo2.default.createGitignore();

        // Set up local repository and push to remote
        const done = await _repo2.default.setupRepo(url);

        if (done) {
            console.log(_chalk2.default.green('All done!'));
        }
    } catch (err) {
        if (err) {
            switch (err.code) {
                case 401:
                    console.log(_chalk2.default.red("Couldn't log you in. Please provide correct credentials/token."));
                    break;
                case 422:
                    console.log(_chalk2.default.red('There already exists a remote repository with the same name'));
                    break;
                default:
                    console.log(err);
            }
        }
    }
};

run();