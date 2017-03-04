const core = require('./subcommands/core.js');

const args = process.argv.slice(2);

switch (args[0]) {
  case 'core':
    core();
}
