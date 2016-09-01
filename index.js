'use strict';
/*
    Wrapper Library for LXC Commands
*/

const exec = require('child_process').exec;
const os = require('os');

var lxc = {};
// Create Container: lxc-create -n <name> -t <template>
//    - example: lxc-create -n ubuntu-container -t ubuntu
lxc.create = function(name, template, callback){
    callback = callback || function() {};
    var cmd = 'lxc-create -n ' + name + ' -t ' + template;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// save needing to specify 'ubuntu'
lxc.createUbuntu = function(name, callback){
    lxc.create(name, 'ubuntu', callback);
};

// Destroy Container: lxc-destroy -n <name>
lxc.destroy = function(name, callback){
    callback = callback || function() {};
    var cmd = 'lxc-destroy -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Clone Container: lxc-clone -o <existing-name> -n <new-name>
lxc.clone = function(existingName, newName, callback){
    callback = callback || function() {};
    var cmd = 'lxc-clone -o ' + existingName + ' -n ' + newName;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Start Container: lxc-start -d -n <name>
lxc.start = function(name, callback){
    callback = callback || function() {};
    var cmd = 'lxc-start -d -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Stop Container: lxc-stop -n <name>
lxc.stop = function(name, callback){
    callback = callback || function() {};
    var cmd = 'lxc-stop -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Get info: lxc-info -n <name>
lxc.info = function(name, callback){
    callback = callback || function() {};
    var cmd = 'lxc-info -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback(null, lxc._parseInfo(stdout));
    });
};

lxc._parseInfo = function(rawInfo){
    rawInfo = rawInfo.split(os.EOL);
    var info = {};
    for (var i in rawInfo){
        //console.log(rawInfo[i]);
        if(rawInfo[i]){
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
lxc.attach = function(name, command, callback){
    callback = callback || function() {};
    var cmd = 'lxc-attach -n ' + name + ' -- ' + command;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback(null, stdout);
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
lxc.execute = function(name, command, callback){
    callback = callback || function() {};
    var cmd = 'lxc-execute -n ' + name + ' -- ' + command;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback(null, stdout);
    });
};

// Pass Resource: lxc-device -n <name> add <interface-name> <interface-name-in-container>
lxc.passResource = function(name, ifaceName, newIfaceName, callback){
    callback = callback || function() {};
    var cmd = 'lxc-device -n ' + name + ' add ' + ifaceName + ' ' + newIfaceName;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// List Containers: lxc-ls
lxc.list = function(callback){
    callback = callback || function() {};
    var cmd = 'lxc-ls';
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback(null, stdout.split(os.EOL));
    });
};

module.exports = lxc;
