//global vars
global.appRoot = __dirname + "/node";

//require engines
var express         = require('express');
var bodyParser      = require('body-parser')
var cookieParser    = require('cookie-parser')
var session         = require('express-session')
var mongoose        = require('mongoose');

var config          = require('./node/classes/config.js');
var gameSocket      = require('./node/classes/gameSocket.js');
var playerApi       = require('./node/api/players.js');
var gameApi         = require('./node/api/game.js');


//init express engine
var app = express();

//settings
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//using
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({ secret: '1234567890QWERTY', resave: false, saveUninitialized: true }));
app.use(express.static(__dirname + '/public'));

//connect to mongo
mongoose.connect(config.appSettings().mongodb.host);

//init api's
playerApi.initialize(app);
gameApi.initialize(app);

//port listen
var activeport = null;

if (config.appSettings().env == "dev")
    activeport = config.appSettings().port
else
    activeport = process.env.PORT;

var io = require('socket.io').listen(app.listen(activeport), function () {
    console.log('listening at port', activeport);
});

//init socketing
gameSocket.initialize(io);

app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});