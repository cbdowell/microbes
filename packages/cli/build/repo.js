'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _clui = require('clui');

var _clui2 = _interopRequireDefault(_clui);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _prompts = require('./prompts');

var _prompts2 = _interopRequireDefault(_prompts);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const Spinner = _clui2.default.Spinner;

exports.default = {
    createRemoteRepo: async () => {
        const github = _github2.default.getInstance();
        const answers = await _prompts2.default.askRepoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: answers.visibility === 'private'
        };

        const status = new Spinner('Creating remote repository...');

        status.start();

        try {
            const response = await github.repos.create(data);
            return response.data.clone_url;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    createGitignore: async () => {
        const filelist = _lodash2.default.without(_fs2.default.readdirSync('.'), '.git', '.gitignore');

        if (filelist.length) {
            const answers = await _prompts2.default.askIgnoreFiles(filelist);
            if (answers.ignore.length) {
                _fs2.default.writeFileSync('.gitignore', answers.ignore.join('\n'));
            } else {
                (0, _touch2.default)('.gitignore');
            }
        } else {
            (0, _touch2.default)('.gitignore');
        }
    },

    setupRepo: async url => {

        const status = new Spinner('Initializing local repository and pushing to remote...');

        status.start();

        try {
            require('simple-git')().init().add('.gitignore').add('./*').commit('Initial commit').addRemote('origin', url).push('origin', 'master');
            return true;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }
};