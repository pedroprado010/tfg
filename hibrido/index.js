const load_services = require('./core/load-services');
const path = require('path');

const boot = require('./core/register');

load_services(path.resolve(__dirname, './case_01')).then(boot);
