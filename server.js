var http = require('http');
var fs = require('fs');
var mime = require('mime');
var base = 'content';

http.createServer(function (req, res) {
    //得到path
    pathname = base + req.url;
    console.log(pathname);
    //检查文件是否存在
    fs.stat(pathname, function (err, stats) {
        if (err) {
            res.writeHead(404);
            res.write('Bad request 404\n');
            res.end();
        } else if (stats.isFile()) {
            var type = mime.lookup(pathname);
            console.log(type);
            res.setHeader('Content-Type', type);
            res.statusCode = 200;

            var file = fs.createReadStream(pathname);
            file.on("open", function () {
                file.pipe(res);
            });
            file.on('error', function (err) {
                console.log(err);
            });
        } else {
            res.writeHead(403);
            res.write('Directory access is forbidden\n');
            res.end();
        }
    });
}).listen(8124);

console.log('server running at 8124');