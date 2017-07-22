const io = require('socket.io-client');
const spawn = require('child_process').spawn;
const fs = require('fs');
const colors = require('colors');
const kill = require('tree-kill');

const client = io.connect('http://localhost');
const out = fs.openSync('./logs/process-manager.log', 'a');
const err = fs.openSync('./logs/process-manager.log', 'a');

function init() {
  /* 
    We try killing the process manager in case the user runs the init
    while another process-manager is running. This would cause a runaway
    process-manager.
  */
  killProcessManager(() => {
    const child = spawn('node', ['./js/ProcessManager/process-interface.js'], {
      detached: true,
      stdio: ['ignore', out, err],
    });

    fs.writeFileSync('./data/processrunnerId.txt', child.pid, { flags: 'a' });

    process.exit(0);
  })
}

function add(file) {
  const processes = require(file);
  client.emit('add', processes);

  client.on('processExists', (processId) => {
    console.log(`Process `, colors.cyan(processId.toUpperCase()), " already exists");
  });
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
  client.emit('status', id);

  client.on('statusReply', (status) => {
    printStatus(status);
    client.disconnect();
  });
}

function getList() {
  client.emit('list');

  client.on('listReply', (list) => {
    list.map((proc) => {
      printStatus(proc);
    });
    client.disconnect();
  });
}

function printStatus(status){
  console.log(
    `${status.processId.toUpperCase()}`.cyan, 
    '       ',
    `${status.status.toUpperCase()}`[status.color]
  );
}

function exit() {
  killProcessManager(() => {
    process.exit(0);
  });
}

function killProcessManager(callback) {
  try {
    const pid = fs.readFileSync('./data/processrunnerId.txt');
    kill(pid, 'SIGTERM', callback);
  } catch(err) {
    callback();
  }

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
