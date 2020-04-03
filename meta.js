const $fs = require('fs');
const $path = require('path');

module.exports = {
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "label": "Project name, no space or punctuations, for example: tankWar"
    },
    "package": {
      "type": "string",
      "required": true,
      "label": "android package, for example: com.company"
    },
    "description": {
      "type": "string",
      "required": true,
      "label": "Project description",
      "default": "A Cocos Creator Project"
    },
    "author": {
      "type": "string",
      "label": "Author"
    },
    "ccmodulesgroup": {
      "type": "string",
      "required": true,
      "label": "cc module git group, for example: git+ssh://git@code.company.com/group/subgroup"
    }
  },
  complete: function (data, opts) {
    const cwd = $path.join(process.cwd(), data.inPlace ? '' : data.destDirName);
    const name = data.name;

    // rename src to game name
    const gameDir = $path.resolve(cwd, name);
    $fs.renameSync($path.resolve(cwd, 'src'), gameDir);

    // create folders
    ['scripts', 'animations', 'audios', 'scenes', 'skeletons'].forEach(function(dir){
      console.log(`creating ${dir} folder`);
      $fs.mkdirSync($path.resolve(cwd, `${name}/assets/${dir}`));
    });
    console.log(`creating zips folder`);
    $fs.mkdirSync($path.resolve(cwd, `./zips`));


    // install dependencies
    process.chdir(cwd);
    const npm = require('npm');
    const projectPkgJson = $path.join(cwd, 'package.json');
    npm.load(projectPkgJson, (err) => {
      if (!err) {
        npm.install(process.cwd(), (err) => {
          if (err) {
            console.log(`Install package failed:`, error);
          } else {
            npm.commands.run(['start']);
          }
        });
      } else {
        console.error(`Load ${projectPkgJson} failed`, err);
      }
    });
  },
  "skipInterpolation": ["src/creator.d.ts", "node_modules/**", "src/node_modules/**"]
}
