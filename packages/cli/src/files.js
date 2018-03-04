/**
 * Copyright (c) 2017-present, Dynaware, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fs from 'fs'
import path from 'path'

export default {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd())
    },
    directoryExists: (filePath) => {
        try {
            return fs.statSync(filePath).isDirectory()
        } catch (err) {
            return false
        }
    }
}
