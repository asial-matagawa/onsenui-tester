const path = require('path');
const process = require('process');
const fs = require('fs');
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
      id: 'core-file-check',
      path: path.resolve(__dirname, 'preset-tester/core-file-check'),
    },
  ];
};

const resolveTestcase = (testcaseString) => {
  return [
    {
      id: 'case1',
      path: path.resolve(__dirname, 'preset-tester/core-file-check/preset-testcase/case1'),
    },
    {
      id: 'case2',
      path: path.resolve(__dirname, 'preset-tester/core-file-check/preset-testcase/case2'),
    },
    {
      id: 'case3',
      path: path.resolve(__dirname, 'preset-tester/core-file-check/preset-testcase/case3'),
    },
    {
      id: 'case4',
      path: path.resolve(__dirname, 'preset-tester/core-file-check/preset-testcase/case4'),
    },
    {
      id: 'case5',
      path: path.resolve(__dirname, 'preset-tester/core-file-check/preset-testcase/case5'),
    },
    {
      id: 'case6',
      path: path.resolve(__dirname, 'preset-tester/core-file-check/preset-testcase/case6'),
    },
  ];
};

const getCanonicalPackages = (target) => {
  let canonicalPackages = [];

  for (const packageId of Object.keys(target)){
    switch (packageId) {
      case 'css-components':
        canonicalPackages.push({_type: 'npm', name: 'onsenui', version: target[packageId]});
        break;
      case 'core':
        canonicalPackages.push({_type: 'npm', name: 'onsenui', version: target[packageId]});
        break;
      case 'angular-onsenui':
        canonicalPackages.push({_type: 'npm', name: 'onsenui', version: target[packageId]});
        break;
      case 'angular2-onsenui':
        canonicalPackages.push({_type: 'npm', name: 'angular2-onsenui', version: target[packageId]});
        break;
      case 'react-onsenui':
        canonicalPackages.push({_type: 'npm', name: 'react-onsenui', version: target[packageId]});
        break;
      case 'vue-onsenui':
        canonicalPackages.push({_type: 'npm', name: 'vue-onsenui', version: target[packageId]});
        break;
      default:
        throw new Error(`Unknown package: ${packageId}`);
    }
  }

  // Remove duplicate values
  canonicalPackages = canonicalPackages.filter((canonicalPackage, index, array) => {
      const foundIndex = array.findIndex(v => {
        return v._type === canonicalPackage._type
          && v.name === canonicalPackage.name
          && v.version === canonicalPackage.version;
      });

      return foundIndex === index;
    }
  );

  return canonicalPackages;
};

const cacheCanonicalPackage = (targetOutDir, canonicalPackage) => {
  switch (canonicalPackage._type) {
    case 'npm': {
      const canonicalPackagePath = path.resolve(targetOutDir, 'npm-package', canonicalPackage.name, canonicalPackage.version);

      if (fs.existsSync(canonicalPackagePath)) {
        console.log(`npm package \`${canonicalPackage.name}@${canonicalPackage.version}\` is already cached. Skipped.`);
      } else {
        console.log(`npm package \`${canonicalPackage.name}@${canonicalPackage.version}\` is not cached.`);
        console.log(`Caching npm package \`${canonicalPackage.name}@${canonicalPackage.version}\`...`);
        // npm install
      }
      break;
    }
    default:
      throw new Error(`Unknown canonical package type: ${canonicalPackage._type}`);
  }
};

const createTesterInput = (target, tester, testcase, outDir) => {
  return {
    target: target,
    tester: tester,
    testcase: testcase,
    globalOutDir: outDir,
    targetOutDir: path.resolve(outDir, 'target'),
    testerOutDir: path.resolve(outDir, 'tester-sandbox', tester.id),
    testcaseOutDir: path.resolve(outDir, 'tester-sandbox', tester.id, 'testcase-sandbox', testcase.id),
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
    console.log(`Testing target ${JSON.stringify(target)}...`);

    const requiredCanonicalPackages = getCanonicalPackages(target);
    console.log(`Required canonical packages: ${JSON.stringify(requiredCanonicalPackages)}`);

    console.log(`Caching required canonical packages...`);
    for (const canonicalPackage of requiredCanonicalPackages) {
      cacheCanonicalPackage(path.resolve(program.outDir, 'target'), canonicalPackage);
    }

    for (const tester of testers) {
      for (const testcase of testcases) {
        launchTester(tester, createTesterInput(target, tester, testcase, program.outDir));
      }
    }
  }
}
