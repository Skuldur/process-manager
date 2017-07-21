const io = require('socket.io-client');
const spawn = require('child_process').spawn;
const fs = require('fs');
const colors = require('colors');
const kill = require('tree-kill');

const client = io.connect('http://localhost');
const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');

function init() {
  const child = spawn('node', ['./js/process-interface.js'], {
    detached: true,
    stdio: ['ignore', out, err],
  });

  fs.writeFileSync('./data/processrunnerId.txt', child.pid, { flags: 'a' });

  console.log(child.pid);
  process.exit(0);
}

function add(file) {
  const processes = require(file);
  client.emit('add', processes);
}

function start(id) {
  client.emit('start', id);
}

function stop(id) {
  client.emit('stop', id);
}

function restart(id) {
  client.emit('restart', id);
}

function getStatus(id) {
  client.on('statusReply', (status) => {
    console.log(`${status.processId} is ${status.status}`[status.color]);
    client.disconnect();
  });

  client.emit('getStatus', id);
}

function getList() {
  client.on('listReply', (list) => {
    console.log('');
    list.map((proc) => {
      console.log(`${proc.processId.toUpperCase()}`.cyan, '       ', `${proc.status.toUpperCase()}`[proc.color]);
    });
    console.log('');
    client.disconnect();
  });

  client.emit('list');
}

function exit() {
  const pid = fs.readFileSync('./data/processrunnerId.txt');
  kill(pid, 'SIGTERM', () => {
    process.exit(0);
  });
}

client.on('messageReceived', () => {
  client.disconnect();
  process.exit(0);
});

module.exports = {
  init,
  add,
  start,
  stop,
  restart,
  getStatus,
  getList,
  exit,
};
