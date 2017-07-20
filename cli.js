

const cli = require('commander');
const ProcessFactory = require('./ProcessFactory.js');

const factory = new ProcessFactory();

tamscli.allowUnknownOption(false);
  tamscli
    .version(pkg.version)
    .option('add <json>', 'Configure TAMS settings file', addProcesses)
    .option('start <process>', 'Init release store, creating first TAMS release', factory.start)
    .option('stop <process>', 'Add artifact to new release', factory.stop)
    .option('status <process>', 'Remove artifact from new release', factory.getStatus)
    .option('allstatus', 'Remove artifact from new release', factory.getAllStatuses)

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

