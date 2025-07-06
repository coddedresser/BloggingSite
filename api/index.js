const app = require('../index'); // Import your Express app

module.exports = (req, res) => {
  app(req, res); // Let Express handle the request
};
