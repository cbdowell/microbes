/**
 * Copyright (c) 2017-present, Dynaware, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

export default {
    PREFIX_MSG : chalk.green('[MICROBES] '),
    SUCCESS_EXIT : 0,
    ERROR_EXIT : 1,
    PACKAGE_DIR: path.resolve('../../', 'packages')
}
