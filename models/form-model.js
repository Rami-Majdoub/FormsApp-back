const mongoose = require("mongoose");
const ObjectId = require("mongoose").ObjectId;
const Schema = mongoose.Schema;

const formSchema = new Schema({
	name: String,
	fields: {
		type: [
			{
				field_name: String,
				field_type: {
					type: String,
					default: 'text',
					enum: {
						values: ['text', 'number', 'date', 'button'],
						message: '{VALUE} is not supported',
					}
				},
			}
		],
	},
	submittions:{
		type: [
			{
				userId: ObjectId,
				values: { type: [ {field_name: String, field_value: String} ]}
			}
		]
	}
});
  
const Form = mongoose.model('From', formSchema);
module.exports = Form;