var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var logger = require('morgan')
var chokidar = require('chokidar')
var sockjs = require('sockjs');
var http = require('http');

var app = express();

var sockjs_opts = { sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js" };
var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function (conn) {
    console.log('yo')
    conn.on('data', function (message) {
        chokidar.watch(__dirname + "/app").on('change', function (event, path) {
            console.log("a file has changed")
            setTimeout(() => {
                conn.write('reload')
            }, 10)
        })
    });
});


var publicDir = path.join(__dirname, 'app')
var docDir = path.join(__dirname, 'docs')
var distDir = path.join(__dirname, 'dist');


app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded 

app.use(express.static("dist"));
app.get('/dist/*', function(req, res) {
    res.sendFile(path.join(__dirname, req.path))
})

app.use(express.static('docs'));
app.get('/docs/*', function (req, res) {
    console.log(req.path)
    res.sendFile(path.join(__dirname, req.path))
})

var server = http.createServer(app);


sockjs_echo.installHandlers(server, { prefix: '/echo' });


server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})

