#!/usr/bin/env node

/*
 * raspianer
 * https://github.com/chrisenytc/raspianer
 *
 * Copyright (c) 2015, Christopher EnyTC
 * Licensed under the MIT license.
 */

/**
 * Module dependencies.
 */

var program = require('commander'),
    updateNotifier = require('update-notifier'),
    _ = require('underscore'),
    banner = require('../lib/banner.js'),
    Installer = require('..'),
    installer = new Installer(),
    path = require('path'),
    debug = require('../lib/debugger.js'),
    pkg = require('../package.json');

require('colors');

/*
 * Api Bootstrap
 */

program
    .version(pkg.version, '-v, --version')
    .usage('command [option]'.white);

/*
 * Install operation system
 */

program
    .command('install')
    .description('Install a image on a raspberry pi'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'diskId',
            message: 'What\'s disk you want to use?'
        }, {
            type: 'input',
            name: 'imagePath',
            message: 'Enter the path of the raspbian image?'
        }, {
            type: 'confirm',
            name: 'continue',
            message: 'You really want to continue? All data will be lost!'
        }];
        //Ask
        installer.prompt(prompts, function(answers) {
			if(answers.continue) {
				installer.install(answers.diskId, answers.imagePath)
				.then(function() {
					debug('Image installed successfully!', 'success');
				})
				.catch(function(err) {
					throw err;
				});
			} else {
				process.exit(1);
			}      
		});
    });

/*
 * Installer on help option show examples
 */

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ raspianer install');
    console.log('');
});

/*
 * Api Banner
 */

if (process.argv.length === 3 && process.argv[2] === '--help') {
    banner();
}

if (process.argv.length === 4 && process.argv[3] !== '--json') {
    banner();
} else {
    if (process.argv.length === 3 && process.argv[2] !== '--help') {
        banner();
    }
}

/*
 * Api Process Parser
 */

program.parse(process.argv);

/*
 * Api Default Action
 */

var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
});

if (notifier.update) {
    notifier.notify(true);
}

if (process.argv.length == 2) {
    banner();
    program.help();
}
