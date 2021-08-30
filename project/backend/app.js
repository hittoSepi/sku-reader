const createError = require('http-errors');
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

// Logger
const winston = require('winston');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

// User controller and model
const userCtrl = require('./controls/user');
const userModel = require('./models/user');

// Hash
const bcrypt = require('bcryptjs')
const generateHash = async (password, sizeSalt) =>
	bcrypt
		.genSalt(sizeSalt)
		.then((salt) => {
			return bcrypt.hash(password, salt);
		})
		.then((hash) => {
			return hash;
		})
		.catch((error) => {
			throw error;
		});


require('./auth/auth');


// App Settings
const app = express();

// cross-origin-allow
app.use(cors())
app.use("*", cors())

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth
app.use(passport.initialize());
app.use(passport.session());

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use('/', indexRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), usersRouter);

function StartServer() {

	https.createServer({
		key: fs.readFileSync('/home/hitto/keys/privkey1.pem'),
		cert: fs.readFileSync('/home/hitto/keys/cert1.pem'),
	}, app)
		.listen(8081);
 /*	const nanopool = new NanopoolAPI(https, "ergo", "9evAt8dYjmkubAGoREusj7vmv5Q15v1XJRppoSaoCVGmUfyxG7R");
	nanopool.GeneralInfo((res) => {console.log(res)});
	nanopool.AccountBalance((res) => {console.log(res)})
	nanopool.AverageHashrateHours((res) => {console.log(res)})*/
}


// MongoDB Setup
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to database.");
	//removeAllUsers()
	StartServer();
});


function removeAllUsers() {
	userModel.remove({}, function (err, res) {
		console.log(err, res);
	})
}


function AddUser(email, pwd) {
	generateHash(pwd, 10).then((hash) => {
		const data = { email: email, password: hash };
		userCtrl.Add(data, (err, results) => {
			console.log(err, results)
		})
	}).catch(function (err) {
		throw err;
	});
}

//const NanopoolAPI = require('./api/nanopool');

// Start server
module.exports = app;
