exports.info = function (msg) {
    if (global.DEBUG) {
        console.log('[Info]' + msg);
    }
}

exports.warning = function (msg) {
    if (global.DEBUG) {
        console.log('[Warning]' + msg);
    }
}

exports.error = function (msg) {
    if (global.DEBUG) {
        console.log('[Error]' + msg);
    }
}