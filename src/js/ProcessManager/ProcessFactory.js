const TerminalProcess = require('./Process.js');
const colors = require("colors");


class ProcessFactory {

  constructor() {
    this.processes = {};
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
    return { color, status, processId };
  }

  contains(processId) {
    return this.processes[processId] !== undefined;
  }

  getAllStatuses() {
    const list = [];

    for(const proc in this.processes) {
      list.push(this.getStatus(proc));
    }

    return list;
  }

  
}

module.exports = ProcessFactory;
