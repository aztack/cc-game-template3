const utils = require('./utils.js');
const date = utils.date();
const zipFileName = `${utils.pkg.name}-${date}.zip`;
const zipFilePath = `./${utils.zipDir}/${zipFileName}`;
utils.mkdir(`./${utils.zipDir}`).zip('./src/build', zipFilePath);
const hashOfZip = utils.md5Of(zipFilePath, 7);
const zipFileNameHashedPath = zipFilePath.replace('.zip', `-${hashOfZip}.zip`);
utils.rename(zipFilePath, zipFileNameHashedPath);
console.log(`${zipFileNameHashedPath} created`.green.bold);