/*
 * raspianer
 * https://github.com/chrisenytc/raspianer
 *
 * Copyright (c) 2015, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module Dependencies
 */

var inquirer = require('inquirer');
var bash = require('shelljs');
var Promisse = require('bluebird');
var debug = require('./debugger.js');
var async = require('async');

/*
 * Public Methods
 */

/**
 * @class Raspianer
 *
 * @constructor
 *
 * Constructor responsible for provide installation service
 *
 * @example
 *
 *     var installer = new installer();
 */

var Installer = module.exports = function Installer() {
};

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, cb);
 *
 * @method prompt
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Installer.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function(answers) {
        cb(answers);
    });
};

/**
 * Method responsible for build raspberry images
 *
 * @example
 *
 *     api.install('sdDiskId', 'imagePath');
 *
 * @method install
 * @public
 * @param {String} sdDiskId SD Disk identification
 * @param {String} imagePath Raspberry image path
 */

Installer.prototype.install = function install(diskId, imagePath) {
	return new Promisse(function(resolve, reject) {
		async.series({
			unmount: function(callback){
				debug('Umounting SDK DISK ' + diskId, 'info');
				bash.exec('diskutil unmountdisk ' + diskId, function(code, output) {
					debug('Umounted SD DISK' + diskId, 'success');
					callback();
				});
			},
			format: function(callback){
				debug('Formating SD DISK ' + diskId, 'info');
				bash.exec('sudo dd if=' + imagePath + ' of=' + diskId +' bs=2m', function(code, output) {
					debug('Formated SD DISK' + diskId + 'successfully!', 'success');
					callback();
				});			
			},
			complete: function(callback){
				debug('Umounting SDK DISK ' + diskId, 'info');
				bash.exec('diskutil unmountdisk ' + diskId, function(code, output) {
					debug('Umounted SD DISK' + diskId, 'success');
					callback();
				});
			}
		},
		function(err, results) {
			if(err) {
				reject(err);
			}

			if(results.unmount && results.format && results.complete) {
				debug('Raspbian installed successfully!', 'success');
				resolve();
			}
		});
	});
};

