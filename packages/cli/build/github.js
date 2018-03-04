'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rest = require('@octokit/rest');

var _rest2 = _interopRequireDefault(_rest);

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _clui = require('clui');

var _clui2 = _interopRequireDefault(_clui);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _prompts = require('./prompts');

var _prompts2 = _interopRequireDefault(_prompts);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const conf = new _configstore2.default(_package2.default.name); /**
                                                                 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
                                                                 *
                                                                 * This source code is licensed under the MIT license found in the
                                                                 * LICENSE file in the root directory of this source tree.
                                                                 *
                                                                 */

const Spinner = _clui2.default.Spinner;
const api = (0, _rest2.default)();

exports.default = {
    getInstance: () => {
        return api;
    },

    setGithubCredentials: async () => {
        const credentials = await _prompts2.default.askGithubCredentials();
        api.authenticate(_lodash2.default.extend({
            type: 'basic'
        }, credentials));
    },

    registerNewToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');
        status.start();

        try {
            const response = await api.authorization.create({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginits, the command-line tool for initalizing Git repos'
            });
            const token = response.data.token;
            if (token) {
                conf.set('github.token', token);
                return token;
            } else {
                throw new Error('Missing Token', 'Github token was not found in the response');
            }
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    githubAuth: token => {
        api.authenticate({
            type: 'oauth',
            token: token
        });
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    hasAccessToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');

        status.start();

        try {
            const response = await api.authorization.getAll();
            const accessToken = _lodash2.default.find(response.data, row => {
                if (row.note) {
                    return row.note.indexOf('ginit') !== -1;
                }
            });
            return accessToken;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    regenerateNewToken: async id => {
        const tokenUrl = 'https://github.com/settings/tokens/' + id;
        console.log('Please visit ' + _chalk2.default.underline.blue.bold(tokenUrl) + ' and click the ' + _chalk2.default.red.bold('Regenerate Token Button.\n'));
        const input = await _prompts2.default.askRegeneratedToken();
        if (input) {
            conf.set('github.token', input.token);
            return input.token;
        }
    }
};