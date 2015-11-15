var config = require('./config'),
      express = require('express')

module.exports = function() {
	var app = express();

	app.use(express.static('./public/'));

	return app;
};