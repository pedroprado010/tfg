const fs = require('fs');
const util = require('util');
const path = require('path');

const fs_readdir = util.promisify(fs.readdir);

async function load_services(modules_dir) {
  try {
    const files = await fs_readdir(modules_dir, { withFileTypes: true });
    const dirs = files.filter(file => file.isDirectory());
    const indexes = dirs.filter(dir => {
      try {
        fs.accessSync(
          path.resolve(modules_dir, dir.name, 'register.js'),
          fs.constants.F_OK
        );
        return true;
      } catch (error) {
        return false;
      }
    });
    indexes.forEach(i => {
      require(path.resolve(modules_dir, i.name, 'register.js'));
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = load_services;
