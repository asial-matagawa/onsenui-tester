const path = require('path');
const fs = require('fs');

module.exports = (input) => {
  {// Check if or not package exists
    const p = path.resolve(input.targetOutDir, 'npm-package', 'onsenui', input.target.core);

    console.log(`${JSON.stringify(input.target)} - ${input.tester.id} - ${input.testcase.id} - ${fs.existsSync(p) ? 'package exists' : 'package does not exist'}`);
  }
}
