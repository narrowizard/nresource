var forever = require('forever-monitor');

var child = new (forever.Monitor)('server.js',{
        'logFile':'log/forever.log',
        'outFile':'log/out.log',
        'errFile':'log/err.log'
});

child.on('exit',function(){
        console.log('server has exited after 10 restarts');
});

child.start();
