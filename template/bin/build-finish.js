module.exports = function(options) {
  const ejs = require('ejs');
  const fs = require('fs');
  const path = require('path');

  // cocos-play
  const mainPath = path.resolve(options.project, 'build/cocos-play/main.js');
  if (options.actualPlatform === 'jkw-game' && fs.existsSync(mainPath)) {
    const src = fs.readFileSync(mainPath).toString();
    const packageJsonPath = path.resolve(options.project, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath)).name;
    fs.writeFileSync(mainPath, src.replace('$projectId$', pkg));
    return;
  }

  // web-mobile
  const indexPath = 'build/web-mobile/index.html';
  if (!fs.existsSync(indexPath) || options.actualPlatform !== 'web-mobile') {
    Editor.log(`Build-finish: Can not find ${indexPath}, stop post-process`);
    return;
  }
  const htmlPath = path.resolve(options.project, 'build/web-mobile/index.html')
  const tpl = fs.readFileSync(htmlPath).toString()
  const result = ejs.render(tpl, {
    project: options.title,
    orientation: options.webOrientation,
    webDebugger: ''
  });
  fs.writeFileSync(path.resolve(options.dest, 'index.html'), result);
  Editor.log(`Post-process index.html finished!`);
}