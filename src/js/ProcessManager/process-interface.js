const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const kill = require('tree-kill');
const ProcessFactory = require('./ProcessFactory.js');

server.listen(80);

const factory = new ProcessFactory();

io.on('connection', (client) => {
  client.on('add', (processes) => {
    Object.keys(processes).map((processId) => {
      const proc = processes[processId];
      
      if(factory.contains(proc.key)) {
        client.emit('processExists', proc.key);
      } else {
        factory.create(proc);
      }
    });
    
    client.emit('messageReceived');
  });

  client.on('remove', (id) => {
    factory.remove(id);
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

  client.on('status', (id) => {
    const status = factory.getStatus(id);
    client.emit('statusReply', status);
  });

  client.on('list', () => {
    const list = factory.getAllStatuses();
    client.emit('listReply', list);
  });
});

process.on('SIGTERM', () => {
  server.close();
});

process.on('uncaughtException', function(err){
  console.log(err);
  server.close();
  kill(process.pid);
});
