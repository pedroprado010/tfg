const load_services = require('./load-services');

const boot = require('./boot-engine');
const start_network = require('./start-network');

function run(options) {
  load_services(options.services_dir)
    .then(boot)
    .then(() => start_network(options.mongo_url))
    .catch(err => {
      console.log('App failed to start', err);
    });
}

module.exports = run;
