var http = require('http');
var router = require('./router').router;

http.createServer(function (req, res) {
    router.parse(req.url);
    res.end(result);
}).listen(8124);

console.log('server running at 8124');