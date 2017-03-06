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
      'css-components': '2.0.2',
      'core': '2.0.2',
    },
    {
      'css-components': '2.0.3',
      'core': '2.0.3',
    },
    {
      'css-components': '2.0.4',
      'core': '2.0.4',
    },
    {
      'css-components': '2.0.5',
      'core': '2.0.5',
    },
    {
      'css-components': '2.1.0',
      'core': '2.1.0',
    },
  ];
};

const resolveTester = (testerString) => {
  return [
    {
      id: 'direct-use',
      path: path.resolve(__dirname, 'preset-tester/direct-use'),
    },
  ];
};

const resolveTestcase = (testcaseString) => {
  return [
    {
      id: 'case1',
      path: path.resolve(__dirname, 'preset-tester/direct-use/preset-testcase/case1'),
    },
    {
      id: 'case2',
      path: path.resolve(__dirname, 'preset-tester/direct-use/preset-testcase/case2'),
    },
    {
      id: 'case3',
      path: path.resolve(__dirname, 'preset-tester/direct-use/preset-testcase/case3'),
    },
    {
      id: 'case4',
      path: path.resolve(__dirname, 'preset-tester/direct-use/preset-testcase/case4'),
    },
    {
      id: 'case5',
      path: path.resolve(__dirname, 'preset-tester/direct-use/preset-testcase/case5'),
    },
    {
      id: 'case6',
      path: path.resolve(__dirname, 'preset-tester/direct-use/preset-testcase/case6'),
    },
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
  const testerMetadata = require(path.resolve(tester.path, 'tester.metadata.json'));
  const testerModule = require(path.resolve(tester.path, testerMetadata.main));

  testerModule(input);
}

// Resolve arguments
const [targets, testers, testcases] = [
  resolveTarget(program.target),
  resolveTester(program.tester),
  resolveTestcase(program.testcase),
];

{// Test and get result
  // Directly launch testers with targets and testcases information
  for (const target of targets) {
    for (const tester of testers) {
      for (const testcase of testcases) {
        launchTester(tester, createTesterInput(target, testcase, program.outDir));
      }
    }
  }
}
