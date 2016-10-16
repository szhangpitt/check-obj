'use strict';
var get = require('lodash.get')
var set = require('lodash.set')
var debug = require('debug')('check-obj:path-def')

const fn = function walkPathDefs (pathDefs) {

    return function (body) {
        let $allValid = true;

        let $result = { $valid: true };

        $result =
        pathDefs.reduce(function ($report, pathDef) {
            const path   = pathDef.path;
            const fn     = pathDef.fn;
            const val    = get(body, path);
            const $valid = !!fn(val, body, $report);
            const $r     = { $valid };

            $result.$valid = $result.$valid && $valid;
            debug('checking', path, $valid)
            set($report, path, $r);
            return $report;
        }, $result);

        return $result;
    }
}


module.exports = fn
