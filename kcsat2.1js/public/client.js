var socket, clientId, queue;

function init() {
  socket = new io.Socket('melville.westell.com');
  socket.connect(); 
  socket.on('connect', function(){ console.log('connect!'); }) 
  socket.on('message', handleMessage); 
  socket.on('disconnect', function(){ console.log('disconnect!'); })
}

function handleMessage(message) {
  switch(message.type) {
    case 'clientInit':
      clientId = message.data.clientId;  
      initSquare(message.data.position);
      break;
    case 'clientJoin':
      if(clientId && message.data.clientId != clientId) {
        var div = document.createElement('div');
        div.id = message.data.clientId;
        div.style.left = message.data.position.x + 'px';
        div.style.top = message.data.position.y + 'px';
        document.body.appendChild(div);
        socket.send({type:'ping', data:{clientId:clientId, position:position(square)}});
      }
      break;
    case 'clientMove':
      if(clientId && message.data.clientId != clientId) {
        var div = document.getElementById(message.data.clientId);
        div.style.left = message.data.position.x + 'px';
        div.style.top = message.data.position.y + 'px';
      }
      break;
    case 'clientShow':
      if(clientId && message.data.clientId != clientId) {
        var div = document.createElement('div');
        div.id = message.data.clientId;
        div.style.left = message.data.position.x + 'px';
        div.style.top = message.data.position.y + 'px';
        document.body.appendChild(div);
      }
      break;
    case 'clientLeave':
      if(clientId && message.data.clientId != clientId) {
        document.body.removeChild(document.getElementById(message.data.clientId));
      }
      break;
  }
}