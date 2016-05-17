var http = require('http');
var log = require('./utils/log');
var config = require('./utils/config');
var handleRequest = require('./utils/handler').handle;
var domain = require('domain');

var d = domain.create();

d.on('error', function (err) {
    log.error(err);
});

d.run(function () {
    config.loadConfig();

    http.createServer(handleRequest).listen(global.PORT);

    log.info('server running at ' + global.PORT);
});
