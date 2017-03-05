const program = require('commander');
const run = require('./subcommands/run.js')(program);

program
  .version(require('./package.json').version);

program
  .command('run')
  .option('-T, --target')
  .option('-t, --tester')
  .option('-c, --testcase')
  .action(run);

program.parse(process.argv);
