var log = require('./log');
var crossroads = require('crossroads');
var js_controller = require('../controller/js_controller').handler;
var css_controller = require('../controller/css_controller').handler;
var sass_controller = require('../controller/sass_controller').handler;
var compass_controller = require('../controller/sass_controller').compass;
var static_controller = require('../controller/static_controller').handler;
var ts_controller = require('../controller/ts_controller').handler;
var tinyts_controller = require('../controller/ts_controller').tinyts;
var tinyts_project_controller = require('../controller/ts_controller').project;
var fontcompress_controller = require('../controller/font_controller').compress;
var fonttranslate_controller = require('../controller/font_controller').translate;


crossroads.ignoreState = true;

//javascript
crossroads.addRoute('/js/{filename}/:?param:', js_controller);
//css
crossroads.addRoute('/css/{filename}/:?param:', css_controller);
//sass
crossroads.addRoute('/sass/{filename}/:?param:', sass_controller);
//compass project without params
crossroads.addRoute('/compass/{filename*}', compass_controller);
crossroads.addRoute('/\/compass\/(.*?)\?(.*)', compass_controller);

//typescript(带参数)
crossroads.addRoute(/\/ts\/(.*?)\?(.*)/, ts_controller);
//typecript(不带参数)
crossroads.addRoute('/ts/{filename*}', ts_controller);

//tinyts项目支持(带参数)
crossroads.addRoute(/\/tinyts\/(.*?)\/([^?]*)\?(.*)/, tinyts_project_controller);
//tinyts项目支持(不带参数)
crossroads.addRoute('/tinyts/{projectname}/{viewmodel*}', tinyts_project_controller);

//静态文件处理器(带参数)
crossroads.addRoute(/\/static\/(.*?)\?(.*)/, static_controller);
//静态文件处理器(不带参数)
crossroads.addRoute('/static/{filename*}', static_controller);

//font 字体(转换控制器)
crossroads.addRoute('/font/{filename}', fonttranslate_controller);
//font 字体(压缩控制器)
crossroads.addRoute('/fontcompress/{filename}/:?param:', fontcompress_controller);

crossroads.bypassed.add(function (req, res) {
    log.warning(req.url, ' route bypassed');
    res.writeHead(404, 'file not found!');
    res.end();
});

exports.router = crossroads;