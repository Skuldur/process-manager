const cp = require('child_process');
const fs = require('fs');
const exec = cp.exec;
const killTree = require('tree-kill');

const TERMINATED = 'inactive';
const ACTIVE = 'active';

const colors = {
  inactive: 'red',
  active: 'green',
};

class TerminalProcess {

  constructor(args) {
    this.key = args.key;
    this.file = args.file;
    this.workingDirectory = args.workingDirectory;
    this.user = args.user;
    this.environment = args.environment;

    this.start();
  }

  start() {
    this.logStream = fs.createWriteStream(`./logs/${this.key}.log`, {flags: 'a'});

    this.proc = exec(this.file, { uid: this.user, env: this.env, cwd: this.workingDirectory });

    this.proc.stdout.pipe(this.logStream);
    this.proc.stderr.pipe(this.logStream);
    
    this.proc.on('error', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    this.proc.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    this.setStatus(ACTIVE);
  }

  stop(callback) {
    kill(this.proc.pid, callback);
    this.setStatus(TERMINATED);
  }

  restart() {
    this.stop(() => {
      this.start();
    });
    
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return { color: colors[this.status], status: this.status };
  }
}

function kill(pid, callback) {
  callback = callback || function() {};

  if(pid === undefined) {
    callback();
  } else {
    killTree(pid, 'SIGTERM', callback); 
  }
}

module.exports = TerminalProcess;


