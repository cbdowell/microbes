/**
 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import octokit from '@octokit/rest'
import Configstore from 'configstore'
import utils from 'lodash'
import clui from 'clui'
import chalk from 'chalk'
import prompts from './prompts'
import pkg from '../package.json'

const conf = new Configstore(pkg.name)
const Spinner = clui.Spinner
const api = octokit()

export default {
    getInstance: () => {
        return api
    },

    setGithubCredentials: async () => {
        const credentials = await prompts.askGithubCredentials()
        api.authenticate(
            utils.extend(
                {
                    type: 'basic'
                },
                credentials
            )
        )
    },

    registerNewToken: async () => {
        const status = new Spinner('Authenticating you, please wait...')
        status.start()

        try {
            const response = await api.authorization.create({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginits, the command-line tool for initalizing Git repos'
            })
            const token = response.data.token
            if (token) {
                conf.set('github.token', token)
                return token
            } else {
                throw new Error(
                    'Missing Token',
                    'Github token was not found in the response'
                )
            }
        } catch (err) {
            throw err
        } finally {
            status.stop()
        }
    },

    githubAuth: token => {
        api.authenticate({
            type: 'oauth',
            token: token
        })
    },

    getStoredGithubToken: () => {
        return conf.get('github.token')
    },

    hasAccessToken: async () => {
        const status = new Spinner('Authenticating you, please wait...')

        status.start()

        try {
            const response = await api.authorization.getAll()
            const accessToken = utils.find(response.data, row => {
                if (row.note) {
                    return row.note.indexOf('ginit') !== -1
                }
            })
            return accessToken
        } catch (err) {
            throw err
        } finally {
            status.stop()
        }
    },

    regenerateNewToken: async id => {
        const tokenUrl = 'https://github.com/settings/tokens/' + id
        console.log(
            'Please visit ' +
                chalk.underline.blue.bold(tokenUrl) +
                ' and click the ' +
                chalk.red.bold('Regenerate Token Button.\n')
        )
        const input = await prompts.askRegeneratedToken()
        if (input) {
            conf.set('github.token', input.token)
            return input.token
        }
    }
}
