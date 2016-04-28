exports.info = function (msg) {
    if (global.DEBUG) {
        var fileAndLine = traceCaller(1);
        console.log('[Info]' + fileAndLine + ":" + msg);
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
    a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
    b = s.lastIndexOf(':', b);
    s = s.substring(a + 1, b);
    return s;
}