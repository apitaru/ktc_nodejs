var sys = require('sys'),
    http = require('http'),
    path = require('path'),
    url = require('url'),  
    static = require('node-static'),
    io = require('socket.io');


var fileServer = new(static.Server)('.');


function handleRequest(req, res){
 var pathname = url.parse(req.url).pathname,
     components = pathname.split('/');
     
 if(components[1] == 'public') {
   fileServer.serve(req, res);
 } else if(pathname == '/') {
   fileServer.serveFile('/index.html', 200, {'Content-Type':'text/html'}, req, res);
 } else {
   res.writeHead(404, {'Content-Type': 'text/plain'});
   res.end('Page Not Found');
 }
}


server = http.createServer(handleRequest);
server.listen(8080);
  

var socket = io.listen(server);

socket.on('connection', function(client){
  var position = {x:Math.round(600*Math.random()),
                  y:100};
                  
  socket.broadcast({type:'clientJoin', data: {clientId: client.sessionId,
                                              position: position}});
                                              
  client.send({type:'clientInit', data: {clientId: client.sessionId,
                                         position: position}});
                                         
  client.on('message', function(message) { 
    switch(message.type) {
      case 'clientMove':
        socket.broadcast(message);
        break;
      case 'ping':
        socket.broadcast({type:'clientShow', data:message.data});
        break;
    }
  });
  
  client.on('disconnect', function(){
    socket.broadcast({type: 'clientLeave', data:{clientId:client.sessionId}});
  });
}); 