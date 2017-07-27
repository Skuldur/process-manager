#! /usr/bin/env node
const cli = require('commander');
const cliInterface = require('./js/cli-interface.js');

cli.allowUnknownOption(false);
cli
  .option('init', 'Initialize the process manager', cliInterface.init)
  .option('add <json>', 'Add processes that should run', cliInterface.add)
  .option('remove <process>', 'Remove a process', cliInterface.remove)
  .option('start <process>', 'Start process', cliInterface.start)
  .option('stop <process>', 'Stop process', cliInterface.stop)
  .option('restart <process>', 'Restart process', cliInterface.restart)
  .option('status <process>', 'Get the status of a process', cliInterface.getStatus)
  .option('list', 'Get a list of all processes', cliInterface.getList)
  .option('exit', 'Kill the process manager', cliInterface.exit)

  .parse(process.argv);

