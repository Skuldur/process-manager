const TerminalProcess = require('./Process.js');
const colors = require("colors");

class ProcessFactory {

  constructor() {
    this.processes = {};

    process.on('uncaughtException', function(err){
      for(proc in this.processes) {
        this.stop(this.processes[proc]);
      }
      console.log(err);
      process.exit(72);  
    });
  }

  create(args) {
    const proc = new TerminalProcess(args);
    this.processes[args.key] = proc;
  }

  start(processId) {
    this.processes[processId].start();
  }

  stop(processId) {
    this.processes[processId].stop();
  }

  restart(processId) {
    this.processes[processId].restart();
  }

  getStatus(processId) {
    const { color, status } = this.processes[processId].getStatus();
    console.log(color, `${processId} is ${status}`);
  }

  getAllStatuses() {
    for(const proc in this.processes) {
      const status = this.processes[proc].getStatus();
      console.log(`${proc.toUpperCase()}`.cyan, '       ',`${status.status.toUpperCase()}`[status.color]);
    }
  }

  
}

module.exports = ProcessFactory;
