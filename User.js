var mongoose = require('mongoose')

typeList = ["admin", "employee", "guest"]

var userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	email: {type: String},
	password: {type: String},
	type: {type: String, enum: typeList},
	company: {type: String}
})

var User = mongoose.model('person', userSchema)
module.exports = User