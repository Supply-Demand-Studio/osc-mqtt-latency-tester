const mqtt = require('mqtt');

const defaults = {
    mqtt_broker: '10.0.0.71',
    //mqtt_broker: 'test.mosquitto.org',
    mqtt_port: 1883
};
  
const argv = require('minimist')(process.argv.slice(2), { default: defaults });
const mqtt_url = "mqtt://" + argv.mqtt_broker;

const client = mqtt.connect(mqtt_url);

const topic = 'latencyTestTopic';
const startTime = Date.now();

client.on('connect', () => {
  client.subscribe(topic, () => {
    client.publish(topic, JSON.stringify({ startTime }));
  });
});

client.on('message', (topic, message) => {
  const { startTime } = JSON.parse(message.toString());
  const endTime = Date.now();
  console.log(`Round-trip time: ${endTime - startTime} ms`);
  client.end();
});