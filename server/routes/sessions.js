var express = require('express');
var router = express.Router();
var rclient;

const activeSessions = 'active-sessions';
const sessionCounter = 'session-counter'


router.get('/', function(req, res, next) {
  res.send('Invalid Request');
});

// CREATE SESSION
router.post('/', async function(req,res,next) {
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
router.get('/:sessionId', async function(req, res, next){
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
router.post('/:sessionId', async function(req, res, next) {
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
router.post('/:sessionId/play', async function(req, res, next){
  try{

  }catch(ex){
    console.log(ex);
  }
});

module.exports = {
  router,
  setClient : function(inClient){
    rclient = inClient;
  }
}
