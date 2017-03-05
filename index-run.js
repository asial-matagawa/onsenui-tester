const path = require('path');
const program = require('commander');

program
  .option('-T, --target')
  .option('-t, --tester')
  .option('-c, --testcase');

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
    path.resolve(__dirname, './tester/direct-use', './index.js'),
  ];
};

const resolveTestcase = (testcaseString) => {
  return [
    path.resolve(__dirname, './tester/direct-use/testcase/case1'),
  ];
};

const createTesterArguments = (target, testcase) => {
  return {
    'target': JSON.stringify(target),
    'testcase': JSON.stringify(testcase),
  };
};

const [targets, testers, testcases] = [
  resolveTarget(program.target),
  resolveTester(program.tester),
  resolveTestcase(program.testcase),
];

for (const target of targets) {
  for (const tester of testers) {
    for (const testcase of testcases) {
      console.log(tester);
      console.log(createTesterArguments(target, testcase));

      // Spawn tester
    }
  }
}