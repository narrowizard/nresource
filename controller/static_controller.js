exports.handler = function (req, res, compress, filename) {
    res.writeHead(404, "file not found!");
    res.end();
}