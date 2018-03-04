'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  PREFIX_MSG: _chalk2.default.green('[MICROBES] '),
  ERROR_EXIT: 1,
  PACKAGE_DIR: _path2.default.resolve('../../', 'packages')
}; /**
    * Copyright (c) 2017-present, Dynaware, Inc.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    *
    */