const path = require('path');

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

module.exports = (program) => {
  return (env, options) => {
    const targets = resolveTarget(program.target);
    const testers = resolveTester(program.tester);
    const testcases = resolveTestcase(program.testcase);

    for (const target of targets) {
      for (const tester of testers) {
        for (const testcase of testcases) {
          console.log(tester);
          console.log(createTesterArguments(target, testcase));

          // Spawn tester
        }
      }
    }
  };
};
