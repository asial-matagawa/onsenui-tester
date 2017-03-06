const path = require('path');
const process = require('process');
const program = require('commander');

program
  .option('-T, --target')
  .option('-t, --tester')
  .option('-c, --testcase')
  .option('-o, --outDir <path>', 'set output directory. defaults to current directory',
    val => path.resolve(val), // coerce
    path.resolve(process.cwd()) // default value
  );

program.parse(process.argv);

const resolveTarget = (targetString) => {
  return [
    {
      'css-components': '2.1.0',
      'core': '2.1.0',
    }
  ];
};

const resolveTester = (testerString) => {
  return [
    path.resolve(__dirname, './preset-tester/direct-use', './index.js'),
  ];
};

const resolveTestcase = (testcaseString) => {
  return [
    path.resolve(__dirname, './preset-tester/direct-use/preset-testcase/case1'),
  ];
};

const createTesterInput = (target, testcase, outDir) => {
  return {
    target: target,
    testcase: testcase,
    outDir: outDir,
  };
};

const launchTester = (tester, input) => {
  require(tester)(input);
}

// Resolve arguments
const [targets, testers, testcases] = [
  resolveTarget(program.target),
  resolveTester(program.tester),
  resolveTestcase(program.testcase),
];

for (const target of targets) {
  for (const tester of testers) {
    for (const testcase of testcases) {
      launchTester(tester, createTesterInput(target, testcase, program.outDir));
    }
  }
}
