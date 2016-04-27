var http = require('http');
var fs = require('fs');
var mime = require('mime');
var crypto = require('crypto');
var fileconcat = require('./fileconcat.js');
var base = 'content';


/**
 * resolveUrl 解析url
 * @param url: /folder1/file1&file2&file3-filetype
 */
function resolveUrl(url, res) {
    //计算md5
    var md5sum = crypto.createHash('md5');
    var filename = md5sum.update(url).digest('hex');
    //去除root
    url = url.substr(1);
    var path = url.split("-");
    if (path.length !== 2) {
        //请求url格式错误
        res.writeHead(400);
        res.write('Bad request 400\n');
        res.end();
        return;
    }
    //文件类型
    var filetype = path[1];
    //content-type
    var type = mime.lookup(filetype);
    res.setHeader('Content-Type', type);
    
    // console.log(type);
    //文件名
    var files = path[0].split("&");

    // console.log(files, filetype, filename);
    fileconcat.generate(files, filetype, filename, res);
}


http.createServer(function (req, res) {
    //得到path
    pathname = base + req.url;
    resolveUrl(req.url, res);
    // console.log(req.url);
    //检查文件是否存在
    // fs.stat(pathname, function (err, stats) {
    //     if (err) {
    //         res.writeHead(404);
    //         res.write('Bad request 404\n');
    //         res.end();
    //     } else if (stats.isFile()) {
    //         var type = mime.lookup(pathname);
    //         console.log(type);
    //         res.setHeader('Content-Type', type);
    //         res.statusCode = 200;

    //         var file = fs.createReadStream(pathname);
    //         file.on("open", function () {
    //             file.pipe(res);
    //         });
    //         file.on('error', function (err) {
    //             console.log(err);
    //         });
    //     } else {
    //         res.writeHead(403);
    //         res.write('Directory access is forbidden\n');
    //         res.end();
    //     }
    // });
}).listen(8124);

console.log('server running at 8124');