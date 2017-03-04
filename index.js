const program = require('commander');
const core = require('./subcommands/core.js');

program
  .version(require('./package.json').version)

program
  .command('core')
  .action(core);

program.parse(process.argv);
