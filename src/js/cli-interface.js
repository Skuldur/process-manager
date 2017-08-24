const io = require('socket.io-client');
const spawn = require('child_process').spawn;
const fs = require('fs');
const colors = require('colors');
const kill = require('tree-kill');

let client;
const out = fs.openSync(`${__dirname}/../logs/process-manager.log`, 'a');
const err = fs.openSync(`${__dirname}/../logs/process-manager.log`, 'a');

function verifyServerAvailability(cb) {
  client = io.connect('http://localhost');

  client.on('connect_error', function() {
    init(cb);
  });

  client.on('connect', function () {
    cb();
  });

  client.on('messageReceived', () => {
    client.disconnect();
    process.exit(0);
  });
}

function init(cb) {
  /* 
    We try killing the process manager in case the user runs the init
    while another process-manager is running. This would cause a runaway
    process-manager.
  */
  killProcessManager(() => {
    const child = spawn('node', [`${__dirname}/ProcessManager/process-interface.js`], {
      detached: true,
      stdio: ['ignore', out, err],
    });

    fs.writeFileSync(`${__dirname}/../data/processrunnerId.txt`, child.pid, { flags: 'a' });

    cb();
  })
}

function add(file) {
  verifyServerAvailability(() => {
    const processes = require(`${process.cwd()}/${file}`);
    client.emit('add', processes);

    client.on('processExists', (processId) => {
      console.log(`Process `, colors.cyan(processId.toUpperCase()), " already exists");
    });
  });
  
}

function remove(id) {
  verifyServerAvailability(() => {
    client.emit('remove', id);
  });
}

function start(id) {
  verifyServerAvailability(() => {
    client.emit('start', id);
  });
}

function stop(id) {
  verifyServerAvailability(() => {
    client.emit('stop', id);
  });
}

function restart(id) {
  verifyServerAvailability(() => {
    client.emit('restart', id);
  });
}

function getStatus(id) {
  verifyServerAvailability(() => {
    client.emit('status', id);

    client.on('statusReply', (status) => {
      printStatus(status);
      client.disconnect();
    });
  });
}

function getList() {
  verifyServerAvailability(() => {
    client.emit('list');

    client.on('listReply', (list) => {
      list.map((proc) => {
        printStatus(proc);
      });
      client.disconnect();
    });
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
    const pid = fs.readFileSync(`${__dirname}/../data/processrunnerId.txt`);
    kill(pid, 'SIGTERM', callback);
  } catch(err) {
    callback();
  }

}

module.exports = {
  add,
  remove,
  start,
  stop,
  restart,
  getStatus,
  getList,
  exit,
};
