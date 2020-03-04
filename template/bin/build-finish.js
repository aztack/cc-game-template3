module.exports = function(options) {
  const ejs = require('ejs');
  const fs = require('fs');
  const path = require('path');
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