'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _files = require('./files');

var _files2 = _interopRequireDefault(_files);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

exports.default = {
    askGithubCredentials: () => {
        const questions = [{
            name: 'username',
            type: 'input',
            message: 'Enter your Github username or e-mail address:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your username or e-mail address.';
                }
            }
        }, {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password.';
                }
            }
        }];
        return _inquirer2.default.prompt(questions);
    },

    askRegeneratedToken: () => {
        const questions = [{
            name: 'token',
            type: 'input',
            message: 'Enter your new regenerated token:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your new regenerated token:.';
                }
            }
        }];
        return _inquirer2.default.prompt(questions);
    },

    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [{
            type: 'input',
            name: 'name',
            message: 'Enter a name for the repository:',
            default: argv._[0] || _files2.default.getCurrentDirectoryBase(),
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a name for the repository.';
                }
            }
        }, {
            type: 'input',
            name: 'description',
            default: argv._[1] || null,
            message: 'Optionally enter a description of the repository:'
        }, {
            type: 'list',
            name: 'visibility',
            message: 'Public or private:',
            choices: ['public', 'private'],
            default: 'public'
        }];
        return _inquirer2.default.prompt(questions);
    },

    askIgnoreFiles: filelist => {
        const questions = [{
            type: 'checkbox',
            name: 'ignore',
            message: 'Select the files and/or folders you wish to ignore:',
            choices: filelist,
            default: ['node_modules', 'bower_components']
        }];
        return _inquirer2.default.prompt(questions);
    }
};