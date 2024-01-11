const WebSocket = require('ws');
const Gpio = require('pigpio').Gpio;
const fs = require('fs');
const configFile = './config.json';


try {
  const data = fs.readFileSync(configFile, 'utf8');
  const config = JSON.parse(data);
  console.log(config);
} catch (err) {
  console.error('Error reading file:', err);
}


const motor1 = new Gpio(17, { mode: Gpio.OUTPUT });
const motor2 = new Gpio(17, { mode: Gpio.OUTPUT });
const motor3 = new Gpio(17, { mode: Gpio.OUTPUT });
const motor4 = new Gpio(17, { mode: Gpio.OUTPUT });


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  ws.send('Hello! Message From Server!!')
});