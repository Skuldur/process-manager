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
    //console.log(this.proc.pid);
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
  callback = callback || function() {console.log("")};

  if(pid === undefined) {
    callback();
  } else {
    
    killTree(pid, 'SIGTERM', callback); 
  }
}

module.exports = TerminalProcess;


