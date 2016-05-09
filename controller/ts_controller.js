var log = require('../utils/log');
var gulpfile = require('../utils/gulpfile');
var mime = require('mime');

exports.handler = function (req, res, compress, filename) {
    var path = global.CONTENTPATH + "ts/" + filename.substr(0, filename.lastIndexOf(".")) + ".ts";
    gulpfile.tsCompiler(filename, path, compress, res);
};

exports.tinyts = function (req, res, compress) {
    res.setHeader("Content-Type", mime.lookup("js") + ";charset=utf-8");
    var filenames = ["content/tinyts/validators/*.ts",
        "content/tinyts/third-party/*.ts",
        "content/tinyts/interfaces/*.ts",
        "content/tinyts/core/*.ts",
        "content/tinyts/controls/*.ts",
        "content/tinyts/models/*.ts"];
    gulpfile.tinytsCompiler("core.js", filenames, compress, res);
};

exports.project = function (req, res, compress, projectname, viewmodel) {
    res.setHeader("Content-Type", mime.lookup("js") + ";charset=utf-8");
    var path = global.CONTENTPATH + "project/" + projectname + "/viewmodels/" + viewmodel.substr(0, viewmodel.lastIndexOf(".")) + ".ts";
    var filenames = [path];
    //增加jquery声明
    filenames.push("content/tinyts/third-party/*.ts");
    //增加tinyts接口声明
    filenames.push("content/tinyts/interfaces/*.ts");
    gulpfile.tinytsCompiler(projectname + "/" + viewmodel, filenames, compress, res);

};