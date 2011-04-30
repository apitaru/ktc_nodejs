var http = require('http'),
    static = require('node-static'),
    io = require('socket.io'),
    fileServer = new(static.Server)('.');

server = http.createServer(function(req, res){
  fileServer.serveFile('/index.html', 200, {'Content-Type':'text/html'}, req, res);
});
server.listen(8080);

var socket = io.listen(server); 
socket.on('connection', function(client){
  client.on('message', function(message){ socket.broadcast(message); }) 
  client.on('disconnect', function(){ console.log('disconnect'); }) 
});