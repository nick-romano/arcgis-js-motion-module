var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var watch = require('watch')
var sockjs = require('sockjs');
var http = require('http');

var app = express();

var sockjs_opts = { sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js" };
var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function (conn) {
    conn.on('data', function (message) {
        conn.write(message);
        watch.createMonitor(__dirname + "/app", function (monitor) {
            monitor.files['main.js'] // Stat object for my zshrc.
            monitor.on("created", function (f, stat) {
                // Handle new files
            })
            monitor.on("changed", function (f, curr, prev) {
                // Handle file changes
                console.log("a file has changed")
                setTimeout(() => {
                    conn.write('reload')
                }, 10)
            })
            monitor.on("removed", function (f, stat) {

            })
        })
    });
});


var publicDir = path.join(__dirname, 'app')
var docDir = path.join(__dirname, 'docs')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded 

app.use(express.static('app'));
app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'))
})

app.use(express.static('docs'));
app.get('/docs/', function (req, res) {
    res.sendFile(path.join(docDir, 'index.html'))
})

var server = http.createServer(app)

reloadServer = reload(app);


sockjs_echo.installHandlers(server, { prefix: '/echo' });


server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})

