var osc = require("osc");

const defaults = {
  osc_server: '127.0.0.1',
  remote_osc_port: 9000,
  local_address: '0.0.0.0',
  local_osc_port: 9001,
};

const argv = require('minimist')(process.argv.slice(2), { default: defaults });


//const oscClient = new Client(osc_server, remote_osc_port);

const oscClient = new osc.UDPPort({
  localAddress: argv.local_address,
  localPort: argv.local_osc_port
});

const startTime = Date.now();
// udpPort.on("ready", function () {

// oscClient.send('/test', startTime, () => {
//   console.log('Message sent');
// });


oscClient.on("message", (msg) => {
  const endTime = Date.now();
  console.log(endTime)
  console.log(`Acknowledgment received: ${msg}`);
  console.log(msg.args[0])
  console.log(`Round-trip time: ${endTime - parseInt(msg.args[0])} ms`);
  oscClient.close();
});

oscClient.on("ready", function () {
  oscClient.send({
      address: "/test",
      args: [
          {
              type: "s",
              value: startTime
          },
      ]
  }, argv.osc_server, argv.remote_osc_port);
});

// Open the socket.
oscClient.open();