require('colors');
const pkg = require('../package.json');
const $path = require('path');
const $fs = require('fs');
const $glob = require('glob');
const $shell = require('shelljs');
const $inquirer = require('inquirer');
const HERE = '>>HERE<<';
const sendLogPath = 'send.log';
const androidStorage = '/storage/emulated/0/Android/data/<package>';
let dir = process.argv.slice(2).join('');

if (!dir) {
  if ($fs.existsSync(sendLogPath)) {
    dir = $fs.readFileSync(sendLogPath).toString().trim();
  } else {
    const builderJsonPath = $path.resolve(__dirname, '..', pkg.name, 'settings', 'builder.json');
    console.log(builderJsonPath);
    if ($fs.existsSync(builderJsonPath)) {
      const builderJson = require(builderJsonPath);
      dir = androidStorage.replace('<package>', builderJson.android.packageName);
    } else {
      console.error(`Please provide target dir name like: npm run send -- ${androidStorage}`.red.bold);
      process.exit(0);
    }
  }
} else {
  console.log(`Save ${dir} into send.log. You don't need to provide dir next time`.green);
  $fs.writeFileSync(sendLogPath, dir);
}

const adbPath = $shell.which('adb')
if (!adbPath) {
  console.error(`Can not find adb!`);
  process.exit(0);
} else {
  console.log(`Using ${adbPath}`.green.bold);
}

browse(dir);

// functions

function adb(args, slient = true) {
  const cmd = `adb ${args}`;
  console.log(cmd.gray);
  return $shell.exec(cmd, { silent: slient }).trim();
}

function ls(dir) {
  return adb(`shell ls ${dir}`).split('\n');
}

let lastSelectPath = dir;
let lastSelectDir;
function browse(dir) {
  const dirs = ls(dir);
  dirs.unshift(HERE);
  ask(dir, dirs).then(answers => {
    const target = answers.target;
    if (target !== HERE) {
      lastSelectPath = `${dir}/${target}`
      lastSelectDir = target
      browse(lastSelectPath);
    } else {
      copyBuild(lastSelectPath, lastSelectDir);
    }
  })
}

function copyBuild(targetPath, targetDir) {
  if (!targetPath || targetPath == '/') throw new Error('Can not remove target dir', targetPath);
  console.log(adb(`rm -r ${targetPath}`));
  const buildDir = `${pkg.name}/build`;
  if (!$fs.existsSync(buildDir)) {
    console.log(`Can not find '${buildDir}', please build project first`);
    return;
  }

  ask('Please select the directory to be copied', $glob.sync(`${buildDir}/*`))
    .then(answers => {
      if (answers.target) {
        adb(`push ${pkg.name}/build/${answers.target.replace(buildDir, '')}/* ${targetPath}`, false);
      }
    })
}

function ask(question, choices) {
  return $inquirer.prompt([{
    type: 'list',
    name: 'target',
    message: question,
    choices: choices
  }]);
}
