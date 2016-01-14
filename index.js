/*
    Wrapper Library for LXC Commands
*/

var exec = require('child_process').exec;
var os = require('os');

var lxc = function(){
    var self = this;
};

// Create Container: lxc-create -n <name> -t <template>
//    - example: lxc-create -n ubuntu-container -t ubuntu
lxc.prototype.create = function(name, template, callback){
    callback = callback || () => {};
    var cmd = 'lxc-create -n ' + name + ' -t ' + template;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// save needing to specify 'ubuntu'
lxc.prototype.createUbuntu = function(name, callback){
    this.create(name, 'ubuntu', callback);
};

// Destroy Container: lxc-destroy -n <name>
lxc.prototype.destroy = function(name, callback){
    callback = callback || () => {};
    var cmd = 'lxc-destroy -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Clone Container: lxc-clone -o <existing-name> -n <new-name>
lxc.prototype.clone = function(existingName, newName, callback){
    callback = callback || () => {};
    var cmd = 'lxc-clone -o ' + existingName + ' -n ' + newName;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Start Container: lxc-start -d -n <name>
lxc.prototype.start = function(name, callback){
    callback = callback || () => {};
    var cmd = 'lxc-start -d -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Stop Container: lxc-stop -n <name>
lxc.prototype.stop = function(name, callback){
    callback = callback || () => {};
    var cmd = 'lxc-stop -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// Get info: lxc-info -n <name>
lxc.prototype.info = function(name, callback){
    var self = this;
    callback = callback || () => {};
    var cmd = 'lxc-info -n ' + name;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback(null, self._parseInfo(stdout));
    });
};

lxc.prototype._parseInfo = function(rawInfo){
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
lxc.prototype.attach = function(name, command, callback){
    callback = callback || () => {};
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
lxc.prototype.execute = function(name, command, callback){
    callback = callback || () => {};
    var cmd = 'lxc-execute -n ' + name + ' -- ' + command;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback(null, stdout);
    });
};

// Pass Resource: lxc-device -n <name> add <interface-name> <interface-name-in-container>
lxc.prototype.passResource = function(name, ifaceName, newIfaceName, callback){
    callback = callback || () => {};
    var cmd = 'lxc-device -n ' + name + ' add ' + ifaceName + ' ' + newIfaceName;
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

// List Containers: lxc-ls
lxc.prototype.list = function(callback){
    callback = callback || () => {};
    var cmd = 'lxc-ls';
    exec(cmd, function(error, stdout, stderr){
        if(error){
            callback(error, stdout, stderr);
        }
        callback();
    });
};

module.exports = lxc;