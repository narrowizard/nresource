var colors = require("colors");

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

exports.info = function () {
    if (global.DEBUG) {
        var msg = "";
        for (var i = 0; i < arguments.length; i++) {
            msg += arguments[i];
        }
        var fileAndLine = traceCaller(1);
        console.log(('[Info]' + fileAndLine + ":" + msg).info);
    }
}

exports.warning = function () {
    if (global.DEBUG) {
        var msg = "";
        for (var i = 0; i < arguments.length; i++) {
            msg += arguments[i];
        }
        var fileAndLine = traceCaller(1);
        console.log(('[Warning]' + fileAndLine + ":" + msg).warn);
    }
}

exports.error = function () {
    if (global.DEBUG) {
        var msg = "";
        for (var i = 0; i < arguments.length; i++) {
            msg += arguments[i];
        }
        var fileAndLine = traceCaller(1);
        console.log(('[Error]' + fileAndLine + ":" + msg).error);
    }
}

/**
  * examines the call stack and returns a string indicating 
  * the file and line number of the n'th previous ancestor call.
  * this works in chrome, and should work in nodejs as well.  
  *
  * @param n : int (default: n=1) - the number of calls to trace up the
  *   stack from the current call.  `n=0` gives you your current file/line.
  *  `n=1` gives the file/line that called you.
  */
function traceCaller(n) {
    if (isNaN(n) || n < 0) n = 1;
    n += 1;
    var s = (new Error()).stack
        , a = s.indexOf('\n', 5);
    while (n--) {
        a = s.indexOf('\n', a + 1);
        if (a < 0) { a = s.lastIndexOf('\n', s.length); break; }
    }
    b = s.indexOf('\n', a + 1); if (b < 0) b = s.length;
    a = Math.max(s.lastIndexOf(' ', b) + 1, s.lastIndexOf('/', b));
    b = s.lastIndexOf(':', b);
    s = s.substring(a + 1, b);
    return s;
}