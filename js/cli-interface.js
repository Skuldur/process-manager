const io = require('socket.io-client');
const client = io.connect('http://localhost');
const spawn = require('child_process').spawn;
const fs = require('fs');
const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');

function init() {
  const child = spawn('node', ['./js/process-interface.js'], {
    detached: true,
    stdio: [ 'ignore', out, err ]
  });
  console.log(child.pid);
  process.exit(0);
}

function add(file) {
  const processes = require(file);
  client.emit('add', processes, function() {
    process.exit(0);
  });
}

function start(id) {
  client.emit('start', id, function() {
    process.exit(0);
  });
}

function stop(id) {
  client.emit('stop', id, function() {
    process.exit(0);
  });
}

function restart(id) {
  client.emit('restart', id, function() {
    process.exit(0);
  });
}

function getStatus(id) {
  console.log(id);
  const event = id === "" ? "getStatusOfAll" : "getStatus";
  console.log(event);

  client.on('reply', function() {
    console.log("penis");
  })

  client.emit(event, id, function() {
    process.exit(0);
  });
}

module.exports = {
  init,
  add,
  start,
  stop,
  restart,
  getStatus,
}