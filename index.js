'use strict';
/*
Wrapper Library for LXC Commands
*/

const exec = require('child_process').exec;
const os = require('os');

var lxc = {};
// Create Container: lxc-create -n <name> -t <template>
//    - example: lxc-create -n ubuntu-container -t ubuntu
lxc.create = function(name, template) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-create -n ${name} -t ${template}`;
    exec(cmd, err => {
      if (err) {return reject(err);}
      return resolve();
    });
  });
};

// save needing to specify 'ubuntu'
lxc.createUbuntu = function(name) {
  return lxc.create(name, 'ubuntu');
};

// Destroy Container: lxc-destroy -n <name>
lxc.destroy = function(name) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-destroy -n ${name}`;
    exec(cmd, err => {
      if (err) {return reject(err);}
      return resolve();
    });
  });
};

// Clone Container: lxc-clone -o <existing-name> -n <new-name>
lxc.clone = function(existingName, newName) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-clone -o ${existingName} -n ${newName}`;
    exec(cmd, err => {
      if (err) {return reject(err);}
      return resolve();
    });
  });
};

// Start Container: lxc-start -d -n <name>
lxc.start = function(name) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-start -d -n ${name}`;
    exec(cmd, err => {
      if (err) {return reject(err);}
      return resolve();
    });
  });
};

// Stop Container: lxc-stop -n <name>
lxc.stop = function(name){
  return new Promise((resolve, reject) => {
    var cmd = `lxc-stop -n ${name}`;
    exec(cmd, err => {
      if (err) {return reject(err);}
      return resolve();
    });
  });
};

// Get info: lxc-info -n <name>
lxc.info = function(name) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-info -n ${name}`;
    exec(cmd, (err, stdout) => {
      if (err) {return reject(err);}
      return resolve(lxc._parseInfo(stdout));
    });
  });
};

lxc._parseInfo = function(rawInfo) {
  rawInfo = rawInfo.split(os.EOL);
  var info = {};
  for (var i in rawInfo) {
    //console.log(rawInfo[i]);
    if (rawInfo[i]) {
      var temp = rawInfo[i].trim().split(':');
      info[temp[0].trim()] = temp[1].trim();
    }
  }
  return info;
};

// Run Command in running container: lxc-attach -n <name> -- <command>
//    - command does not need quotes, flags ok
//    - example: lxc-attach -n icarus-1 -- uname -a
//    - redirects will not work, so use bash -c 'command' if you need redirects
//    - example: lxc-attach -n icarus-1 -- bash -c 'ps -ef | grep node'
lxc.attach = function(name, command) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-attach -n ${name} -- ${command}`;
    exec(cmd, (err, stdout) => {
      if (err) {return reject(err);}
      return resolve(stdout);
    });
  });
};

// Run Command in stopped container: lxc-execute -n <name> -- <command>
//    - command does not need quotes, flags ok
//    - example: lxc-execute -n icarus-1 -- uname -a
//    - redirects will not work, so use bash -c 'command' if you need redirects
//    - example: lxc-execute -n icarus-1 -- bash -c 'ps -ef | grep node'
//
// *NOTE* This requires the installation of lxc on the container:
//              apt-get install -y --no-install-recommends lxc
lxc.execute = function(name, command) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-execute -n ${name} -- ${command}`;
    exec(cmd, (err, stdout) => {
      if (err) {return reject(err);}
      return resolve(stdout);
    });
  });
};

// Pass Resource: lxc-device -n <name> add <interface-name> <interface-name-in-container>
lxc.passResource = function(name, ifaceName, newIfaceName) {
  return new Promise((resolve, reject) => {
    var cmd = `lxc-device -n ${name} add ${ifaceName} ${newIfaceName}`;
    exec(cmd, err => {
      if (err) {return reject(err);}
      return resolve();
    });
  });
};

// List Containers: lxc-ls
lxc.list = function() {
  return new Promise((resolve, reject) => {
    var cmd = 'lxc-ls';
    exec(cmd, (err, stdout) => {
      if (err) {return reject(err);}
      return resolve(stdout.trim().split(os.EOL));
    });
  });
};

module.exports = lxc;
