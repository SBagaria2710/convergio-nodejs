var mongoose = require('mongoose')

statusOpt = ["approved", "pending"];

var inputSchema = new mongoose.Schema({
	userID: {type: String},
	userCompany: {type: String},
	text: {type: String},
	status: {type: String, enum: statusOpt}
})

var Input = mongoose.model('input', inputSchema)
module.exports = Input