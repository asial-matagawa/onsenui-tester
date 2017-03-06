const path = require('path');
const process = require('process');
const childProcess = require('child_process');
const fs = require('fs');
const fse = require('fs-extra');
const program = require('commander');
const chalk = require('chalk');

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
  const versions = [
    '0.6.0',
    '0.7.1',
    '1.0.1',
    '1.0.2',
    '1.0.3',
    '1.0.4',
    '1.1.0',
    '1.1.1',
    '1.1.2',
    '1.1.3',
    '1.1.4',
    '1.2.0-beta',
    '1.2.0',
    '1.2.1',
    '1.2.2',
    '1.3.0-beta',
    '1.3.0',
    '1.3.1',
    '1.3.2',
    '1.3.3',
    '1.3.4',
    '1.3.5',
    '1.3.6',
    '1.3.7',
    '1.3.8',
    '1.3.9',
    '1.3.10',
    '1.3.11',
    '1.3.12',
    '1.3.13',
    '1.3.16',
    '1.3.17',
    '2.0.0-alpha',
    '2.0.0-alpha.1',
    '2.0.0-alpha.2',
    '2.0.0-alpha.3',
    '2.0.0-alpha.4',
    '2.0.0-alpha.5',
    '2.0.0-alpha.6',
    '2.0.0-alpha.7',
    '2.0.0-alpha.11',
    '2.0.0-alpha.12',
    '2.0.0-alpha.13',
    '2.0.0-beta',
    '2.0.0-beta.1',
    '2.0.0-beta.2',
    '2.0.0-beta.3',
    '2.0.0-beta.4',
    '2.0.0-beta.5',
    '2.0.0-beta.6',
    '2.0.0-beta.7',
    '2.0.0-beta.8',
    '2.0.0-beta.9',
    '2.0.0-beta.10',
    '2.0.0-beta.11',
    '2.0.0-beta.12',
    '2.0.0-beta.13',
    '2.0.0-beta.14',
    '2.0.0-beta.15',
    '2.0.0-rc.1',
    '2.0.0-rc.2',
    '2.0.0-rc.3',
    '2.0.0-rc.4',
    '2.0.0-rc.5',
    '2.0.0-rc.6',
    '2.0.0-rc.7',
    '2.0.0-rc.8',
    '2.0.0-rc.9',
    '2.0.0-rc.10',
    '2.0.0-rc.11',
    '2.0.0-rc.12',
    '2.0.0-rc.13',
    '2.0.0-rc.14',
    '2.0.0-rc.15',
    '2.0.0-rc.16',
    '2.0.0-rc.17',
    '2.0.0-rc.18',
    '2.0.0-rc.19',
    '2.0.0',
    '2.0.1',
    '2.0.2',
    '2.0.3',
    '2.0.4',
    '2.0.5',
    '2.1.0'
  ];

  return versions.map(version => {
    return {
      'css-components': version,
      'core': version,
    };
  });
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

const cacheCanonicalPackage = async (temporaryDir, targetCacheDir, canonicalPackage) => {
  switch (canonicalPackage._type) {
    case 'npm': {
      const temporaryDirForNpm = path.resolve(temporaryDir, 'npm'); // Temporary directory for `npm`
      const canonicalPackageCacheDir = path.resolve(targetCacheDir, 'npm-package', canonicalPackage.name, canonicalPackage.version);

      // Download npm package as needed
      if (fs.existsSync(canonicalPackageCacheDir)) {
        console.log(chalk.green(`npm package ${chalk.blue(`\`${canonicalPackage.name}@${canonicalPackage.version}\``)} is already cached. Skipped.`));
      } else {
        console.log(chalk.yellow(`npm package ${chalk.blue(`\`${canonicalPackage.name}@${canonicalPackage.version}\``)} is not cached.`));
        console.log(`Caching npm package ${chalk.blue(`\`${canonicalPackage.name}@${canonicalPackage.version}\``)}...`);
        
        // Use local installed `npm`
        const npmPackagePath = require.resolve('npm');
        //console.log(npmPackagePath);

        // Download npm package to a temporary directory
        await (() => new Promise((resolve, reject) => {
          childProcess.spawn(
            'node',
            [
              npmPackagePath,
              'install',
              `--global`,
              `--prefix`,
              `${temporaryDirForNpm}`,
              `${canonicalPackage.name}@${canonicalPackage.version}`,
            ],
            {
              stdio: 'inherit'
            }
          )
          .once('exit', code => {
            resolve();
          });
        }))();

        // Move the downloaded package to the target cache directory
        fse.copySync(
          path.resolve(temporaryDirForNpm, 'lib', 'node_modules', canonicalPackage.name),
          canonicalPackageCacheDir
        );

        // Remove temporary directory for `npm`
        fse.removeSync(temporaryDirForNpm);
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
    targetCacheDir: path.resolve(outDir, 'target-cache'),
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

(async () => {// Test and get result
  // Directly launch testers with targets and testcases information
  for (const target of targets) {
    console.log(chalk.bold(`Testing ${chalk.blue(JSON.stringify(target))}...`));

    const requiredCanonicalPackages = getCanonicalPackages(target);
    console.log(`Required canonical packages: ${chalk.blue(JSON.stringify(requiredCanonicalPackages))}`);

    console.log(`Caching required canonical packages...`);
    for (const canonicalPackage of requiredCanonicalPackages) {
      await cacheCanonicalPackage(
        path.resolve(program.outDir, 'temporary'),
        path.resolve(program.outDir, 'target-cache'),
        canonicalPackage
      );
    }

    for (const tester of testers) {
      console.log(`Running ${chalk.magenta(tester.id)}...`);
      for (const testcase of testcases) {
        launchTester(tester, createTesterInput(target, tester, testcase, program.outDir));
      }
    }

    console.log();
  }
})();
