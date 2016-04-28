var crossroads = require('crossroads');
var js_controller = require('./controller/js_controller').handler;
var css_controller = require('./controller/css_controller').handler;
var sass_controller = require('./controller/sass_controller').handler;

crossroads.ignoreState = true;

//js处理器
crossroads.addRoute('/js/{filename}', js_controller);
//css处理器
crossroads.addRoute('/css/{filename}', css_controller);
//sass处理器
crossroads.addRoute('/sass/{filename}', sass_controller);


exports.router = crossroads;