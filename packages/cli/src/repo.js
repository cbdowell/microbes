/**
 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import utils from 'lodash'
import fs from 'fs'
import clui from 'clui'
import touch from 'touch'

import prompts from './prompts'
import Github from './github'

const Spinner = clui.Spinner

export default {
    createRemoteRepo: async () => {
        const github = Github.getInstance()
        const answers = await prompts.askRepoDetails()

        const data = {
            name: answers.name,
            description: answers.description,
            private: answers.visibility === 'private'
        }

        const status = new Spinner('Creating remote repository...')

        status.start()

        try {
            const response = await github.repos.create(data)
            return response.data.clone_url
        } catch (err) {
            throw err
        } finally {
            status.stop()
        }
    },

    createGitignore: async () => {
        const filelist = utils.without(fs.readdirSync('.'), '.git', '.gitignore')

        if (filelist.length) {
            const answers = await prompts.askIgnoreFiles(filelist)
            if (answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'))
            } else {
                touch('.gitignore')
            }
        } else {
            touch('.gitignore')
        }
    },

    setupRepo: async url => {

        const status = new Spinner(
            'Initializing local repository and pushing to remote...'
        )

        status.start()

        try {
            require('simple-git')()
                .init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial commit')
                .addRemote('origin', url)
                .push('origin', 'master')
            return true
        } catch (err) {
            throw err
        } finally {
            status.stop()
        }
    }
}
