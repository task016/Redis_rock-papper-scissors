var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('server:server');
var http = require('http');
const bluebird = require('bluebird');
const redis = require('redis');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const indexRouter = express.Router();
app.use('/', indexRouter);

// GET INDEX
indexRouter.get('/', function(req, res, next) {
  res.send('Hello world');
});

//SESSION MANAGEMENT
const activeSessions = 'active-sessions';
const sessionCounter = 'session-counter'
const sessionRouter = express.Router();

app.use('/sessions',sessionRouter);

// CREATE SESSION
sessionRouter.post('/', async function(req,res,next) {
  try{
    const {hostName,password} = req.body;
    let count = await rclient.incrAsync(sessionCounter);
    if(!hostName){
      res.statusCode = 401;
      return res.send(`Error creating session: Name field is required`);
    }

    await rclient.saddAsync(activeSessions, count);

    const sessionFields = ['password',password,'client-joined',0,'host-name',hostName,'host-points',0,'host-nextmove','','client-name','','client-points',0,'client-nextmove','','history',''];
    let sessionCreated = await rclient.hmsetAsync(`sessions:${count}`,sessionFields);

    if(sessionCreated == "OK"){
      res.statusCode = 201;
      return res.send({'sessionId':count,'password':password});
    }else{
      res.statusCode = 401;
      return res.send(`Error creating session`);
    }
      
  }catch(ex){
    console.log("EXCEPTION CAUGHT: "+ex);
  }
});

//GET SESSION
sessionRouter.get('/:sessionId', async function(req, res, next){
  try{
    const sessionId = req.params.sessionId;
    const session = await rclient.hgetallAsync(`sessions:${sessionId}`);
    res.statusCode = 200;
    res.send(session);
  }catch(ex){
    console.log(ex);
  }
});

//JOIN SESSION
sessionRouter.post('/:sessionId', async function(req, res, next) {
  try{
    const sessionId = req.params.sessionId;
    const {password, clientName} = req.body;
    
    const sessionExists = await rclient.sismemberAsync(activeSessions, sessionId);
    if(!sessionExists){
      res.statusCode = '401';
      return res.send('Invalid Session Id');
    }

    if(!clientName){
      res.statusCode = '401';
      return res.send('Name field is required');
    }

    const realPassword = await rclient.hgetAsync(`sessions:${sessionId}`,'password');
    if(realPassword != password){
      res.statusCode = '401';
      return res.send('Wrong password');
    }

    const hostName = await rclient.hgetAsync(`sessions:${sessionId}`,'host-name');
    if(hostName == clientName){
      res.statusCode = '401';
      return res.send('Host and client cannot have same names. Choose different name.');
    }

    const newFields = ['client-name',clientName,'client-joined',1];
    const sessionModified = await rclient.hmsetAsync(`sessions:${sessionId}`,newFields);

    res.statusCode = 200;
    return res.send('Session Joined');
  }catch(ex){
    console.log("EXCEPTION CAUGHT: "+ex);
  }
});

//PLAY (body parametri: password,name,move(rock,paper,scissors))
sessionRouter.post('/:sessionId/play', async function(req, res, next){
  try{

  }catch(ex){
    console.log(ex);
  }
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

//SERVER

//connect to redis db
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const rclient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

rclient.on('error', err =>{
  console.log(`REDIS ERROR: ${err}`);
});

rclient.on('ready', ()=>{
  console.log("Successfully connected to redis database");
})

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log(`Server listening on PORT: ${port}`);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

