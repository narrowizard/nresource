var log = require('../utils/log');
var gulpfile = require('../utils/gulpfile');
var mime = require('mime');

exports.handler = function (req, res, compress, filename) {
    var path = global.CONTENTPATH + "ts/" + filename.substr(0, filename.lastIndexOf(".")) + ".ts";
    gulpfile.tsCompiler(filename, path, compress, res);
};

exports.project = function (req, res, compress, projectname, viewmodel) {
    res.setHeader("Content-Type", mime.lookup("js") + ";charset=utf-8");
    var projectpath = global.CONTENTPATH + "project/" + projectname;
    var path = projectpath + "/viewmodels/" + viewmodel.substr(0, viewmodel.lastIndexOf(".")) + ".ts";
    var filenames = [path];
    filenames.push(projectpath + "/node_modules/tinyts/interfaces/*.ts");
    filenames.push(projectpath + "/node_modules/tinyts/third-party/*.ts");
    //项目的第三方ts库引入
    filenames.push(projectpath + "/declares/*.ts");
    gulpfile.tinytsCompiler(projectname, viewmodel, filenames, compress, res);

};

exports.test = function (req, res, compress, projectname, testname) {
    res.setHeader("Content-Type", mime.lookup("js") + ";charset=utf-8");
    var projectpath = global.CONTENTPATH + "project/" + projectname + "/autotest/";

}