const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ProcessFactory = require('./ProcessFactory.js');

server.listen(80);

const factory = new ProcessFactory();

io.on('connection', function(client){

  client.on('add', function(processes){
    Object.keys(processes).map(function(proc) {
      factory.create(processes[proc]);
    });
  });

  client.on('start', function(id){
      factory.start(id);
  });

  client.on('stop', function(processes){
    factory.stop(id);
  });

  client.on('restart', function(processes){
    factory.restart(id);
  });

  client.on('getStatus', function(processes){
    //factory.getStatus(id);
    client.emit('reply', "dfhsdæfsdfsdfsdfsd");
  });

  client.on('getStatusOfAll', function(){
    //factory.getAllStatuses();
    client.emit('reply', "dfhsdæfsdfsdfsdfsd");
  });

});