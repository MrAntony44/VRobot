const WebSocket = require('ws');
const fs = require('fs');
const configFile = './config.json';
const globalConfigFile = '../global_conf.json';
const { spawn } = require('child_process');

const requestTypes = {
  HANDSHAKE: 'handshake',
  ACTION: 'action',
  ERROR: 'error',
  WAVE: 'wave',
};

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
  // ws.send('Hello! Message From Server!!')
});

const handle_request = async (data, ws) => {
  switch (data.type) {
    case requestTypes.HANDSHAKE:
      await handleHandshake(ws)
        .then(() => { 
          console.log("Handshake successful")
        })
        .catch((err) => { console.error("Error handling handshake:", err) });
      break;
    case requestTypes.ACTION:
      await handleAction(data, ws)
        .then(() => { 
          console.log("Action successful")
        })
        .catch((err) => { 
          console.error("Error handling action:", err)
          handleError(ws);
        });
      break;
    case requestTypes.ERROR:
      await handleError(ws) // no further error handling
        .then((message) => { 
          console.error(message.content)
          console.log("Error handled successfully")
          ws.send(JSON.stringify(message));
          ws.close();
        })
        .catch((err) => { 
          console.error("Failure handling error; attempted termination of connection. -->", err) 
          ws.send(err)
          ws.terminate()
        });
      process.exit()
    case requestTypes.WAVE:
      await handleWave(ws)
        .then(() => { 
          console.log("Wave successful")
        })
        .catch((err) => {
          console.error("Error handling wave:", err)
          handleError(ws);
        });
        process.exit()
    default:
      console.error('Invalid request type:', data.type);
      handleError(ws);
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
  });
}

const handleAction = (data, ws) => {
  return new Promise((resolve, reject) => {
    try {
      if(!global_config_data.movements.includes(data.content)) throw new Error('Invalid movement type: ' + data.content);

      const pythonProcess = spawn('python3', ['robot.py', data.content, '10']);
      pythonProcess.stdout.on('data', (data) => {
        console.log(`made movement: ${data}`);
      })

      pythonProcess.stderr.on('data', (data) => {
        let err = new Error(`stderr output: ${data}`)
        console.error(err)
        throw err;
      })

      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        if(code === 1){
          throw new Error("exit code 1 python child")
        }
      })

      const message = {
        type: 'action',
        content: 'Performing action ${data.content}',
      };
      ws.send(JSON.stringify(message));
      resolve();
    } catch (err) {
      console.error('Error handling action:', err);
      reject(err);
    }
  });
}

const handleError = (ws) => {
  return new Promise((resolve, reject) => {
    try {
      const message = {
        type: 'error',
        content: 'Terminating connection...',
      };
      resolve(message);
    } catch (err) {
      console.error('Error handling handshake:', err);
      reject(err);
    }
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
  });
}