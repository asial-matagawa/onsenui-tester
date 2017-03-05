const program = require('commander');

program
  .version(require('./package.json').version)
  .command('run', 'run test');

program.parse(process.argv);
