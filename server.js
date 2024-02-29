// Define default values for your arguments
const defaults = {
    osc_server: '127.0.0.1',
    osc_port: 9000,
    mqtt_server: '127.0.0.1',
    mqtt_port: 1883
};
  
const argv = minimist(process.argv.slice(2), { default: defaults });
  
console.log(argv);