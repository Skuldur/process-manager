const cp = require('child_process');
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
    console.log("FILE", this.file);
    this.proc = exec(this.file, { uid: this.user, env: this.env, cwd: this.workingDirectory });

    this.proc.on('error', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    this.proc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    this.proc.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    this.proc.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    this.setStatus(ACTIVE);
    console.log(this.proc.pid);
  }

  stop(callback) {
    kill(this.proc, callback);
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

function kill(process, callback) {
  const pid = process.pid;
  callback = callback || function () {};

  if(pid === undefined) {
    callback();
  } else {
    const signal = 'SIGTERM';
    console.log(pid);
    
    killTree(pid, 'SIGKILL', callback); 
  }
}

module.exports = TerminalProcess;


