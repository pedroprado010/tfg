require('dotenv').load();
const load_services = require('../core/load-services');
const path = require('path');

// const boot = require('./core/boot-engine');
// const start_network = require('./core/start-network');
const map_deps = require('../core/tools/map_dependencies');
load_services(path.resolve(__dirname, './case_01')).then(map_deps)
  // .then(boot)
  // .then(start_network);
