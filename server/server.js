const WebSocket = require('ws');
const fs = require('fs');
const configFile = 'server/config.json';
const globalConfigFile = './global_conf.json';
const { spawn } = require('child_process');

const requestTypes = {
  HANDSHAKE: 'handshake',
  ACTION: 'action',
  ERROR: 'error',
  WAVE: 'wave',
};

const WAITING_TIME = '3';

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      let data = fs.readFileSync(file, 'utf8');
      file_data = JSON.parse(data);
      resolve(file_data);
    } catch (err) {
      reject(err);
    }
  });
}

var config_data;
readFile(configFile)
  .then((config) => {
    config_data = config
  })
  .catch((err) => {
    throw err;
  })

var global_config_data;
readFile(globalConfigFile)
  .then((config) => {
    global_config_data = config
  })
  .catch((err) => {
    throw err;
  })

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  ws.on('message', async message => {
    await handle_request(JSON.parse(message), ws);
    console.log("Received message => %s\n", message);
  })
});

const handle_request = async (data, ws) => {
  console.log(data.type.toLowerCase())
  switch (data.type.toLowerCase()) {
    case requestTypes.HANDSHAKE:
      await handleHandshake(ws)
      break;
    case requestTypes.ACTION:
      await handleAction(data, ws)
      break;
    case requestTypes.ERROR:
      await handleError(data, ws) // no further error handling
      break;
    case requestTypes.WAVE:
      await handleWave(ws)
      break;
    default:
      console.error('Invalid request type:', data.type);
      handleError('Invalid request type', ws);
  }
}

const handleHandshake = (ws) => { // Handle handshake request
  return new Promise((resolve, reject) => {
    try {
      const message = {
        type: 'handshake',
        content: '',
      };
      ws.send(JSON.stringify(message));
      resolve();
    } catch (err) {
      console.error('Error handling handshake:', err);
      reject(err);
    }
  })
    .then(() => {
      console.log("Handshake successful")
    })
    .catch((err) => { console.error("Error handling handshake:", err) });;
}

const handleAction = (data, ws) => {
  return new Promise(async (resolve, reject) => {
    const content = data.content.toLowerCase();
    if (!global_config_data.movements.includes(content)) reject(new Error('Invalid movement type: ' + content));

    const pythonProcess = spawn('python3', ['server/robot.py', content, WAITING_TIME]);

    pythonProcess.stderr.on('data', (data) => {
      let err = new Error(`stderr output: ${data}`)
      reject(err);
    })
    pythonProcess.stdout.on('data', (stdout) => {
      console.log(`made movement: ${stdout}`);
      resolve(content)
    })

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })

  })
    .then(data => {
      const message = {
        type: 'action',
        content: `Performing action ${data}`,
      };
      ws.send(JSON.stringify(message));
    })
    .catch((err) => {
      console.error("Error handling action:", err)
      handleError(err, ws);
    });
}

const handleError = (data, ws) => {
  return new Promise((resolve, reject) => {
    const message = {
      type: 'error',
      content: data.content,
    };
    resolve(message);
    console.error('Error :', message);
  }).then((message) => {
    //console.error(message.content)
    ws.send(JSON.stringify(message));
    handleWave(ws);
  }).catch((err) => {
    console.error("Failure handling error; attempted termination of connection. -->", err)
    ws.send(err)
    ws.terminate()
    process.exit()
  });
}

const handleWave = (ws) => {
  return new Promise((resolve, reject) => {
    try {
      const message = {
        type: 'wave',
        content: 'Closing connection...',
      };
      ws.send(JSON.stringify(message));
      ws.close();
      resolve();
    } catch (err) {
      console.error('Error handling wave:', err);
      reject(err);
    }
  })
    .then(() => {
      console.log("Wave successful")
    })
    .catch((err) => {
      console.error("Error handling wave:", err)
      handleError(err.message, ws);
    });;
}
