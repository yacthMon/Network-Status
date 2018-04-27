const Monitor = require('./model/monitor');
const Test = require('./model/test_connecting');
const network = require('network');
let monitor = new Monitor(), test;

monitor.log("Getting network config . . .");
network.get_public_ip(function (err, ip) {
  if (err) monitor.error(err);
  monitor.setConfig({ publicIP: ip });
  network.get_active_interface(function (err, interface) {
    if (err) monitor.error(err);
    monitor.setConfig({ privateIP: interface.ip_address, gateway: interface.gateway_ip, dns: '8.8.8.8' })
    monitor.log("Getting network config success");
    test = new Test({ publicIP: ip, interface: interface });

  })
})

module.exports = monitor;