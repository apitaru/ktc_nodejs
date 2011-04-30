function $(id) {
  return document.getElementById(id);
}

function toPx(n) {
  return n + "px";
}

function vSub(a, b) {
  return {x: a.x-b.x, y:a.y-b.y};
}

function vAdd(a, b) {
  return {x: a.x+b.x, y:a.y+b.y};
}

function position(el) {
  return {x: parseInt(el.style.left), y: parseInt(el.style.top)};
}

function pos(event) {
  return {x: event.clientX, y: event.clientY};
}

var square;
function initSquare(loc) {
  square = document.createElement('div');
  var dragging,
      start,
      sqStart;

  square.id = "square";
  updateSquare(square, loc);
  document.body.appendChild(square);

  square.addEventListener("mousedown", function(event) {
    dragging = true;
    sqStart = position(square);
    start = pos(event);
  }, false);

  square.addEventListener("mousemove", function(event) {
    if(!dragging) return;
    var delta = vSub(pos(event), start);
    updateSquare(square, vAdd(sqStart, delta));
    socket.send({type:'clientMove', data:{clientId:clientId, position:position(square)}});
  }, false);

  window.addEventListener("mousemove", function(event) {
    if(!dragging) return;
    var delta = vSub(pos(event), start);
    updateSquare(square, vAdd(sqStart, delta));
  }, false);

  square.addEventListener("mouseup", function(event) {
    if(dragging) {
      dragging = false;
    }
  }, false);

  window.addEventListener("mouseup", function(event) {
    if(dragging) {
      dragging = false;
    }
  }, false);
}


function updateSquare(square, loc) {
  square.style.left = toPx(loc.x);
  square.style.top = toPx(loc.y);
}


function drawSquare(loc) {
  var square = document.getElementById("square");
  if(!square) {
    initSquare(loc);
  } else {
    updateSquare(square, loc);
  }
}