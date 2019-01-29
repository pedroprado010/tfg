const fs = require('fs');
const util = require('util');
const path = require('path');

const fs_readdir = util.promisify(fs.readdir);

async function loadPlugins() {
  const modules_dir = path.resolve(__dirname, '../../plugins');
  const plugins = [];
  try {
    const files = await fs_readdir(modules_dir, { withFileTypes: true });
    const dirs = files.filter(file => file.isDirectory());
    const indexes = dirs.filter(dir => {
      try {
        fs.accessSync(
          path.resolve(modules_dir, dir.name, 'index.js'),
          fs.constants.F_OK
        );
        return true;
      } catch (error) {
        return false;
      }
    });
    plugins.push(
      ...indexes.map(i =>
        require(path.resolve(modules_dir, i.name, 'index.js'))
      )
    );
    return plugins;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = loadPlugins;
