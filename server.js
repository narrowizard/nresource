var http = require('http');
var router = require('./router').router;
var log = require('./utils/log');
var config = require('./utils/config');

config.loadConfig();

http.createServer(function (req, res) {
    //router.dispatch
    log.info("[Req]" + req.url);
    router.parse(req.url, [req, res]);
}).listen(global.PORT);

log.info('server running at 8124');