const program = require('commander');

program
  .version(require('./package.json').version);

program.parse(process.argv);
