require('colors')
const os = require('os');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto')
const shell = require('shelljs');
const pkg = require('../package.json');
const archiver = require('archiver');
const inquirer = require('inquirer');

const zipIgnores = {
  'jsb-link': ['frameworks/**', '.cocos-project.json', 'cocos-project-template.json', '*.zip']
};

module.exports = {
  pkg: pkg,
  projectDir: pkg.name,
  zipDir: `zips`,
  isWsl: isWsl,
  checkEnv() {
    const platform = process.platform;
    if (['win32', 'darwin'].indexOf(platform) < 0 && !isWsl()) {
      console.log(`Do not support platform ${platform}`);
      process.exit(-1);
    }
    const ccbin = process.env.CCBIN;
    if (!ccbin) {
      console.log(`Please set enviroment variable CCBIN which points to the executable of Cocos Creator!`.red.bold);
      console.log(`for example:`)
      console.log(`  Mac: export CCBIN=/Applications/CocosCreator.app/Contents/MacOS/CocosCreator`);
      console.log(`  Win: set CCBIN=c:\\CocosCreator\\CocosCreator.exe`);
      process.exit(-2);
    }
  },
  cocos(arg, verbose) {
    this.checkEnv();
    const cmd =`${process.env.CCBIN} ${arg}`;
    if (verbose) console.log(cmd.green.bold);
    if (isWsl()) {
      fs.writeFileSync('./bin/run-cocos.sh', cmd);
      shell.exec('npm run cocos');
    } else {
      shell.exec(cmd);
    }
  },
  npm(arg, verbose) {
    if (!shell.which('npm')) {
      console.log(`Can not find npm on your system, please install npm first`.red.bold);
      process.exit(-3);
    }
    const cmd = `npm ${arg}`;
    if (verbose) console.log(cmd.green.bold);
    shell.exec(cmd);
  },
  mkdir(arg) {
    shell.mkdir('-p', arg);
    return this;
  },
  rename(src, target) {
    shell.mv(src, target);
  },
  zip(source, output) {
    const builds = glob.sync(`${source}/*`).filter(p => fs.statSync(p).isDirectory());
    const platforms = builds.map(p => path.basename(p));
    const platformToBuildMap = builds.reduce((res, build, i) => {
      res[platforms[i]] = build;
      return res;
    }, {});

    let p = Promise.resolve(platforms[0]);
    if (platforms.length > 0) {
      p = inquirer.prompt([{
          type: 'list',
          name: 'platform',
          message: 'Please select platform to be pack',
          choices: platforms
        }])
        .then(answers => answers.platform);
    }

    return new Promise((resolve, reject) => {
      p.then(platform => {
        const archive = archiver('zip', { zlib: { level: 9 }});
        output = output.replace('.zip', `-${platform}.zip`);
        const stream = fs.createWriteStream(output);
        const cwd = platformToBuildMap[platform];
        archive
          .glob(`**/*`, {
            cwd: cwd,
            ignore: zipIgnores[platform] || []
          })
          .on('error', err => reject(err))
          .pipe(stream)
        ;

        stream.on('close', () => resolve(output));
        archive.finalize();
      })
    });
  },
  date(when) {
    return formatDate(when || new Date(), false, '-', '' ,'_');
  },
  md5Of: md5FileSync
};

const BUFFER_SIZE = 8192
function md5FileSync (filename, length) {
  console.log(filename);
  const fd = fs.openSync(filename, 'r')
  const hash = crypto.createHash('md5')
  const buffer = Buffer.alloc(BUFFER_SIZE)

  try {
    let bytesRead
    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE)
      hash.update(buffer.slice(0, bytesRead))
    } while (bytesRead === BUFFER_SIZE)
  } finally {
    fs.closeSync(fd)
  }
  return hash.digest('hex').slice(0, length);
}

function formatDate(withTime, noSec, sep1, sep2, sep3) {
  const date = new Date();
  if (typeof withTime === 'undefined') withTime = true;
  if (typeof noSec === 'undefined') noSec = false;
  if (typeof sep1 === 'undefined') sep1 = '-';
  if (typeof sep2 === 'undefined') sep2 = ':';
  if (typeof sep3 === 'undefined') sep3 = ' ';

  if (typeof date === 'string') date = new Date(date)
  const Y = date.getFullYear()
  const M = ('0' + (date.getMonth() + 1)).slice(-2)
  const D = ('0' + date.getDate()).slice(-2)
  const h = ('0' + date.getHours()).slice(-2)
  const m = ('0' + date.getMinutes()).slice(-2)
  const s = ('0' + date.getSeconds()).slice(-2)
  const part1 = `${Y}${sep1}${M}${sep1}${D}`
  var part2 = `${h}${sep2}${m}`
  if (!noSec) part2 = part2 + `${sep2}${s}`
  return withTime ? part1 + sep3 + part2 : part1
}

function isWsl() {
  const re = /microsoft/i;
	if (process.platform !== 'linux') return false;

	if (os.release().match(re)) return true;

	try {
		return fs.readFileSync('/proc/version', 'utf8').match(re);
	} catch (e) {
		return false;
	}
};