const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const kill = require('tree-kill');
const ProcessFactory = require('./ProcessFactory.js');

server.listen(80);

const factory = new ProcessFactory();

io.on('connection', (client) => {
  client.on('add', (processes) => {
    Object.keys(processes).map((proc) => {
      factory.create(processes[proc]);
    });
    client.emit('messageReceived');
  });

  client.on('start', (id) => {
    factory.start(id);
    client.emit('messageReceived');
  });

  client.on('stop', (id) => {
    factory.stop(id);
    client.emit('messageReceived');
  });

  client.on('restart', (id) => {
    factory.restart(id);
    client.emit('messageReceived');
  });

  client.on('getStatus', (id) => {
    console.log('I am here');
    const status = factory.getStatus(id);
    client.emit('statusReply', status);
  });

  client.on('list', () => {
    const list = factory.getAllStatuses();
    client.emit('listReply', list);
  });
});

process.on('SIGTERM', () => {
  console.log("WAIT A MINUTE");
  server.close();
});

process.on('uncaughtException', function(err){
  // for(proc in this.processes) {
  //   this.stop(this.processes[proc]);
  // }
  console.log(err);
  // process.exit(72); 
  server.close();
  kill(process.pid);

});
