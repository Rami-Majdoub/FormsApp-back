const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: String,
	password: String,
	role: { 
		type: String,
		enum: { values: ['admin', 'user'] }}
});
  
const User = mongoose.model('User', userSchema);
module.exports = User;