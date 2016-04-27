var http = require('http');
var fs = require('fs');
var router = require('./router').router;
var nconf = require('nconf');
//全局变量
var PORT,CACHEPATH;

//读取配置文件
nconf.file({file:'webconfig.json'});
PORT = nconf.get("port");
CACHEPATH = nconf.get("cachePath");

http.createServer(function (req, res) {
    //router.dispatch
    router.parse(req.url,[res]);
}).listen(PORT);

console.log('server running at 8124');