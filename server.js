var http = require('http');
var log = require('./utils/log');
var config = require('./utils/config');
var handleRequest = require('./utils/handler').handle;

config.loadConfig();

http.createServer(handleRequest).listen(global.PORT);

log.info('server running at 8124');

