var nconf = require('nconf');


exports.loadConfig = function () {
    //读取配置文件
    nconf.file({ file: 'webconfig.json' });
    global.PORT = nconf.get("port");
    global.CONTENTPATH = nconf.get("contentPath");
    global.CACHEPATH = global.CONTENTPATH + nconf.get("cachePath");
    global.DEBUG = nconf.get("mode") == "debug";
    //缓存时间
    var maxAge = nconf.get('maxAge');
    global.MAXAGE = maxAge.days * 24 * 3600 + maxAge.hours * 3600 + maxAge.minutes * 60 + maxAge.seconds;
}