var osc = require("osc");

const defaults = {
    osc_server: '0.0.0.0',
    local_osc_port: 9000
};
const argv = require('minimist')(process.argv.slice(2), { default: defaults });

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

const oscServer = new osc.UDPPort({
    localAddress: argv.osc_server,
    localPort: argv.local_osc_port
});

oscServer.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", oscServer.options.localPort);
    });
});

oscServer.on('message', (msg, timetag, rinfo) => {
    console.log(`Message received: ${msg} from ${rinfo.address}:${rinfo.port}`);
    // Send acknowledgment back to the client
    oscServer.send({
        address: "/ack",
        args: [
            {
                type: "s",
                value: Date.now()
            },
        ]
    }, rinfo.address, rinfo.port);
});


oscServer.open();