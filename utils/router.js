var crossroads = require('crossroads');
var js_controller = require('../controller/js_controller').handler;
var css_controller = require('../controller/css_controller').handler;
var sass_controller = require('../controller/sass_controller').handler;
var static_controller = require('../controller/static_controller').handler;
var ts_controller = require('../controller/ts_controller').handler;
crossroads.ignoreState = true;

//javascript
crossroads.addRoute('/js/{filename}', js_controller);
//css
crossroads.addRoute('/css/{filename}', css_controller);
//sass
crossroads.addRoute('/sass/{filename}', sass_controller);
//typecript
crossroads.addRoute("/ts/{filename}", ts_controller);
//静态文件处理器
crossroads.addRoute('/static/{filename}', static_controller);

exports.router = crossroads;