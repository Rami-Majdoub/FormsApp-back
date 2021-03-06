const router = require("express").Router();
const { param } = require('express-validator');

const handleErrors = require("../middlewares/handle-errors");
const Form = require("../models/form-model");

// get form fields
router.get("/submit/:id",
	param("id").isMongoId(),
	handleErrors,
	async (req, res) => {
		const id = req.params.id;

		const form = await Form.findOne({ _id: id }, { _id: 1, name: 1, fields: 1});
		res.status(200).json(form);
	}
);

// submit form
router.post("/submit/:id",
	param("id").isMongoId(),
	handleErrors,
	async (req, res) => {
		const id = req.params.id;

		// TODO: check body
		const values = req.body.fields;

		const f = await Form.findOne({ _id: id });
		f.submittions.push({values});
		
		f.save((err, mongoResp) => {
			if (err){
				return res.status(500).json({ "message": "Error: couldn't save submittion", "error": err});
			} else {
				return res.status(200).json({ "message": "Form saved"});
			}
		});
	}
);

// submitted data of form
router.get("/data/:id",
	param("id").isMongoId(),
	handleErrors,
	async (req, res) => {
		const id = req.params.id;

		const form = await Form.findOne({ _id: id });	
		const submittions = form.submittions;

		// to store the unique names of the columns
		const columnNamesObj = {};
		// every submittion of from the user sent, will saved in an object in data
		const data = submittions.map(submittion => {
			const row = {};
			submittion.values.map( ({field_name, field_value}) =>{
				const key = field_name; 
				const value = field_value; 
				// console.log(`${key}: ${value}`);
				row[key] = value;
				columnNamesObj[key] = "";
			})
			return row;
		});

		return res.send({ data, columns: Object.keys(columnNamesObj)});
	}
);

// list forms (get all forms)
router.get("/", async (req, res) => {
	const forms = await Form.find({}, { _id: 1, name: 1});
	return res.status(200).json(forms);
});

// create form
router.post("/", (req, res) => {
	const body = req.body;
	
	// TODO: check body
	const newForm = new Form(body);	
	newForm.save((err, mongoResp) => {
		if (err || !mongoResp._id){
			return res.status(500).json({ "message": "Error: couldn't save form", "error": err});
		} else {
			return res.status(200).json({ "message": "Form saved"});
		}
	});
});

// edit form
router.put("/:id",
	param("id").isMongoId(),
	handleErrors,
	async(req, res) => {
		const id = req.params.id;
		
		// TODO: check body
		const { name, fields } = req.body;

		Form.updateOne({ "_id": id }, { name, fields }, (err, mongoResp) => {
			if (err){
				return res.status(500).json({ "message": "Error: couldn't update form", "error": err});
			} else {
				return res.status(200).json({ "message": "Form updated"});
			}
		});
	}
);

// delete form
router.delete("/:id",
	param("id").isMongoId(),
	handleErrors,
	(req, res) => {
		const id = req.params.id
		
		Form.deleteOne({ "_id": id }, (err, mongoResp) => {
			if (err || mongoResp.deletedCount != 1){
				return res.status(500).json({ "message": "Error: couldn't delete form"});
			} else {
				return res.status(200).json({ "message": "Form deleted"});
			}
		});
	}
);

module.exports = router;