# Eternal Process Manager

The Process Manager allows you to manage the runtime of processes. It allows you to start and stop them at will as well as to keep track of their status and monitor their output.

## Installation

```
node install eternal-process-manager -g
```

## Adding processes

The Process Manager allows you to add processes through JSON files. E.g.

```
{
  "tesla": {
    "key": "tesla",
    "workingDirectory": "/mnt/c/Users/Skuli/Documents/GitHub/process-manager",
    "file": "node /mnt/c/Users/Skuli/Documents/GitHub/process-manager/test.js",
    "user": 0,
    "env": {}
  },
  "chewy": {
    "key": "chewy",
    "workingDirectory": "/mnt/c/Users/Skuli/Documents/GitHub/process-manager",
    "file": "node /mnt/c/Users/Skuli/Documents/GitHub/process-manager/test.js",
    "user": 0,
    "env": {}
  }
}
```

You are able to control which user is the owner of the process, what the working directory for the process should be and add environmental variables available to the process. To add them you run

```
pcm add <full-path-to-json-file>
```


## Commands

The command line interface of the Process Manager offers the following commands:

    add <json>         Add processes that should run
    remove <process>   Remove a process
    start <process>    Start process
    stop <process>     Stop process
    restart <process>  Restart process
    status <process>   Get the status of a process
    list               Get a list of all processes
    exit               Kill the process manager
    -h, --help         output usage information
