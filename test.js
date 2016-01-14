#!/usr/bin/env node

var LXC = require('./index.js');

var lxc = new LXC();

var start = Date.now();
var current = start;
var last = start;
console.log('BEGIN: 0ms');

lxc.createUbuntu('node-test', function(error, info, stderr){
    if(error) { console.log(error); console.log(stderr); process.exit();}
    current = Date.now();
    console.log('CREATED: ' + (current - last) + 'ms');

    lxc.start('node-test', function(error, info, stderr){
        if(error) { console.log(error); console.log(stderr); process.exit();}
        last = current;
        current = Date.now();
        console.log('STARTED: ' + (current - last) + 'ms');

        lxc.attach('node-test', 'hostname', function(error, stdout, stderr){
            if(error) { console.log(error); console.log(stderr); process.exit();}
            last = current;
            current = Date.now();
            console.log('ATTACH HOSTNAME: ' + stdout.trim() + ', '  + (current - last) + 'ms');

            setTimeout(function(){

                lxc.info('node-test', function(error, info, stderr){
                    if(error) { console.log(error); console.log(stderr); process.exit();}
                    last = current;
                    current = Date.now();
                    console.log(JSON.stringify(info, null, 2));
                    console.log('INFO: ' + (current - last) + 'ms');

                    lxc.attach('node-test', 'apt-get install -y --no-install-recommends lxc', function(error, stdout, stderr){
                        if(error) { console.log(error); console.log(stderr); process.exit();}
                        last = current;
                        current = Date.now();
                        console.log('INSTALL LXC: '  + (current - last) + 'ms');

                        lxc.stop('node-test', function(error, info, stderr){
                            if(error) { console.log(error); console.log(stderr); process.exit();}
                            last = current;
                            current = Date.now();
                            console.log('STOPPED: ' + (current - last) + 'ms');

                            lxc.info('node-test', function(error, info, stderr){
                                if(error) { console.log(error); console.log(stderr); process.exit();}
                                last = current;
                                current = Date.now();
                                console.log(JSON.stringify(info, null, 2));
                                console.log('INFO: ' + (current - last) + 'ms');

                                lxc.execute('node-test', 'hostname', function(error, stdout, stderr){
                                    if(error) { console.log(error); console.log(stderr); process.exit();}
                                    last = current;
                                    current = Date.now();
                                    console.log('EXECUTE HOSTNAME: ' + stdout.trim() + ', '  + (current - last) + 'ms');

                                    lxc.destroy('node-test', function(error, info, stderr){
                                        if(error) { console.log(error); console.log(stderr); process.exit();}
                                        last = current;
                                        current = Date.now();
                                        console.log('DESTROYED: ' + (current - last) + 'ms');
                                        console.log('');
                                        console.log('TOTAL TIME: ' + (current - start) + 'ms');
                                    });
                                });
                            });
                        });
                    });
                });
            }, 2000);
        });
    });
});