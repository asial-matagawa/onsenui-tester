const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (input) => {
  {// Check if or not package exists
    const onsenuiPath = path.resolve(input.targetCacheDir, 'npm-package', 'onsenui', input.target.core);

    if (!fs.existsSync(onsenuiPath)) {
      throw new Error('`onsenui` package is not cached.');
    }

    const filePaths = [
      '.npmignore',
      'CHANGELOG.md',
      'LICENSE',
      'README.md',
      'bower.json',
      'css/onsenui.css',
      'css/onsen-css-components.css',
      'css/onsen-css-components-default.css',
      'css/ionicons',
      'css/font_awesome',
      'css/material-design-iconic-font',
      'js/onsenui.js',
      'js/onsenui.min.js',
      'js/onsenui.d.ts',
      'js/angular-onsenui.js',
      'js/angular-onsenui.min.js',
      'package.json',
      'stylus',
    ];
    for (const filePath of filePaths) {
      console.log(`${chalk.magenta(filePath)}: ${fs.existsSync(path.resolve(onsenuiPath, filePath)) ? chalk.green('exists') : chalk.red('does not exist')}`);
    }
  }
}
