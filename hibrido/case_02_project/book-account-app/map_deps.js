require('dotenv').load();
const load_services = require('../../core/load-services');

const path = require('path');
const map_deps = require('../../core/tools/map_dependencies');
load_services(path.resolve(__dirname, './')).then(map_deps)
