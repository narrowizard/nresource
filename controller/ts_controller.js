var log = require('../utils/log');
var gulpfile = require('../utils/gulpfile');
var mime = require('mime');

exports.handler = function () {

};

exports.tinyts = function (req, res, compress) {
    res.setHeader("Content-Type", mime.lookup("js") + ";charset=utf-8");
    var filenames = ["content/tinyts/validators/*.ts",
        "content/tinyts/third-party/*.ts",
        "content/tinyts/interfaces/*.ts",
        "content/tinyts/core/*.ts",
        "content/tinyts/controls/*.ts",
        "content/tinyts/models/*.ts"];
    gulpfile.tinytsCore(filenames, compress, res);
};