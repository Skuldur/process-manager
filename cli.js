const cli = require('commander');
const cliInterface = require('./js/cli-interface.js');

cli.allowUnknownOption(false);
cli
  .option('init', 'Initialize the process manager', cliInterface.init)
  .option('add <json>', 'Add processes that should run', cliInterface.add)
  .option('start <process>', 'Start process', cliInterface.start)
  .option('stop <process>', 'Stop process', cliInterface.stop)
  .option('restart <process>', 'Restart process', cliInterface.restart)
  .option('status [process]', 'Get the status of a process', cliInterface.getStatus)

  .parse(process.argv);

function addProcesses(processFile) {
  const processes = require(processFile);
  for(proc in processes) {
    factory.create(processes[proc]);
  }
}




// const processes = require("./processes.json");

// for(proc in processes) {
//   factory.create(processes[proc]);
// }
// factory.getAllStatuses("tesla");
// // factory.stop("tesla");
// // factory.getStatus("tesla");


// // setTimeout(function() {
// //   factory.restart("tesla");
// //   factory.getStatus("tesla");
// // }, 30000);

