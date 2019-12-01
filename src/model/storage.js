const storage = require('node-persist');

storage.init({
  dir: 'persist',
});

module.exports = storage;