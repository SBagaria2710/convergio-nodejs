const bodyParser = require('body-parser')
const mongoose = require('mongoose') 
const express = require('express')
const app = express()
const User = require('./User.js')
const Input = require('./input.js')

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var mongoDB = 'mongodb://convergio:convergio@ds235768.mlab.com:35768/convergio';
mongoose.connect(mongoDB);
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => res.send('Hello World!'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
	if (req.body.email != null && req.body.username != null && req.body.password != null && req.body.type != null && req.body.company != null) {
		var userData = {
	    	email: req.body.email,
	    	username: req.body.username,
	    	password: req.body.password,
	    	type: req.body.type,
	    	company: req.body.company
  		}
  		console.log(userData);
		User.create(userData, function (err, user) {
		    if (err)
		      throw(err)
		    else
		      res.json({"status": "success"})
  		});
	}
});

app.post('/login', (req, res) => {
	if (req.body.email != null && req.body.password != null) {
	  	User.findOne({ 'email': req.body.email }, '_id password company type', function (err, user) {
			if (err)
				throw(err)
			if(!user) {
				res.json({"status": "No user found"});
				return;
			}
			if(req.body.password == user.password)
				res.json({"status": "success", "id": user._id,"type": user.type, "company": user.company});
			else
			res.json({"status": "incorrect password"});
		});
	}
});

app.post('/input', (req, res) => {
	if (req.body.userID != null && req.body.text != null && req.body.type !=null) {
		if(req.body.type == "admin")
			var status = "approved"
		else
			var status = "pending"
		var inputData = {
			userID: req.body.userID,
			userCompany: req.body.userCompany,
			text: req.body.text,
			status: status
		}
	  	Input.create(inputData, function (err, Input) {
			if (err)
				throw(err)
			else
		      res.json({"status": "success", "id": Input._id, "text": Input.text, "Status": Input.status});
		});
	}
});

app.post('/inputlist', (req, res) => {
	if (req.body.userID != null) {
	  	Input.find({'userID': req.body.userID, 'status': 'approved'}, '_id text status', function (err, Input) {
			if (err)
				throw(err)
			else{
		      res.json({"status": "success", "inputs": Input});
			}
		});
	}
});

app.post('/pendinglist', (req, res) => {
  	Input.find({'userCompany': req.body.userCompany, 'status': 'pending'}, '_id text status', function (err, Input) {
		if (err)
			throw(err)
		else{
	      res.json({"status": "success", "inputs": Input});
		}
	});
});

app.post('/updateStatus', (req, res) => {
	if (req.body.id != null) {

		Input.findByIdAndUpdate(req.body.id, { status: 'approved' }, function (err, input) {
			if(err)
				throw(err)
			else
				res.json({"status": "success"});
		});
	}
});

var port = process.env.PORT || 5000;
app.listen(port, () => console.log('Running on port ' + port));