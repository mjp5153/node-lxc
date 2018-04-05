#!/usr/bin/env node

const lxc = require('../index.js');

const start = Date.now();
var current = start;
var last = start;
console.log('BEGIN: 0ms');

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

lxc.list().then(containers => {
  containers.forEach(container => {
    console.log(`LS RESULTS: ${container}`);
  });
}, err => {
  console.log(err);
});

const containerName = 'node-test';

console.log(`creating ${containerName}...`);
lxc.createUbuntu(containerName).then(() => {
  current = Date.now();
  console.log(`CREATED: ${current - last} ms`);
  console.log(`starting ${containerName}...`);
  return lxc.start(containerName);
}).then(() => {
  last = current;
  current = Date.now();
  console.log(`STARTED: ${current - last} ms`);
  console.log(`executing cmd in ${containerName}...`);
  return lxc.attach(containerName, 'hostname');
}).then(stdout => {
  last = current;
  current = Date.now();
  console.log(`ATTACH HOSTNAME: ${stdout.trim()}, ${current - last} ms`);
  console.log('sleeping for 2 seconds...');
  return sleep(2000);
}).then(() => {
  console.log(`getting info for ${containerName}...`);
  return lxc.info(containerName);
}).then(info => {
  last = current;
  current = Date.now();
  console.log(JSON.stringify(info, null, 2));
  console.log(`INFO: ${current - last} ms`);
  console.log(`installing lxc in ${containerName}...`);
  return lxc.attach(containerName, 'apt-get install -y --force-yes --no-install-recommends lxc');
}).then(() => {
  last = current;
  current = Date.now();
  console.log(`INSTALL LXC: ${current - last} ms`);
  console.log(`stopping ${containerName}...`);
  return lxc.stop(containerName);
}).then(() => {
  last = current;
  current = Date.now();
  console.log(`STOPPED: ${current - last} ms`);
  console.log(`getting info for ${containerName}...`);
  return lxc.info(containerName);
}).then(info => {
  last = current;
  current = Date.now();
  console.log(JSON.stringify(info, null, 2));
  console.log(`INFO: ${current - last} ms`);
  console.log(`executing cmd in ${containerName}...`);
  return lxc.execute(containerName, 'hostname');
}).then(stdout => {
  last = current;
  current = Date.now();
  console.log(`EXECUTE HOSTNAME: ${stdout.trim()}, ${current - last} ms`);
  console.log(`destroying ${containerName}...`);
  return lxc.destroy(containerName);
}).then(() => {
  last = current;
  current = Date.now();
  console.log(`DESTROYED: ${current - last} ms`);
  console.log();
  console.log(`TOTAL TIME: ${current - start} ms`);
}).catch(err => {
  console.log(err);
});
