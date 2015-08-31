/*
 * raspianer
 * https://github.com/chrisenytc/raspianer
 *
 * Copyright (c) 2015, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var Installer = require('../lib/raspianer.js');
var installer = new Installer();

describe('Raspianer module', function() {
    describe('#constructor()', function() {
        it('should be a function', function() {
            Installer.should.be.a("function");
        });
    });
    describe('#instance()', function() {
        it('should be a object', function() {
            installer.should.be.a("object");
        });
    });
});

