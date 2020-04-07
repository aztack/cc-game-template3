const $glob = require('glob');
const $path = require('path');
const pkg = require('../package.json');
const ccModulesDir = $path.resolve(pkg.name, 'assets', 'cc_modules', '**', 'package.json');
$glob.sync(ccModulesDir).forEach(pkgJsonPath => {
  const pkgJson = require(pkgJsonPath);
  console.log(`${pkgJson.name}@${pkgJson.version}`);
});
