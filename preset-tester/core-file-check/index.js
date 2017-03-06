const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (input) => {
  {// Check if or not package exists
    const onsenuiPath = path.resolve(input.targetCacheDir, 'npm-package', 'onsenui', input.target.core);

    if (!fs.existsSync(onsenuiPath)) {
      throw new Error('`onsenui` package is not cached.');
    }

    for (const filePath of ['js/onsenui.js', 'js/angular-onsenui.js']) {
      console.log(`${chalk.magenta(filePath)}: ${fs.existsSync(path.resolve(onsenuiPath, filePath)) ? chalk.green('exists') : chalk.red('does not exist')}`);
    }
  }
}
